// Cenários, fogo, derretimento e objetos em pixel art desenhados em código.
// A arte do patinho (assets/*.png) nunca é alterada: tudo aqui acontece em volta dela.
const Scenes=(()=>{
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
  const HEART=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'];

  // ---------- objetos pequenos (mesma escala de pixel do patinho) ----------
  function makeSprite(rows,pal){
    const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=document.createElement('canvas');c.width=w;c.height=h;
    const g=c.getContext('2d');rows.forEach((row,y)=>[...row].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));
    return {src:c.toDataURL('image/png'),w,h};
  }
  const P={o:'#3a1224',R:'#e3344f',r:'#a51d3d',h:'#ff8a9a',G:'#4caf5a',g:'#2d6e3c',P:'#ffc7dc',p:'#e58fb4',B:'#ffd84a',W:'#f4efe6',w:'#cfc6b8',C:'#6b3a22',S:'#8bdcff',K:'#47354e',T:'#ff85b4',t:'#f166a5',Y:'#ffe9a8'};
  const sprites={
    bouquet:makeSprite([
      '....o.oo.o.....',
      '...oRoRRoRo....',
      '..oRhRrRRhRo...',
      '.oRRRroRRRrRo..',
      '.oRrRRoRhRRRo..',
      'oRRhRrRRRRrRRo.',
      'oRRRRoRrRRoRRo.',
      '.oRrRRRRoRRRo..',
      '.goRRooRRRooog.',
      'gGgoogGGoogGGg.',
      '.gGGGgGGGgGGg..',
      '..oPPPPPPPPPo..',
      '...oPpPPPpPo...',
      '....oPPBPPo....',
      '....oBBBBBo....',
      '.....oPPPo.....',
      '.....opPPo.....',
      '......oPo......',
      '......oGo......'],P),
    rose:makeSprite([
      '..........oo.',
      '.g.......oRho',
      'oGGGGGGGoRrRo',
      '.o..g....oRRo',
      '..........oo.'],P),
    mug:makeSprite([
      '.oooooooo..',
      '.oCCCCCCo..',
      '.oWWWWWWooo',
      '.oWWWWWWo.o',
      '.oWRRWWWo.o',
      '.oWRRWWWooo',
      '.owWWWWwo..',
      '..owwwwo...',
      '...oooo....'],{...P,R:'#e3344f'}),
    phone:makeSprite(['ooooo','oSSSo','oSSSo','oSSSo','oSSSo','oKKKo','oKoKo','ooooo'],P),
    tulip:makeSprite([
      '.o.o.o.',
      'oTotoTo',
      'oTTTTTo',
      'oTtTTTo',
      '.oTTTo.',
      '..oGo..',
      '.goGo..',
      'oGgGo..',
      '.o.Go..',
      '...Go..',
      '...Go..',
      '...o...'],P),
    tie:makeSprite(['.ooo.','oRRRo','.oRo.','oRRRo','oRhRo','oRRRo','oRRRo','.oRo.','..o..'],P),
    heart:makeSprite(['.oo.oo.','oRRoRRo','oRhRRRo','oRRRRRo','.oRRRo.','..oRo..','...o...'],{...P,R:'#ff4f86',h:'#ffb3c9'}),
    petal:makeSprite(['.oo','oRo','oo.'],{...P,o:'#c2305a',R:'#ff7fa3'})
  };

  // ---------- cenários ----------
  let stage,bg,bgCtx,currentFundo='lovecloud',currentMoment=null,pxSize=5;
  function painterKit(g,W,H,seed){
    const hy=Math.round(H*.67),r=rng(seed);
    const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
    const alpha=(a,fn)=>{g.globalAlpha=a;fn();g.globalAlpha=1};
    const circle=(cx,cy,rad,c)=>{for(let dy=-rad;dy<=rad;dy++){const w=Math.floor(Math.sqrt(rad*rad-dy*dy));R(cx-w,cy+dy,w*2+1,1,c)}};
    const kit={g,W,H,hy,r,R,alpha,circle,
      grad(regions){
        const img=g.createImageData(W,H),d=img.data;
        for(const [y0,y1,cols] of regions){const c=cols.map(rgb),n=c.length-1;
          for(let y=Math.max(0,Math.round(y0));y<Math.min(H,Math.round(y1));y++){
            const t=(y-y0)/Math.max(1,y1-y0-1)*n,i=Math.min(n-1,Math.floor(t)),f=Math.max(0,Math.min(1,(t-i-.5)*2.5+.5));
            for(let x=0;x<W;x++){const col=c[f>BAYER[(y&3)*4+(x&3)]?i+1:i],o=(y*W+x)*4;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255}}}
        g.putImageData(img,0,0);
      },
      stars(n,ymax){for(let i=0;i<n;i++){const x=r()*W,y=r()*ymax,c=['#fff6d8','#cfd8ff','#ffd1e6'][i%3];alpha(.35+r()*.6,()=>R(x,y,1,1,c));if(r()<.08)alpha(.35,()=>{R(x-1,y,3,1,c);R(x,y-1,1,3,c)})}},
      glow(cx,cy,rad,c,a){for(let k=rad;k>1;k-=Math.max(2,rad/6))alpha(a,()=>circle(cx,cy,Math.round(k),c))},
      heart(cx,cy,s,c,outline){HEART.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='X')return;const edge=outline&&!(HEART[y-1]?.[x]==='X'&&HEART[y+1]?.[x]==='X'&&row[x-1]==='X'&&row[x+1]==='X');if(!outline||edge)R(cx-3.5*s+x*s,cy-3*s+y*s,s,s,c)}))},
      reflect(x,c,w,a,from=hy){for(let y=from+1;y<H;y+=2){const k=(y-from)/(H-from),ww=w*(.6+k*.9)*(.55+r()*.6);alpha(a*(1-k*.85),()=>R(x-ww/2+(r()-.5)*3,y,ww,1,c))}},
      cloud(cx,cy,w,dark,light){circle(cx-w*.32,cy,Math.round(w*.26),dark);circle(cx,cy-w*.1,Math.round(w*.34),dark);circle(cx+w*.34,cy+1,Math.round(w*.24),dark);circle(cx-w*.05,cy-w*.18,Math.round(w*.2),light);R(cx-w*.6,cy,w*1.2,w*.3,dark)},
      clipSky(fn){g.save();g.beginPath();g.rect(0,0,W,hy);g.clip();fn();g.restore()},
      lamp(x,c='#ffcf7a'){R(x,hy-44,2,44,'#0c0a14');R(x-4,hy-46,10,3,'#1a1422');R(x-3,hy-43,8,2,'#ffe2a0');kit.glow(x+1,hy-41,20,c,.06);alpha(.12,()=>{for(let y=hy-41;y<hy;y++){const hw=2+(y-hy+41)*.35;R(x+1-hw,y,hw*2,1,c)}});kit.reflect(x+1,c,6,.55)},
      anchor(name,x,y){stage.style.setProperty(`--${name}-x`,`${(x/W*100).toFixed(2)}%`);stage.style.setProperty(`--${name}-y`,`${(y/H*100).toFixed(2)}%`)}
    };
    return kit;
  }
  const painters={
    lovecloud(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#12081f','#231036','#3b1548','#5e1d5a','#8a2a66','#c24a7c','#f07a98']],[hy,H,['#6a2658','#3a1640','#1e0c26','#0f0716']]]);
      d.stars(W*H/80,hy*.55);
      const hx=W*.5,hyy=Math.max(18,hy*.3),melt=m?.derreter||0;
      d.glow(hx,hyy,Math.round(Math.min(W,H)*.2),'#ff9ec4',.05+melt*.04);
      d.heart(hx,hyy,Math.max(2,Math.round(W/64)),'#ffb8d2');
      for(let i=0;i<14;i++)alpha(.5,()=>d.heart(r()*W,r()*hy*.8,1,'#ff8fba'));
      d.clipSky(()=>{for(let i=0;i<Math.ceil(W/22);i++)d.cloud(r()*W,hy-2-r()*hy*.14,12+r()*16,'#c85a8f','#f59ab8')});
      d.reflect(hx,'#ffb8d2',14,.45);
      for(let i=0;i<W/6;i++)alpha(.25,()=>R(r()*W,hy+2+r()*(H-hy),3+r()*8,1,'#ff9ec4'));
      for(let x=0;x<W;x+=3+Math.floor(r()*5)){const h=3+r()*7;R(x,H-h,1,h,'#08040c')}
    },
    office(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#15212b','#1b2a35','#20323e']],[hy,H,['#262b3a','#1c202c','#12151e']]]);
      d.glow(W*.5,0,Math.round(W*.25),'#9fd8ff',.03);
      R(0,hy-14,W,1,'#0f171e');R(0,hy-13,W,13,'#17232c');for(let x=0;x<W;x+=12)R(x,hy-13,1,13,'#121b22');R(0,hy,W,2,'#0b1015');
      const wx=Math.round(W*.05),wy=Math.round(hy*.14),ww=Math.round(Math.min(44,W*.26)),wh=Math.round(hy*.46);
      R(wx-2,wy-2,ww+4,wh+4,'#0b1116');R(wx,wy,ww,wh,'#101a3c');R(wx,wy+wh*.6,ww,wh*.4,'#16234a');
      for(let x=wx;x<wx+ww;){const bw=4+Math.floor(r()*6),bh=6+Math.floor(r()*wh*.6);R(x,wy+wh-bh,bw,bh,'#0a1022');for(let yy=wy+wh-bh+2;yy<wy+wh-1;yy+=3)for(let xx=x+1;xx<x+bw-1;xx+=2)if(r()<.35)R(xx,yy,1,1,'#ffd36b');x+=bw+1}
      R(wx+ww/2,wy,1,wh,'#0b1116');R(wx,wy+wh/2,ww,1,'#0b1116');R(wx-3,wy+wh+2,ww+6,2,'#2c3b46');
      const cx=Math.round(W*.5),cy=Math.round(Math.max(8,hy*.13));d.circle(cx,cy,5,'#0b1116');d.circle(cx,cy,4,'#e9e4d6');R(cx,cy-3,1,3,'#222');R(cx,cy,3,1,'#c33');
      const fx=Math.round(W*.6),fy=Math.round(hy*.2);R(fx,fy,16,12,'#6b4a2a');R(fx+2,fy+2,12,8,'#5d8fa8');R(fx+2,fy+7,12,3,'#3f7a4a');R(fx+9,fy+3,2,2,'#ffe98a');
      R(2,hy-26,14,30,'#3d4a55');for(let y=hy-24;y<hy+2;y+=9){R(3,y,12,1,'#27313a');R(8,y+4,4,1,'#9aa7b0')}
      const tx=Math.round(W*.3);R(tx-4,hy-9,9,12,'#4a5560');R(tx-5,hy-10,11,2,'#5e6b76');for(let x=tx-3;x<tx+4;x+=2)R(x,hy-7,1,9,'#3a434c');d.anchor('trash',tx,hy-9);
      const dx=Math.round(W*.68),dw=Math.round(Math.min(56,W*.32));R(dx,hy-6,dw,3,'#6b4630');R(dx+2,hy-3,dw-4,17,'#4a2f20');R(dx+dw*.55,hy,dw*.4,1,'#2e1c13');R(dx+dw*.55,hy+6,dw*.4,1,'#2e1c13');R(dx+dw*.72,hy+2,4,1,'#c9a26b');
      const mx=Math.round(dx+dw*.38);R(mx,hy-22,20,15,'#12151b');R(mx+2,hy-20,16,10,'#5fc8ff');for(let i=0;i<3;i++)R(mx+4,hy-18+i*3,6+i*3,1,'#d6f3ff');R(mx+8,hy-7,4,1,'#12151b');d.glow(mx+10,hy-15,16,'#5fc8ff',.05);d.anchor('desk',mx+10,hy-22);
      R(dx+4,hy-9,9,3,'#e8e4d8');R(dx+5,hy-11,8,2,'#d8d2c2');R(dx+dw-7,hy-11,6,5,'#8a4b2d');R(dx+dw-8,hy-16,3,5,'#3f9a4f');R(dx+dw-5,hy-18,3,7,'#4caf5a');R(dx+dw-3,hy-15,3,4,'#2d6e3c');
      d.reflect(mx+10,'#5fc8ff',10,.25);
      for(let i=0;i<W*H/60;i++)alpha(.3,()=>R(r()*W,hy+2+r()*(H-hy),1,1,'#353c52'));
      d.anchor('door',W*.96,hy);
    },
    neon(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#140a1e','#1c0f29','#231233']],[hy,H,['#241530','#140b1c','#0a0610']]]);
      const bricks=['#2a1636','#26132f','#2f1a3b','#241230'];
      for(let y=0;y<hy-2;y+=4){const off=(y/4)%2?5:0;for(let x=-off;x<W;x+=10)R(x,y,9,3,bricks[Math.floor(r()*4)])}
      for(let y=0;y<hy*.45;y++)alpha(.55*(1-y/(hy*.45)),()=>R(0,y,W,1,'#07040c'));
      const dx=Math.round(W*.1),dw=22,dh=40;R(dx-3,hy-dh-3,dw+6,dh+3,'#0b0610');R(dx,hy-dh,dw,dh,'#2a1538');R(dx+3,hy-dh+4,dw-6,14,'#331a44');R(dx+3,hy-dh+21,dw-6,15,'#331a44');R(dx+dw-5,hy-dh/2,2,3,'#ffd36b');
      R(dx-1,hy-dh-1,dw+2,1,'#c86bff');R(dx-1,hy-dh,1,dh,'#c86bff');R(dx+dw,hy-dh,1,dh,'#c86bff');R(dx,hy-1,dw,1,'#f0c4ff');
      d.glow(dx+dw/2,hy-dh/2,Math.round(dh*.8),'#b04cff',.04);d.reflect(dx+dw/2,'#c86bff',dw,.35);
      const hx=Math.round(W*.75),hyy=Math.round(Math.max(16,hy*.55)),s=Math.max(2,Math.round(W/70));
      d.glow(hx,hyy,s*14,'#ff4fa0',.05);d.heart(hx,hyy,s,'#ff5fa8',true);alpha(.8,()=>R(hx-s*6,hyy+s,s*12,1,'#ffd36b'));R(hx+s*5,hyy,2,3,'#ffd36b');
      d.reflect(hx,'#ff5fa8',12,.45);
      d.lamp(Math.round(W*.9));
      R(0,hy,W,2,'#3a2548');R(0,hy+2,W,1,'#0a0610');
      for(let i=0;i<3;i++){const px=r()*W,pw=14+r()*20,py=hy+8+r()*(H-hy-12);alpha(.5,()=>R(px,py,pw,2,'#3a1f52'))}
    },
    sunset(d,m){const {W,H,hy,r,R,alpha}=d;
      const shore=Math.round(hy+H*.06);
      d.grad([[0,hy,['#2a1847','#4a2263','#7a2f72','#b8437a','#e8687a','#ff9470','#ffc27a']],[hy,shore,['#d86e7a','#8a3a66']],[shore,H,['#2e1838','#1e0f28','#12081a']]]);
      d.stars(W*H/260,hy*.2);
      const sx=Math.round(W*.72),sr=Math.round(Math.min(16,W*.1));
      d.glow(sx,hy,sr*3,'#ffb070',.05);
      d.clipSky(()=>{d.circle(sx,hy,sr,'#ffd48a');d.circle(sx,hy,sr-2,'#ffe7b0');for(let k=0;k<4;k++)R(sx-sr,hy-2-k*3,sr*2+1,1,'#ff9470')});
      for(let x=0;x<W;x++){const h=6+Math.sin(x*.05)*4+Math.sin(x*.13)*2;R(x,hy-h,1,h,'#3b1a45')}
      for(let x=0;x<W;x++){const h=3+Math.sin(x*.09+2)*2;R(x,hy-h,1,h,'#26112f')}
      for(let i=0;i<5;i++){const tx=r()*W,th=8+r()*8;for(let k=0;k<th;k++){const w=Math.floor((k/th)*4);R(tx-w,hy-th-3+k,w*2+1,1,'#1a0b22')}}
      for(let i=0;i<4;i++){const bx=W*(.2+r()*.5),by=hy*(.25+r()*.3);R(bx,by,1,1,'#2a1238');R(bx+1,by+1,1,1,'#2a1238');R(bx+2,by,1,1,'#2a1238')}
      for(let y=hy+1;y<shore;y+=1){const k=(y-hy)/(shore-hy);alpha(.7-k*.4,()=>R(sx-sr*(1-k*.5)+(r()-.5)*3,y,sr*2*(1-k*.5)*(.5+r()*.5),1,'#ffd48a'))}
      for(let x=0;x<W;x+=2+Math.floor(r()*3)){const h=2+r()*5;R(x,shore-h+2,1,h,'#2e1838')}
      const bx=Math.round(W*.1);R(bx,shore-7,18,2,'#140a1c');R(bx,shore-12,18,2,'#140a1c');R(bx+1,shore-7,1,7,'#140a1c');R(bx+16,shore-7,1,7,'#140a1c');
      for(let i=0;i<10;i++)alpha(.8,()=>R(r()*W,shore+r()*(H-shore)*.6,1,1,'#ffe98a'));
    },
    mirror(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#15122a','#1b1733','#211c3a']],[hy,H,['#2a1a22','#1e1219','#140c11']]]);
      for(let x=0;x<W;x+=6)alpha(.35,()=>R(x,0,1,hy,'#2a2448'));
      const wx=Math.round(W*.22),wy=Math.round(hy*.15);R(wx-2,wy-2,26,32,'#0c0a18');R(wx,wy,22,28,'#18244a');alpha(.5,()=>{R(wx+3,wy+3,2,22,'#3a5090');R(wx+7,wy+3,1,22,'#3a5090')});R(wx+11,wy,1,28,'#0c0a18');
      R(wx-6,wy-3,6,40,'#5a2a4a');R(wx+22,wy-3,6,40,'#5a2a4a');alpha(.5,()=>{R(wx-4,wy-3,1,40,'#3a1832');R(wx+25,wy-3,1,40,'#3a1832')});
      d.glow(wx+11,hy,18,'#6a80d0',.03);
      R(0,hy-16,Math.round(W*.16),16,'#6a2a52');R(0,hy-20,Math.round(W*.16),5,'#f2c4d8');R(0,hy-30,3,30,'#3a2030');
      const lx=Math.round(W*.34);R(lx,hy-12,10,12,'#4a3050');R(lx+1,hy-8,8,1,'#2c1c30');R(lx+3,hy-20,4,8,'#1c1420');R(lx,hy-26,10,6,'#ffcf8a');d.glow(lx+5,hy-22,18,'#ffcf8a',.06);
      for(let y=hy+2;y<H;y+=4)R(0,y,W,1,'#1a0e14');for(let i=0;i<W/10;i++)R(r()*W,hy+2+Math.floor(r()*(H-hy)/4)*4,1,3,'#1a0e14');
      alpha(.6,()=>{const cx=W*.5;for(let dy=-3;dy<=3;dy++){const w=Math.sqrt(1-(dy/3.5)**2)*W*.18;R(cx-w,H*.86+dy,w*2,1,'#4a2a50')}});
      d.reflect(lx+5,'#ffcf8a',6,.3);
    },
    dinner(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#1a060e','#240a14','#2e0d1a']],[hy,H,['#241018','#170a10','#0e050a']]]);
      R(0,hy-16,W,1,'#3a1320');for(let x=4;x<W;x+=16)R(x,hy-14,12,12,'#28091a');
      const wx=Math.round(W*.14),wy=Math.round(hy*.14);R(wx-2,wy-2,28,34,'#12040a');R(wx,wy,24,30,'#0c1636');d.circle(wx+17,wy+8,3,'#f4efd6');for(let x=wx;x<wx+24;x+=3){const h=4+r()*10;R(x,wy+30-h,3,h,'#070b1e');if(r()<.5)R(x+1,wy+30-h+2,1,1,'#ffd36b')}R(wx+12,wy,1,30,'#12040a');
      for(const cx of [0,W-12]){R(cx,0,12,hy,'#5a1028');for(let k=2;k<12;k+=3)alpha(.5,()=>R(cx+k,0,1,hy,'#3a0818'))}
      for(const sx of [W*.36,W*.64]){R(sx-1,hy*.32,3,6,'#c9a24a');R(sx-2,hy*.28,5,3,'#ffe2a0');d.glow(sx,hy*.29,16,'#ffb45a',.06)}
      const fx=Math.round(W*.46),fy=Math.round(hy*.16);R(fx,fy,18,13,'#c9a24a');R(fx+2,fy+2,14,9,'#5a1a2e');d.heart(fx+9,fy+6,1,'#ff8fba');
      for(let y=hy+2;y<H;y+=6)for(let x=(y/6%2)*6;x<W;x+=12)alpha(.35,()=>R(x,y,6,6,'#2a121c'));
      const tw=Math.round(Math.min(52,W*.3)),tx=Math.round(W*.97-tw),ty=hy-8;
      R(tx+4,ty+14,2,12,'#3a1a10');R(tx+tw-6,ty+14,2,12,'#3a1a10');
      R(tx,ty,tw,3,'#f3e9e2');R(tx+1,ty+3,tw-2,13,'#e0d2cb');for(let x=tx+4;x<tx+tw-2;x+=6)R(x,ty+4,1,12,'#c7b5ae');R(tx+1,ty+15,tw-2,1,'#b3203f');
      R(tx+tw*.2,ty-1,8,1,'#ffffff');d.anchor('table',tx+tw*.65,ty+1);
      d.reflect(tx+tw*.65,'#ffb45a',8,.35);
    },
    ballroom(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#0a0614','#110a1f','#170d28']],[hy,H,['#2a1830','#1a0f20','#0e0814']]]);
      const n=Math.max(2,Math.floor(W/46));
      for(let i=0;i<n;i++){const x=Math.round(W*(i+.5)/n-7),y=Math.round(hy*.2),h=Math.round(hy*.5);R(x+2,y-2,10,2,'#1a2346');R(x,y,14,h,'#1a2346');R(x+2,y+2,10,h-4,'#2c3a6a');R(x+6,y,1,h,'#1a2346');R(x,y+h/2,14,1,'#1a2346');d.reflect(x+7,'#6a80c0',10,.22)}
      for(const cx of [0,W-10]){R(cx,0,10,hy,'#4a0f2a');for(let k=2;k<10;k+=3)alpha(.5,()=>R(cx+k,0,1,hy,'#2c0818'))}
      R(W/2-8,5,16,2,'#d8b45a');for(let i=0;i<7;i++)R(W/2-7+i*2.2,7+(i%2)*2,1,3,'#fff6d8');
      alpha(.07,()=>{for(let y=8;y<hy+16;y++){const hw=4+y*.3;R(W/2-hw,y,hw*2,1,'#fff0c9')}});
      alpha(.16,()=>{const cy=hy+H*.12;for(let dy=-5;dy<=5;dy++){const w=Math.sqrt(1-(dy/5.5)**2)*W*.2;R(W/2-w,cy+dy,w*2,1,'#fff0c9')}});
      for(let y=hy+3;y<H;y+=5)alpha(.4,()=>R(0,y,W,1,'#120a18'));
      if(m?.id==='heart-music'){const gx=Math.round(W*.16);R(gx,hy-8,12,9,'#5a3020');R(gx+1,hy-7,10,1,'#7a4530');R(gx+5,hy-14,2,6,'#c9a24a');R(gx+6,hy-20,6,6,'#e0b050');R(gx+9,hy-24,6,8,'#e0b050');R(gx+11,hy-23,3,6,'#8a6020');d.glow(gx+10,hy-20,10,'#ffcf7a',.04)}
    },
    moon(d,m){const {W,H,hy,r,R,alpha}=d;
      d.grad([[0,hy,['#040817','#081030','#0d1a44','#16275a','#22336a']],[hy,H,['#161c34','#0c1122','#070a14']]]);
      d.stars(W*H/55,hy*.8);
      const mx=Math.round(W*.3),my=Math.round(Math.max(18,hy*.34)),mr=Math.round(Math.min(13,W*.09));
      d.glow(mx,my,mr*3,'#9cc4ff',.05);d.circle(mx,my,mr,'#f4efd6');d.circle(mx-4,my-2,2,'#d9d2b2');d.circle(mx+3,my+4,3,'#dcd5b6');d.circle(mx+5,my-5,1,'#d9d2b2');
      for(let x=0;x<W;){const bw=8+Math.floor(r()*14),bh=10+Math.floor(r()*Math.min(34,hy*.45));R(x,hy-bh,bw,bh,'#0a0e1e');for(let yy=hy-bh+3;yy<hy-2;yy+=4)for(let xx=x+2;xx<x+bw-2;xx+=3)if(r()<.28)R(xx,yy,1,2,r()<.8?'#ffd36b':'#8fb0ff');x+=bw+1}
      R(0,hy,W,3,'#232a40');R(0,hy+3,W,1,'#0a0d18');
      d.reflect(mx,'#f4efd6',10,.4,hy+3);
      d.lamp(Math.round(W*.86));
      for(let i=0;i<3;i++){const px=r()*W,pw=16+r()*24,py=hy+10+r()*(H-hy-14);alpha(.45,()=>R(px,py,pw,2,'#26305a'))}
    }
  };
  function paint(){
    if(!stage||!bg)return;
    const cw=stage.clientWidth,ch=stage.clientHeight;if(!cw||!ch)return;
    pxSize=cw<560?3:5;const W=Math.round(cw/pxSize),H=Math.round(ch/pxSize);
    bg.width=W;bg.height=H;stage.style.setProperty('--px',`${cw/W}px`);
    const kit=painterKit(bgCtx,W,H,[...currentFundo].reduce((a,c)=>a*31+c.charCodeAt(0),7));
    (painters[currentFundo]||painters.lovecloud)(kit,currentMoment);
    Fire.resize(cw,ch);
  }
  function setBackdrop(fundo,moment){currentFundo=painters[fundo]?fundo:'lovecloud';currentMoment=moment;paint()}

  // ---------- fogo (algoritmo clássico do "fogo do Doom") ----------
  const FIRE_PAL=['#070707','#1f0707','#2f0f07','#470f07','#571707','#671f07','#771f07','#8f2707','#9f2f07','#af3f07','#bf4707','#c74707','#df4f07','#df5707','#df5707','#d75f07','#d7670f','#cf6f0f','#cf770f','#cf7f0f','#cf8717','#c78717','#c78f17','#c7971f','#bf9f1f','#bf9f1f','#bfa727','#bfa727','#bfaf2f','#b7af2f','#b7b72f','#b7b737','#cfcf6f','#dfdf9f','#efefc7','#ffffff'].map((h,i)=>[...rgb(h),i===0?0:Math.min(215,i*30)]);
  const Fire={canvas:null,g:null,W:0,H:0,px:null,cool:null,mask:null,level:0,shape:'full',raf:0,last:0,
    init(c){this.canvas=c;this.g=c.getContext('2d')},
    resize(cw,ch){if(!this.canvas)return;const W=Math.round(cw/(pxSize*1.6)),H=Math.round(ch*.62/(pxSize*1.6));if(W===this.W&&H===this.H)return;this.W=W;this.H=H;this.canvas.width=W;this.canvas.height=H;this.px=new Uint8Array(W*H);this.cool=new Float64Array(W);this.buildMask();this.img=this.g.createImageData(W,H)},
    buildMask(){const W=this.W;if(!W)return;const trash=parseFloat(stage.style.getPropertyValue('--trash-x'))/100||.3;this.mask=new Float32Array(W).map((_,x)=>{const f=x/W;
      if(this.shape==='trash')return Math.exp(-((f-trash)**2)/(2*.022**2));
      if(this.shape==='sides')return f<.3?1-f*1.2:f>.7?(f-.64)*2.6:0;
      if(this.shape==='smolder')return .35+.35*Math.sin(x*.7)*Math.sin(x*.23);
      return .8+.2*Math.sin(x*.4)})},
    set(level,shape='full'){this.level=level;if(shape!==this.shape){this.shape=shape;this.buildMask()}stage?.classList.toggle('on-fire',level>0);stage?.style.setProperty('--fire',level);if((level>0||this.px?.some(v=>v))&&!this.raf)this.loop()},
    extinguishAt(f){if(!this.W||this.level<=0)return false;const x=Math.round(f*this.W),had=this.mask[Math.max(0,Math.min(this.W-1,x))]*this.level>.08;const until=performance.now()+2200;for(let k=-6;k<=6;k++){const i=x+k;if(i>=0&&i<this.W){this.cool[i]=until;for(let y=0;y<this.H;y++)this.px[y*this.W+i]=0}}return had},
    step(){const {W,H,px}=this,now=performance.now(),dec=Math.min(1,35/(2*Math.max(4,H*(.35+.4*this.level))));
      for(let x=0;x<W;x++){const v=now<this.cool[x]?0:Math.round(35*this.level*this.mask[x]);px[(H-1)*W+x]=Math.max(0,v-(Math.random()<.3?Math.floor(Math.random()*6):0))}
      for(let x=0;x<W;x++)for(let y=1;y<H;y++){const src=y*W+x,p=px[src];if(!p){px[src-W]=0;continue}const rnd=(Math.random()*3)|0,dst=src-rnd+1-W;if(dst>=0)px[dst]=Math.max(0,p-(Math.random()<dec?1:0)-(Math.random()<dec?1:0))}
      const d=this.img.data;let alive=false;for(let i=0;i<px.length;i++){const c=FIRE_PAL[px[i]],o=i*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=c[3];if(px[i])alive=true}
      this.g.putImageData(this.img,0,0);return alive},
    loop(){const tick=t=>{if(t-this.last>55){this.last=t;const alive=this.step();if(!alive&&this.level<=0){this.raf=0;return}}
      if(reduced()&&this.level>0){for(let i=0;i<40;i++)this.step();this.raf=0;return}this.raf=requestAnimationFrame(tick)};this.raf=requestAnimationFrame(tick)}
  };

  // ---------- derretimento do patinho (coluna por coluna, sem tocar no PNG) ----------
  const Melt={canvas:null,g:null,img:null,wrap:null,p:0,from:0,target:0,t0:0,dur:900,mode:'ease',raf:0,seeds:[],drips:[],opts:{},jig:0,
    init(canvas,img,wrap){this.canvas=canvas;this.g=canvas.getContext('2d');this.img=img;this.wrap=wrap;const r=rng(42),cols=64;let s=Array.from({length:cols},()=>.5+r());for(let k=0;k<3;k++)s=s.map((v,i)=>(v+(s[i-1]??v)+(s[i+1]??v))/3);this.seeds=s;this.drips=Array.from({length:cols},()=>r()<.22?.4+r()*.6:0)},
    to(target,opts={}){this.opts=opts;this.from=opts.from??this.p;this.p=this.from;this.target=target;this.t0=performance.now();this.mode=opts.boing?'boing':'ease';this.dur=opts.boing?1300:900;if(reduced()){this.p=target;this.mode='static'}this.start()},
    jiggle(){this.jig=1;this.start()},
    reset(){this.p=0;this.target=0;this.opts={};this.jig=0;this.wrap?.classList.remove('melting');cancelAnimationFrame(this.raf);this.raf=0},
    start(){if(!this.raf)this.raf=requestAnimationFrame(t=>this.frame(t))},
    frame(now){this.raf=0;const k=Math.min(1,(now-this.t0)/this.dur);
      if(this.mode==='boing'){const t=k*1.3;this.p=this.target+(this.from-this.target)*Math.exp(-4.2*t)*Math.cos(9*t)}
      else if(this.mode==='ease'){const e=Math.floor((1-Math.pow(1-k,3))*8)/8;this.p=this.from+(this.target-this.from)*e}
      this.jig*=.93;if(this.jig<.02)this.jig=0;
      const active=Math.abs(this.p)>.004||this.opts.beat||this.opts.eyes||this.jig;
      this.wrap.classList.toggle('melting',!!active);
      if(active)this.draw(now/1000);
      if(active&&(!reduced()||k<1))this.raf=requestAnimationFrame(t=>this.frame(t))},
    draw(t){const img=this.img;if(!img.complete||!img.naturalWidth)return;
      const S=.5,W=Math.round(img.naturalWidth*S),H=Math.round(img.naturalHeight*S),g=this.g;
      if(this.canvas.width!==W){this.canvas.width=W;this.canvas.height=H}
      g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);
      const p=this.p,cols=this.seeds.length,cw=img.naturalWidth/cols,U=W/64,base=H*.9,still=reduced(),spread=1+Math.max(0,p)*.62;
      const dropAt=i=>{const wob=still?0:Math.sin(t*4+i*.55)*U*.7*Math.max(0,p)+this.jig*Math.sin(t*22+i*.8)*U*1.4;return Math.min(base-U*5,Math.round((p*H*.66*this.seeds[i]+wob)/U)*U)};
      if(p>.3){const pw=W*(.3+.66*(p-.3)/.7),rows=Math.max(2,Math.round(1+p*3));for(let k=0;k<rows;k++){const f=Math.sqrt(1-(k/rows)**2),w=Math.round(pw*f/U)*U,y=base+U*(1.2-k);g.fillStyle='#563039';g.fillRect(W/2-w/2-U,y-U*.2,w+U*2,U*1.4);g.fillStyle=k===rows-1?'#ffe36b':'#f5b62c';g.fillRect(W/2-w/2,y,w,U)}}
      for(let i=0;i<cols;i++){const drop=dropAt(i),x0=W/2+(i*cw*S-W/2)*spread,x1=W/2+((i+1)*cw*S-W/2)*spread;g.drawImage(img,i*cw,0,cw,base/S,Math.floor(x0),drop,Math.ceil(x1-x0)+1,base-drop)}
      if(p>.25&&p<.97&&!still){this.drips.forEach((d,i)=>{if(!d)return;const drop=dropAt(i),x=W/2+((i+.5)*cw*S-W/2)*spread,yTop=drop+(base*.8)*(base-drop)/base,ph=(t*d*.7+i*.37)%1,y=yTop+(base-yTop)*ph;g.fillStyle='#563039';g.fillRect(x-U*.6,y-U*.2,U*1.2,U*2.2);g.fillStyle='#ffce49';g.fillRect(x-U*.4,y,U*.8,U*1.8)})}
      const map=(fx,fy)=>{const i=Math.min(cols-1,Math.floor(fx*cols)),drop=dropAt(i);return [W/2+(fx*W-W/2)*spread,drop+fy*H*(base-drop)/base]};
      const drawHeart=(cx,cy,s,col)=>{HEART.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='X'){g.fillStyle=col;g.fillRect(Math.round(cx-3.5*s+x*s),Math.round(cy-3*s+y*s),Math.ceil(s),Math.ceil(s))}}))};
      if(this.opts.beat){const beat=still?1:1+.35*Math.max(0,Math.sin(t*Math.PI*2/.62))**8,[cx,cy]=map(.57,.64);drawHeart(cx,cy,U*.9*beat+U*.2,'#3a1224');drawHeart(cx,cy,U*.9*beat,'#ff3f7f')}
      if(this.opts.eyes&&p>.6){const pulse=still?1:1+.15*Math.sin(t*6);for(const [fx,fy] of [[.485,.37],[.645,.35]]){const [cx,cy]=map(fx,fy);drawHeart(cx,cy,U*.75*pulse+U*.18,'#3a1224');drawHeart(cx,cy,U*.75*pulse,'#ff3f7f')}}
    }
  };

  function init({stageEl,backdrop,fireCanvas,meltCanvas,duckImg,duckWrap}){
    stage=stageEl;bg=backdrop;bgCtx=bg.getContext('2d');Fire.init(fireCanvas);Melt.init(meltCanvas,duckImg,duckWrap);
    let t;new ResizeObserver(()=>{clearTimeout(t);t=setTimeout(paint,80)}).observe(stage);paint();
  }
  return {init,setBackdrop,sprites,fire:Fire,melt:Melt};
})();
