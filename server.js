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
const recordsFile = path.join(__dirname, 'xp-records.json');
let globalRecords = [];
try { globalRecords = JSON.parse(fs.readFileSync(recordsFile, 'utf8')); if (!Array.isArray(globalRecords)) globalRecords = []; } catch { globalRecords = []; }
function persistRecords() { try { const tmp=recordsFile+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(globalRecords, null, 2)); fs.renameSync(tmp, recordsFile); } catch(e) { console.error('Could not save XP records:', e.message); } }
function cleanCodename(v) { return String(v||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,18); }
function rankFor(score) { return globalRecords.filter(r => Number(r.xp) > score).length + 1; }
app.use(express.json({limit:'10kb'}));
app.get('/api/xp-records', (_req,res) => res.json(globalRecords.slice(0,5)));
app.post('/api/xp-records', (req,res) => {
  const xp = Math.max(0, Math.floor(Math.min(999999999, Number(req.body?.xp)||0)));
  const codename = cleanCodename(req.body?.codename);
  const existing = globalRecords.find(r => r.codename.toLowerCase() === codename.toLowerCase());
  const qualifying = globalRecords.length < 5 || xp > Number(globalRecords[globalRecords.length-1]?.xp || -1);
  if (!codename) { res.json({qualifies: qualifying, rank: rankFor(xp), needsName: qualifying}); return; }
  if (!qualifying && !existing) { res.json({qualifies:false, records:globalRecords.slice(0,5)}); return; }
  if (existing) globalRecords = globalRecords.filter(r => r.codename.toLowerCase() !== codename.toLowerCase());
  globalRecords.push({codename, xp, achievedAt: new Date().toISOString()});
  globalRecords.sort((a,b)=>b.xp-a.xp || a.codename.localeCompare(b.codename));
  globalRecords = globalRecords.slice(0,5); persistRecords();
  res.json({qualifies:globalRecords.some(r=>r.codename.toLowerCase()===codename.toLowerCase() && r.xp===xp), records:globalRecords});
});
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
function publicPlayer(p){return {id:p.id,name:p.name,room:p.room,x:p.x,z:p.z,rot:p.rot,color:p.color,health:p.health,xp:p.xp||0,level:p.level||1};}
function broadcastLeaderboard(room){const record=rooms.get(room);if(!record)return;const rows=[...record.players.values()].map(p=>({id:p.id,name:p.name,xp:Math.max(0,Number(p.xp)||0),level:Math.max(1,Number(p.level)||1)})).sort((a,b)=>b.xp-a.xp||b.level-a.level||a.name.localeCompare(b.name));io.to(room).emit('leaderboard',rows);}
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
    if(!record){record={name:room,type,passwordHash:type==='private'?hash(password):null,hostId:socket.id,players:new Map(),boss:{hp:1200,maxHp:1200,defeated:false,contributors:{}}};rooms.set(room,record);}
    if(socket.data.room){const oldRoom=socket.data.room;rooms.get(oldRoom)?.players.delete(socket.id);socket.to(oldRoom).emit('playerLeft',socket.id);socket.leave(oldRoom);if(rooms.get(oldRoom)?.players.size===0)rooms.delete(oldRoom);}
    const saveKey=hash(name.toLowerCase()+'|'+room);
    const saved=saves[saveKey]||null;
    const p={id:socket.id,name,room,x:saved?.position?.x||0,z:saved?.position?.z||0,rot:0,color:0x5577bb+Math.floor(Math.random()*0x777777),health:saved?.health??100,xp:saved?.progress?.xp||0,level:saved?.progress?.level||1};
    record.players.set(socket.id,p);socket.data.room=room;socket.data.saveKey=saveKey;socket.join(room);
    socket.emit('worldState',roomPlayers(room));socket.emit('bossState',record.boss);socket.to(room).emit('playerJoined',publicPlayer(p)); socket.emit('joinedWorld',{room,host:record.hostId===socket.id});
    socket.emit('yourSave',saved?.progress||null);
    socket.emit('serverMessage',`Joined ${type} world "${room}" as ${name}`);
    io.emit('roomList',listPublicRooms());broadcastLeaderboard(room);
  });
  socket.on('move',(payload={})=>{
    const room=socket.data.room,record=rooms.get(room),p=record?.players.get(socket.id);if(!p)return;
    const n=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
    // Movement is clamped, bounded and rate-limited. For a production game, movement should be fully simulated server-side.
    p.x=Math.max(-44,Math.min(44,n(payload.x)));p.z=Math.max(-44,Math.min(44,n(payload.z)));p.rot=n(payload.rot);
    const oldXP=p.xp||0,oldLevel=p.level||1;p.xp=Math.max(0,Math.min(999999,n(payload.xp,p.xp||0)));p.level=Math.max(1,Math.min(999,n(payload.level,p.level||1)));
    socket.to(room).emit('playerMoved',publicPlayer(p));if(p.xp!==oldXP||p.level!==oldLevel)broadcastLeaderboard(room);
  });
  socket.on('bossAttack',({damage}={})=>{
    const room=socket.data.room,record=rooms.get(room),attacker=record?.players.get(socket.id);
    if(!record||!attacker||!record.boss||record.boss.defeated)return;
    if(Math.hypot(attacker.x-13,attacker.z-10)>10){socket.emit('serverMessage','Move closer to the Island Guardian to attack it.');return;}
    const now=Date.now(); if(now-socket.data.lastBossAttack<450)return; socket.data.lastBossAttack=now;
    const hit=Math.max(5,Math.min(50,Number(damage)||10)); record.boss.hp=Math.max(0,record.boss.hp-hit);
    record.boss.contributors[attacker.id]=(record.boss.contributors[attacker.id]||0)+hit;
    if(record.boss.hp===0){record.boss.defeated=true;io.to(room).emit('bossDefeated',{name:attacker.name,rewards:{xp:250,coins:10,crystal:5,iron:15}});}
    io.to(room).emit('bossState',record.boss);
  });
  socket.on('pvpAttack',({targetId,damage}={})=>{
    const now=Date.now(),room=socket.data.room,record=rooms.get(room);
    if(!record||now-socket.data.lastAttack<650)return;
    const attacker=record.players.get(socket.id),target=record.players.get(String(targetId||''));
    if(!attacker||!target||target.id===attacker.id)return;
    const d=Math.hypot(attacker.x-target.x,attacker.z-target.z);
    if(d>3.6){socket.emit('serverMessage','Move closer to attack that player.');return;}
    socket.data.lastAttack=now;
    const hitDamage=Math.max(10,Math.min(50,Number.isFinite(Number(damage))?Number(damage):10));
    target.health=Math.max(0,(target.health??100)-hitDamage);
    io.to(room).emit('pvpResult',{attackerId:attacker.id,targetId:target.id,attackerName:attacker.name,health:target.health,message:`You hit ${target.name}!`});
    if(target.health===0){
      target.health=100;target.x=0;target.z=0;
      io.to(room).emit('serverMessage',`${target.name} was defeated and respawned.`);
      io.to(room).emit('playerMoved',publicPlayer(target));
    }
    if(target.id===socket.id) socket.emit('pvpResult',{attackerId:attacker.id,targetId:target.id,health:target.health});
    broadcastLeaderboard(room);
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
    const activeRoom=socket.data.room,activePlayer=rooms.get(activeRoom)?.players.get(socket.id);if(activePlayer){activePlayer.xp=clamp(data.xp,0,999999,activePlayer.xp||0);activePlayer.level=clamp(data.level,1,999,activePlayer.level||1);broadcastLeaderboard(activeRoom);}
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
    scheduleSave();io.emit('roomList',listPublicRooms());if(room)broadcastLeaderboard(room);
  });
});
process.on('SIGINT',()=>{persistSaves();server.close(()=>process.exit(0));});
process.on('SIGTERM',()=>{persistSaves();server.close(()=>process.exit(0));});
server.listen(PORT,()=>console.log(`Wildlands multiplayer server listening on http://localhost:${PORT}`));
