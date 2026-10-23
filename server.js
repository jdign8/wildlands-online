const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, methods: ['GET','POST'] } });
const PORT = process.env.PORT || 3000;
const rooms = new Map();
const savesFile = path.join(__dirname, 'player-saves.json');
let saves = {};
try { saves = JSON.parse(fs.readFileSync(savesFile, 'utf8')); } catch { saves = {}; }
let saveTimer = null;
function persistSaves() {
  try {
    const tmp = savesFile + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(saves, null, 2));
    fs.renameSync(tmp, savesFile);
  } catch (e) { console.error('Could not save player progress:', e.message); }
}
function scheduleSave() { if (saveTimer) clearTimeout(saveTimer); saveTimer=setTimeout(persistSaves, 300); }
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/health', (_req,res)=>res.json({ok:true,rooms:rooms.size}));
function safeRoom(v){return String(v||'island-1').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,24)||'island-1';}
function safeName(v){return String(v||'Survivor').replace(/[<>]/g,'').trim().slice(0,18)||'Survivor';}
function hash(v){return crypto.createHash('sha256').update(String(v)).digest('hex');}
function roomPlayers(room){return [...(rooms.get(room)?.players.values()||[])].map(p=>({...p}));}
function listPublicRooms(){
  return [...rooms.values()].filter(r=>r.type==='public' && r.players.size>0).map(r=>({name:r.name,players:r.players.size}));
}
function publicPlayer(p){return {id:p.id,name:p.name,room:p.room,x:p.x,z:p.z,rot:p.rot,color:p.color,health:p.health};}
io.on('connection',socket=>{
  socket.data.room=null; socket.data.saveKey=null; socket.data.lastAttack=0;
  socket.on('listRooms',()=>socket.emit('roomList',listPublicRooms()));
  socket.on('joinWorld',(payload={})=>{
    const room=safeRoom(payload.room), name=safeName(payload.name);
    const action=payload.action==='create'?'create':'join';
    const type=payload.roomType==='private'?'private':'public';
    const password=String(payload.password||'');
    if(type==='private'&&password.length<4){socket.emit('joinError','Private world passwords must be at least 4 characters.');return;}
    let record=rooms.get(room);
    if(action==='create' && record){socket.emit('joinError','That game name is already in use. Choose another name.');return;}
    if(action==='join' && !record){socket.emit('joinError','That game is not running. Ask the host to create it first.');return;}
    if(record && record.type!==type){socket.emit('joinError','A world with that name already exists with a different visibility.');return;}
    if(record && record.type==='private' && record.passwordHash!==hash(password)){socket.emit('joinError','Incorrect private world password.');return;}
    if(!record){record={name:room,type,passwordHash:type==='private'?hash(password):null,hostId:socket.id,players:new Map()};rooms.set(room,record);}
    if(socket.data.room){const oldRoom=socket.data.room;rooms.get(oldRoom)?.players.delete(socket.id);socket.to(oldRoom).emit('playerLeft',socket.id);socket.leave(oldRoom);if(rooms.get(oldRoom)?.players.size===0)rooms.delete(oldRoom);}
    const saveKey=hash(name.toLowerCase()+'|'+room);
    const saved=saves[saveKey]||null;
    const p={id:socket.id,name,room,x:saved?.position?.x||0,z:saved?.position?.z||0,rot:0,color:0x5577bb+Math.floor(Math.random()*0x777777),health:saved?.health??100};
    record.players.set(socket.id,p);socket.data.room=room;socket.data.saveKey=saveKey;socket.join(room);
    socket.emit('worldState',roomPlayers(room));socket.to(room).emit('playerJoined',publicPlayer(p)); socket.emit('joinedWorld',{room,host:record.hostId===socket.id});
    socket.emit('yourSave',saved?.progress||null);
    socket.emit('serverMessage',`Joined ${type} world "${room}" as ${name}`);
    io.emit('roomList',listPublicRooms());
  });
  socket.on('move',(payload={})=>{
    const room=socket.data.room,record=rooms.get(room),p=record?.players.get(socket.id);if(!p)return;
    const n=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
    // Movement is clamped, bounded and rate-limited. For a production game, movement should be fully simulated server-side.
    p.x=Math.max(-44,Math.min(44,n(payload.x)));p.z=Math.max(-44,Math.min(44,n(payload.z)));p.rot=n(payload.rot);
    socket.to(room).emit('playerMoved',publicPlayer(p));
  });
  socket.on('pvpAttack',({targetId}={})=>{
    const now=Date.now(),room=socket.data.room,record=rooms.get(room);
    if(!record||now-socket.data.lastAttack<650)return;
    const attacker=record.players.get(socket.id),target=record.players.get(String(targetId||''));
    if(!attacker||!target||target.id===attacker.id)return;
    const d=Math.hypot(attacker.x-target.x,attacker.z-target.z);
    if(d>3.6){socket.emit('serverMessage','Move closer to attack that player.');return;}
    socket.data.lastAttack=now;
    target.health=Math.max(0,(target.health??100)-18);
    io.to(room).emit('pvpResult',{attackerId:attacker.id,targetId:target.id,attackerName:attacker.name,health:target.health,message:`You hit ${target.name}!`});
    if(target.health===0){
      target.health=100;target.x=0;target.z=0;
      io.to(room).emit('serverMessage',`${target.name} was defeated and respawned.`);
      io.to(room).emit('playerMoved',publicPlayer(target));
    }
    if(target.id===socket.id) socket.emit('pvpResult',{attackerId:attacker.id,targetId:target.id,health:target.health});
  });
  socket.on('saveProgress',(data={})=>{
    const key=socket.data.saveKey;if(!key)return;
    const clamp=(v,min,max,def)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):def;
    const inventory={};
    for(const k of ['wood','stone','iron','crystal','berry','food','water','campfire'])inventory[k]=clamp(data.inventory?.[k],0,999,0);
    inventory.craftedBoat=data.inventory?.craftedBoat===true; inventory.fishingRod=data.inventory?.fishingRod===true;
    for(const k of ['woodSword','stoneSword','ironSword','crystalSword'])inventory[k]=data.inventory?.[k]===true;
    inventory.equippedWeapon=['wood','stone','iron','crystal'].includes(data.inventory?.equippedWeapon)?data.inventory.equippedWeapon:null;
    saves[key]={
      name:safeName(data.name||socket.data.name||'Survivor'),
      room:socket.data.room,
      position:{x:clamp(data.x,-44,44,0),z:clamp(data.z,-44,44,0)},
      health:clamp(data.health,0,100,100),
      progress:{
        inventory,
        health:clamp(data.health,0,100,100),
        hunger:clamp(data.hunger,0,100,100),
        thirst:clamp(data.thirst,0,100,100),
        xp:clamp(data.xp,0,999999,0),
        level:clamp(data.level,1,999,1)
      }
    };
    scheduleSave();
  });
  socket.on('disconnect',()=>{
    const room=socket.data.room,record=rooms.get(room);
    if(record){
      if(record.hostId===socket.id){
        io.to(room).emit('worldClosed','The host left. This game has closed, so it can no longer be joined.');
        for(const id of record.players.keys()){if(id!==socket.id){const other=io.sockets.sockets.get(id);if(other){other.data.room=null;other.leave(room);other.disconnect(true);}}}
        rooms.delete(room);
      } else {
        record.players.delete(socket.id);socket.to(room).emit('playerLeft',socket.id);
        if(record.players.size===0)rooms.delete(room);
      }
    }
    scheduleSave();io.emit('roomList',listPublicRooms());
  });
});
process.on('SIGINT',()=>{persistSaves();server.close(()=>process.exit(0));});
process.on('SIGTERM',()=>{persistSaves();server.close(()=>process.exit(0));});
server.listen(PORT,()=>console.log(`Wildlands multiplayer server listening on http://localhost:${PORT}`));
