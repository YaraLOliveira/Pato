// A faixa enviada para o modo Romântico toca no elemento de áudio do navegador.
// As outras músicas e todos os efeitos são gerados por Web Audio (sem arquivos).
const musicEngine=(()=>{
  let ctx,track=null,timer=null,bus=null,nextTime=0,step=0,muted=false,warp=0,fire=0,rumble=null,noiseBuf=null,lastBlip=0;
  const Audio=window.AudioContext||window.webkitAudioContext;
  const romanceAudio=document.createElement('audio');
  romanceAudio.src='assets/mood.mp3';romanceAudio.loop=true;romanceAudio.preload='auto';
  function playRomance(){
    if(muted||!romanceAudio.paused)return;
    const attempt=romanceAudio.play();
    attempt?.catch?.(()=>document.dispatchEvent(new Event('romance-audio-error')));
  }
  romanceAudio.addEventListener('error',()=>document.dispatchEvent(new Event('romance-audio-error')));
  const notes=[261.63,220,174.61,196];
  // Saída única: filtro suave + compressor, para nada estourar quando vários sons tocam juntos.
  let master=null;
  function out(){
    if(!master){const lp=ctx.createBiquadFilter(),comp=ctx.createDynamicsCompressor();lp.type='lowpass';lp.frequency.value=7000;lp.Q.value=.5;
      comp.threshold.value=-20;comp.knee.value=18;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.25;
      master=ctx.createGain();master.gain.value=.85;master.connect(lp).connect(comp).connect(ctx.destination)}
    return master;
  }
  // Envelope sem estalo: começa do zero, sobe em rampa e termina em zero antes de parar o som.
  function env(param,time,volume,duration,attack=.012){
    const peak=Math.max(.0002,volume),end=time+Math.max(attack+.03,duration);
    param.cancelScheduledValues(time);param.setValueAtTime(0,time);param.linearRampToValueAtTime(peak,time+attack);
    param.exponentialRampToValueAtTime(.0005,end);param.linearRampToValueAtTime(0,end+.03);return end+.06;
  }
  function note(freq,time,duration,volume,type='triangle',target=bus,detune=0,attack=.015){
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(freq,time);if(detune)oscillator.detune.setValueAtTime(detune,time);
    const stop=env(gain.gain,time,volume,duration,attack);
    oscillator.connect(gain).connect(target||out());oscillator.start(time);oscillator.stop(stop);
  }
  function kick(time,volume,target=bus){
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';
    oscillator.frequency.setValueAtTime(135,time);oscillator.frequency.exponentialRampToValueAtTime(46,time+.18);
    const stop=env(gain.gain,time,volume,.24,.006);
    oscillator.connect(gain).connect(target||out());oscillator.start(time);oscillator.stop(stop);
  }
  function noise(){if(!noiseBuf){noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return noiseBuf}
  function hiss(time,duration,volume,freq,type='bandpass',q=1,target,freqEnd,attack=.02){
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=noise();
    filter.type=type;filter.frequency.setValueAtTime(freq,time);if(freqEnd)filter.frequency.exponentialRampToValueAtTime(freqEnd,time+duration);filter.Q.value=q;
    const stop=env(gain.gain,time,volume,duration,Math.min(attack,duration/2));
    src.connect(filter).connect(gain).connect(target||out());src.start(time,Math.random()*1.2);src.stop(stop);
  }
  function slide(time,f0,f1,duration,volume,type='sine',vibRate=0,vibDepth=0){
    const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;
    osc.frequency.setValueAtTime(f0,time);osc.frequency.exponentialRampToValueAtTime(f1,time+duration);
    const stop=env(gain.gain,time,volume,duration,.025);
    if(vibRate){const lfo=ctx.createOscillator(),depth=ctx.createGain();lfo.frequency.value=vibRate;depth.gain.value=vibDepth;lfo.connect(depth).connect(osc.frequency);lfo.start(time);lfo.stop(stop)}
    osc.connect(gain).connect(out());osc.start(time);osc.stop(stop);
  }  const musicBox=[523.25,659.25,783.99,987.77,880,783.99,659.25,587.33,523.25,659.25,783.99,1046.5,987.77,783.99,698.46,659.25];
  const flirtBass=[110,130.81,146.83,164.81,146.83,130.81,123.47,103.83];
  function schedule(time){
    if(track==='melt'){
      const down=1-warp*.3,wobble=warp*38*Math.sin(step*.9);
      note(musicBox[step%16]*down,time,.55+warp*.5,.05,'triangle',bus,wobble);
      if(step%8===0)note(130.81*down,time,1.4,.04,'sine',bus,wobble);
      if(step%8===4)note(196*down,time,1.2,.03,'sine',bus,wobble);
    }else if(track==='romance'){
      const chord=step%16,root=notes[Math.floor(chord/4)%4];
      if(chord%4===0){[1,1.26,1.5].forEach((ratio,i)=>note(root*ratio,time,1.65,.055-i*.009));note(root/2,time,1.2,.033,'sine')}
      if(chord%2===1)note(root*(chord%4===1?2:2.52),time,.35,.014);
    }else if(track==='work'){
      if(step%4===0)note(164.81,time,.22,.08,'sine');
      if(step%4===2)note(196,time,.17,.05,'triangle');
      if(step%8===7)note(329.63,time,.1,.035,'sine');
    }else if(track==='flirt'){
      if(step%2===0)note(flirtBass[(step/2)%8],time,.55,.06,'sine',bus,0,.07);
      if(step%8===4)note(220,time,.5,.025,'sine',bus,0,.06);
      if(step%16===7){note(440,time,.3,.022,'sine',bus,0,.05);note(415.3,time+.2,.5,.022,'sine',bus,0,.05)}
      if(step%16===15)note(659.25,time,.6,.018,'sine',bus,0,.06);
    }else if(track==='club-muted'||track==='club'){
      const quiet=track==='club-muted',level=quiet?.65:1;
      if(step%2===0)kick(time,.14*level);
      if(step%4===2)note(170,time,.08,.021*level,'triangle');
      if(!quiet&&step%2===1)note(1109,time,.06,.006,'triangle');
      if(step%4===0)note([65.41,65.41,87.31,73.42][Math.floor(step/4)%4],time,.27,.037*level,'sine');
    }
    step++;
  }
  function intervalFor(name){return name==='melt'?60/100/2*(1+warp*.7):name==='work'?.45:name==='flirt'?.3:name==='romance'?60/90:60/112/2}
  function fadeOut(){if(!bus||!ctx)return;const old=bus,now=ctx.currentTime;old.gain.cancelScheduledValues(now);old.gain.setValueAtTime(old.gain.value,now);old.gain.linearRampToValueAtTime(0,now+.18);setTimeout(()=>old.disconnect(),400)}
  function change(name){
    if(name===track&&(!name||timer)){
      if(ctx?.state==='suspended'&&!muted)ctx.resume().catch(()=>{});
      return;
    }
    if(name===track&&name==='romance'){playRomance();return}
    if(track==='romance'&&name!=='romance'){romanceAudio.pause();romanceAudio.currentTime=0}
    if(!name&& !ctx){track=null;return}
    if(name&&name!=='romance'&&!muted&&!ctx&&Audio)ctx=new Audio();
    if(ctx?.state==='suspended'&&!muted)ctx.resume().catch(()=>{});
    clearInterval(timer);timer=null;fadeOut();track=name;bus=null;
    if(name==='romance'){playRomance();return}
    if(!name||muted||!ctx)return;
    bus=ctx.createGain();bus.gain.setValueAtTime(0,ctx.currentTime);
    const quiet=name==='club-muted';
    if(quiet){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=350;bus.connect(filter).connect(out())}
    else bus.connect(out());
    bus.gain.linearRampToValueAtTime(name==='club-muted'?.32:name==='club'?.7:.65,ctx.currentTime+.18);
    step=0;nextTime=ctx.currentTime+.04;
    const tick=()=>{if(nextTime<ctx.currentTime-.5)nextTime=ctx.currentTime+.04;for(let i=0;nextTime<ctx.currentTime+.2&&i<8;i++){schedule(nextTime);nextTime+=intervalFor(track)}};
    tick();timer=setInterval(tick,80);
  }
  function updateRumble(){
    if(!ctx)return;
    if(fire>0&&!muted){
      if(!rumble){const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=noise();src.loop=true;filter.type='lowpass';filter.frequency.value=420;gain.gain.value=0;src.connect(filter).connect(gain).connect(out());src.start();rumble={src,gain}}
      const now=ctx.currentTime;rumble.gain.gain.cancelScheduledValues(now);rumble.gain.gain.setValueAtTime(rumble.gain.gain.value,now);rumble.gain.gain.linearRampToValueAtTime(.07*fire,now+.4);
    }else if(rumble){const old=rumble,now=ctx.currentTime;rumble=null;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+.3);setTimeout(()=>old.src.stop(),450)}
  }
  function setFire(level){fire=level;if(level>0&&!ctx&&Audio&&!muted)ctx=new Audio();updateRumble()}
  function setWarp(value){warp=value}
  function setMuted(value){muted=value;if(value){romanceAudio.pause();clearInterval(timer);timer=null;fadeOut();bus=null}else{const current=track;track=null;change(current)}updateRumble()}
  function ready(){if(muted||!Audio)return false;if(!ctx)ctx=new Audio();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return true}
  function playEffect(freq=520,duration=.08){
    if(track==='romance')return;
    try{if(ready())note(freq,ctx.currentTime+.02,Math.max(.12,duration),.05,'triangle',out())}catch(e){}
  }
  // Efeitos sonoros com nome: tocam por cima de qualquer música.
  function sfx(name){
    try{
      if(!ready())return;const t=ctx.currentTime+.02,o=out();
      if(name==='melt'){slide(t,880,150,1.6,.1,'sine',6,28);slide(t+1.55,220,90,.35,.08,'sine');hiss(t+1.6,.3,.04,500,'lowpass')}
      else if(name==='soften'){slide(t,660,330,.7,.07,'sine',7,18)}
      else if(name==='boing'){slide(t,130,620,.32,.12,'triangle',16,40);slide(t+.3,620,380,.25,.06,'triangle',12,20)}
      else if(name==='beat'){kick(t,.3,o);kick(t+.2,.2,o)}
      else if(name==='blush'){note(1046.5,t,.22,.045,'sine',o);note(1318.5,t+.09,.3,.045,'sine',o)}
      else if(name==='tada'){[523.25,659.25,783.99,1046.5].forEach((f,i)=>note(f,t+i*.07,.22,.045,'triangle',o));[523.25,659.25,783.99].forEach(f=>note(f,t+.32,.9,.03,'triangle',o,0,.03))}
      else if(name==='clink'){note(2637,t,.8,.035,'sine',o,0,.004);note(3951,t,.5,.015,'sine',o,0,.004);note(2660,t+.1,.7,.028,'sine',o,0,.004)}
      else if(name==='kiss'){slide(t,520,1040,.22,.045,'sine',5,12);note(1318.5,t+.14,.35,.02,'sine',o,0,.04)}
      else if(name==='sizzle'){hiss(t,.7,.09,3500,'bandpass',.8,o,1800,.04);hiss(t,.3,.05,900,'bandpass',1,o)}
      else if(name==='whoosh'){hiss(t,.5,.06,300,'lowpass',.7,o,1500,.15)}
      else if(name==='blub'){slide(t,240,700,.14,.07,'sine')}
      else if(name==='sparkle'){[1568,2093,2637,3136].forEach((f,i)=>note(f,t+i*.05,.3,.025,'sine',o))}
      else if(name==='alarm'){for(let i=0;i<4;i++){note(1320,t+i*.16,.09,.035,'triangle',o,0,.008);note(1320,t+i*.16+.08,.08,.028,'triangle',o,0,.008)}}
      else if(name==='fire'){hiss(t,1,.14,200,'bandpass',.8,o,1200,.15);kick(t,.2,o)}
      else if(name==='sip'){hiss(t,.2,.06,1200,'bandpass',4,o,700,.03);hiss(t+.25,.16,.045,1100,'bandpass',4,o,600,.03)}
      else if(name==='throw'){hiss(t,.35,.05,500,'lowpass',.7,o,1400,.12)}
    }catch(e){}
  }
  // Sonzinho de "fala" do balão, estilo videogame.
  function blip(freq){if(muted||!ctx||ctx.state!=='running')return;const now=ctx.currentTime;if(now-lastBlip<.08)return;lastBlip=now;try{note(freq*(.97+Math.random()*.06),now+.01,.07,.012,'sine',out(),0,.012)}catch(e){}}
  return {change,setMuted,playEffect,sfx,blip,setFire,setWarp};
})();
