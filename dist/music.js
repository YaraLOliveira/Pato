// A faixa enviada para o modo Romântico toca no elemento de áudio do navegador.
// Trabalho e Balada continuam gerados por Web Audio.
const musicEngine=(()=>{
  let ctx,track=null,timer=null,bus=null,nextTime=0,step=0,muted=false;
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
  function note(freq,time,duration,volume,type='triangle',target=bus){
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(freq,time);
    gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),time+.025);
    gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
    oscillator.connect(gain).connect(target);oscillator.start(time);oscillator.stop(time+duration+.02);
  }
  function kick(time,volume){
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';
    oscillator.frequency.setValueAtTime(135,time);oscillator.frequency.exponentialRampToValueAtTime(46,time+.18);
    gain.gain.setValueAtTime(volume,time);gain.gain.exponentialRampToValueAtTime(.0001,time+.23);
    oscillator.connect(gain).connect(bus);oscillator.start(time);oscillator.stop(time+.24);
  }
  function schedule(time){
    if(track==='romance'){
      const chord=step%16,root=notes[Math.floor(chord/4)%4];
      if(chord%4===0){[1,1.26,1.5].forEach((ratio,i)=>note(root*ratio,time,1.65,.055-i*.009));note(root/2,time,1.2,.033,'sine')}
      if(chord%2===1)note(root*(chord%4===1?2:2.52),time,.35,.014);
    }else if(track==='work'){
      if(step%4===0)note(164.81,time,.22,.08,'sine');
      if(step%4===2)note(196,time,.17,.05,'triangle');
      if(step%8===7)note(329.63,time,.1,.035,'sine');
    }else if(track==='club-muted'||track==='club'){
      const quiet=track==='club-muted',level=quiet?.65:1;
      if(step%2===0)kick(time,.14*level);
      if(step%4===2)note(170,time,.055,.021*level,'square');
      if(!quiet&&step%2===1)note(1109,time,.035,.006,'square');
      if(step%4===0)note([65.41,65.41,87.31,73.42][Math.floor(step/4)%4],time,.27,.037*level,'sine');
    }
    step++;
  }
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
    if(quiet){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=350;bus.connect(filter).connect(ctx.destination)}
    else bus.connect(ctx.destination);
    bus.gain.linearRampToValueAtTime(name==='club-muted'?.32:name==='club'?.7:.65,ctx.currentTime+.18);
    step=0;nextTime=ctx.currentTime+.04;
    const interval=name==='romance'?60/90:name==='work'?.45:60/112/2;
    const tick=()=>{if(nextTime<ctx.currentTime-.5)nextTime=ctx.currentTime+.04;for(let i=0;nextTime<ctx.currentTime+.2&&i<8;i++){schedule(nextTime);nextTime+=interval}};
    tick();timer=setInterval(tick,80);
  }
  function setMuted(value){muted=value;if(value){romanceAudio.pause();clearInterval(timer);timer=null;fadeOut();bus=null}else{const current=track;track=null;change(current)}}
  function playEffect(freq=520,duration=.08){
    if(muted||track==='romance'||!Audio)return;
    try{
      if(!ctx)ctx=new Audio();
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      note(freq,ctx.currentTime+.015,duration,.11,'square',ctx.destination);
    }catch(e){}
  }
  return {change,setMuted,playEffect};
})();
