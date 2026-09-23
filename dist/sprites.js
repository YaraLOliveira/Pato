// Arte original do patinho em todas as cenas; altere este mapa para usar um PNG novo.
// Objetos pequenos (buquê, caneca, rosa...) ficam em scenes.js → sprites.
const spriteFiles={
  // ♥ Coração — Derretendo de Amor (o derretimento é feito em cima deste PNG, sem alterá-lo)
  'melt-blush':'assets/patinho.png','melt-beat':'assets/patinho.png','melt-soft':'assets/patinho.png',
  'melt-puddle':'assets/patinho.png','melt-reform':'assets/patinho.png',
  // ▣ Trabalho — Tá Tudo Bem
  'work-monday':'assets/patinho.png','work-email':'assets/patinho.png','work-meeting':'assets/patinho.png',
  'work-fine':'assets/patinho.png','work-friday':'assets/patinho.png',
  // ✦ Safado — O Galanteador
  'flirt-arrive':'assets/patinho.png','flirt-reveal':'assets/patinho.png','flirt-rose':'assets/patinho.png',
  'flirt-serenade':'assets/patinho.png','flirt-petals':'assets/patinho.png',
  // 🍷 Romântico — O Encontro
  'heart-invite':'assets/patinho.png','heart-ready':'assets/patinho.png',
  'heart-dinner':'assets/patinho-romantico.png','romantic-toast':'assets/patinho-romantico.png',
  'heart-music':'assets/patinho-romantico.png','heart-dance':'assets/patinho-romantico.png','heart-moon':'assets/patinho.png',
  // Momentos secretos
  'secretLove':'assets/patinho-romantico.png','secretChaos':'assets/patinho.png','secretWink':'assets/patinho.png',
  'guard':null
};
const spriteStyles={
  'heart-invite':{eyes:'down',cheeks:true,flower:true},'heart-ready':{eyes:'open',bow:true,sparkle:true},
  'heart-dinner':{eyes:'half',cheeks:true,wine:true,bow:true},'heart-music':{eyes:'closed',cheeks:true,bow:true},
  'heart-dance':{eyes:'closed',cheeks:true,bow:true},'heart-moon':{eyes:'closed',cheeks:true,kiss:true},
  'work-late':{eyes:'wide',hair:true,alarm:true},'work-meeting':{eyes:'sleepy',tie:true},
  'work-coffee':{eyes:'wide',coffee:true,tie:true},'work-overtime':{eyes:'sleepy',tie:true,eyeBags:true},
  'work-friday':{eyes:'wide',tie:true,joy:true},
  'night-queue':{eyes:'open',bow:true},'night-security':{eyes:'wink',bow:true},
  'night-entered':{eyes:'wide',bow:true,joy:true},'night-dancefloor':{eyes:'closed',bow:true,joy:true},
  'night-charm':{eyes:'wink',bow:true,cheeks:true},
  secretLove:{eyes:'closed',cheeks:true,wine:true,bow:true,petals:true},
  secretChaos:{eyes:'wide',tie:true,phone:true},secretWink:{eyes:'wink',bow:true,cheeks:true,heart:true}
};
function drawDuck(style={}){
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
  const outline='#563039',yellow='#ffce49',light='#ffe36b',orange='#f48a2c',dark='#493348';
  // Silhueta, asa, bico e pés compartilham a mesma grade de 32 pixels.
  rect(10,4,12,2,outline);rect(8,6,16,2,outline);rect(7,8,18,9,outline);
  rect(6,17,20,2,outline);rect(4,19,23,8,outline);rect(7,27,18,2,outline);
  rect(9,6,14,2,light);rect(8,8,16,9,yellow);rect(7,17,17,3,yellow);
  rect(5,20,21,6,yellow);rect(7,26,17,1,light);rect(8,19,7,5,light);
  rect(21,15,7,2,outline);rect(23,17,6,3,outline);rect(22,16,6,2,orange);rect(23,18,5,1,'#ffac43');
  rect(9,28,4,2,orange);rect(8,30,6,1,outline);rect(20,28,4,2,orange);rect(19,30,6,1,outline);
  rect(5,23,5,2,'#eebd45');rect(7,24,4,1,outline);
  if(style.eyes==='closed'){rect(14,12,3,1,dark);rect(20,12,3,1,dark);rect(15,13,2,1,dark);rect(21,13,2,1,dark)}
  else if(style.eyes==='half'||style.eyes==='sleepy'){rect(14,11,4,1,dark);rect(20,11,4,1,dark);rect(15,12,2,1,dark);rect(21,12,2,1,dark)}
  else if(style.eyes==='down'){rect(14,13,2,2,dark);rect(21,13,2,2,dark)}
  else if(style.eyes==='wink'){rect(14,11,2,3,dark);rect(20,12,4,1,dark);rect(21,13,2,1,dark)}
  else{rect(14,10,3,4,dark);rect(21,10,3,4,dark);rect(15,10,1,1,'#fff');rect(22,10,1,1,'#fff')}
  if(style.eyeBags){rect(13,15,5,1,'#9b7c87');rect(20,15,5,1,'#9b7c87')}
  if(style.cheeks){rect(10,15,4,2,'#ed6386');rect(19,15,3,2,'#ed6386')}
  if(style.bow){rect(15,18,3,2,'#96345c');rect(20,18,3,2,'#96345c');rect(18,18,2,2,'#ffb7c6')}
  if(style.tie){rect(17,19,3,2,'#94334e');rect(18,21,2,5,'#db4c63');rect(17,25,4,1,'#94334e')}
  if(style.hair){rect(11,2,2,4,yellow);rect(14,1,2,5,light);rect(18,3,2,3,yellow)}
  if(style.joy){rect(25,23,3,1,orange);rect(26,22,1,2,orange)}
  if(style.kiss){rect(29,14,2,2,'#fb6598')}
  if(style.flower){rect(5,17,1,9,'#398866');rect(3,15,5,2,'#f166a5');rect(4,14,3,4,'#ff85b4')}
  if(style.wine){rect(2,14,7,1,'#c9d0db');rect(2,15,1,4,'#c9d0db');rect(8,15,1,4,'#c9d0db');rect(3,18,5,3,'#7b1e3a');rect(4,21,3,1,'#c9d0db');rect(5,22,1,4,'#c9d0db');rect(4,26,3,1,'#c9d0db')}
  if(style.coffee){rect(2,19,6,6,'#f6e9cb');rect(3,20,4,3,'#80503d');rect(8,21,2,3,'#f6e9cb')}
  if(style.phone){rect(3,13,4,8,'#47354e');rect(4,14,2,5,'#8bdcff')}
  if(style.alarm){rect(2,5,6,5,'#df5b72');rect(3,6,4,3,'#fff0ba')}
  if(style.sparkle||style.petals||style.heart){rect(26,5,2,2,style.heart?'#ff6d9f':'#fff6b9');rect(28,7,1,2,'#fff6b9')}
  return canvas.toDataURL('image/png');
}
const spriteMap=Object.fromEntries(Object.keys(spriteFiles).map(id=>[id,spriteFiles[id]||drawDuck(spriteStyles[id])]));
if(!spriteFiles.guard){
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;const ctx=canvas.getContext('2d');
  const pixel=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
  pixel(10,3,12,2,'#302a3d');pixel(9,5,14,9,'#302a3d');pixel(11,6,10,7,'#a88d8c');
  pixel(11,8,3,2,'#27283b');pixel(18,8,3,2,'#27283b');pixel(9,14,14,14,'#17192e');
  pixel(14,15,4,10,'#e0dfda');pixel(15,16,2,8,'#9c334f');pixel(8,27,6,3,'#222137');pixel(19,27,6,3,'#222137');
  spriteMap.guard=canvas.toDataURL('image/png');
}
