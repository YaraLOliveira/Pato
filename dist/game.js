(()=>{
  const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Cada momento: fundo (cenário), luzes, props (efeitos na cena), maos (objetos que o patinho segura),
  // anim (animação do patinho), dica (o que tocar), toque (o que acontece ao tocar no patinho) e efeitos opcionais.
  const stories={
    heart:{name:'Derretendo de Amor',moments:[
      {id:'melt-blush',name:'Carinho',icon:'☺',fundo:'lovecloud',luzes:{a:'#ff72994d',b:'#ffbd7140',ax:'50%',ay:'30%',bx:'50%',by:'70%'},props:['hearts'],musica:'melt',derreter:.05,sfx:'blush',anim:'shy',toque:'melt',dica:'♥ toque no patinho · aperte ♥ de novo',falas:['Hehe... para, eu fico sem graça 👉👈','Você falou comigo? Meu coração ouviu.','Ai. Acho que tô corado.','Faz de novo? Só pra eu ter certeza.','Isso foi um elogio? Vou guardar num potinho.']},
      {id:'melt-beat',name:'Coração disparado',icon:'💓',fundo:'lovecloud',luzes:{a:'#ff5a8c66',b:'#ffbd714d',ax:'50%',ay:'45%',bx:'50%',by:'72%'},props:['hearts'],musica:'melt',derreter:.16,beat:true,sfx:'beat',toque:'melt',dica:'♥ aperte de novo... se tiver coragem',falas:['Tum-tum. Tum-tum. TUM-TUM!','Meu coração tá fazendo barulho, você ouviu?','Isso é normal? Minhas penas estão quentes.','Calma, coraçãozinho, calma...','Acho que eu vou... ai ai ai...']},
      {id:'melt-soft',name:'Amolecendo',icon:'🫠',fundo:'lovecloud',luzes:{a:'#ff5a8c80',b:'#ff9a5160',ax:'50%',ay:'52%',bx:'50%',by:'78%'},props:['hearts'],musica:'melt',derreter:.45,beat:true,sfx:'soften',toque:'melt',dica:'♥ ele tá derretendo! mais um ♥...',falas:['Tô ficando molinho...','Minhas perninhas viraram gelatina.','Não para não... quer dizer... para... não, não para.','Tá quente aqui ou é você?','Socorro, tô derretendo de fofura.']},
      {id:'melt-puddle',name:'Derreteu!',icon:'💛',fundo:'lovecloud',luzes:{a:'#ff5a8c99',b:'#ffd36b66',ax:'50%',ay:'70%',bx:'50%',by:'40%'},props:['hearts','sparkles'],musica:'melt',derreter:1,eyes:true,sfx:'melt',efeito:'flash',toque:'melt',dica:'♥ toque na poça · aperte ♥ pra ele voltar',falas:['blublublu... ♥','Virei uma poça apaixonada.','Não me recolhe não, tô bem aqui.','Derreti. Culpa sua. Toda sua.','Pode me chamar de patinho líquido agora.']},
      {id:'melt-reform',name:'BOING!',icon:'🌀',fundo:'lovecloud',luzes:{a:'#ff729966',b:'#83e6e54d',ax:'50%',ay:'40%',bx:'50%',by:'72%'},props:['sparkles'],musica:'melt',derreter:0,boing:true,sfx:'boing',efeito:'shake',anim:'bounce',toque:'melt',dica:'♥ recomeçar o derretimento',falas:['BOING! Voltei! Mas o coração ficou mole.','Me remontei... acho que faltou uma pena.','Pronto, sólido de novo. Por enquanto.','Se você fizer isso de novo, eu derreto de novo.','Aviso: patinho sensível a carinho.']}
    ]},
    work:{name:'Tá Tudo Bem',moments:[
      {id:'work-monday',name:'Segunda-feira',icon:'☕',fundo:'office',luzes:{a:'#9fd8ff40',b:'#5fc8ff33',ax:'50%',ay:'10%',bx:'78%',by:'55%'},props:[],maos:['mug'],musica:'work',anim:'calm',toque:'sip',dica:'☕ toque no patinho pra um golinho',falas:['Segunda-feira. Respira. Tá tudo sob controle.','Café na mão, planilha aberta, fé no coração.','Hoje vai ser um dia tranquilo. Eu sinto.','Bom dia! ...eu disse isso sem acreditar.','Meu crachá sorri por mim.']},
      {id:'work-email',name:'E-mail URGENTE',icon:'📧',fundo:'office',luzes:{a:'#ff7a3a55',b:'#5fc8ff40',ax:'30%',ay:'62%',bx:'78%',by:'55%'},props:['email'],maos:['mug'],musica:'work',fogo:{level:.75,shape:'trash'},sfx:'alarm',anim:'buzz',toque:'sip',dica:'🔥 toque no fogo pra tentar apagar',falas:['URGENTE!!! (era pra ontem)','Hm. A lixeira tá pegando fogo. Deve ser normal.','Respondendo com "conforme e-mail anterior"...','Tem cheiro de fumaça ou de prazo?','Vou fingir que não vi. Funciona às vezes.']},
      {id:'work-meeting',name:'A reunião',icon:'📊',fundo:'office',luzes:{a:'#ff7a3a77',b:'#ff4a2a55',ax:'15%',ay:'60%',bx:'85%',by:'60%'},props:['smoke'],maos:['mug'],musica:'work',fogo:{level:.6,shape:'sides'},sfx:'fire',anim:'nod',toque:'sip',dica:'🔥 toque no fogo · aperte ▣ pra continuar',falas:['Essa reunião podia ser um e-mail...','Alguém mais tá sentindo calor ou só eu?','Próximo slide: plano de contingência. Ah, é o fogo.','Concordo com... o que quer que tenham dito.','Vamos alinhar isso offline. Se sobrar offline.']},
      {id:'work-fine',name:'Tá tudo bem',icon:'🔥',fundo:'office',luzes:{a:'#ff8a3aaa',b:'#ff4a2a88',ax:'30%',ay:'55%',bx:'70%',by:'50%'},props:['smoke'],maos:['mug'],musica:'work',fogo:{level:1,shape:'full'},sfx:'fire',efeito:'shake',anim:'calm',toque:'sip',dica:'🔥 tenta apagar. (não adianta)',falas:['Tá tudo bem. 🔥☕','Isso é normal. Tá tudo bem.','Tô ok com os acontecimentos que estão acontecendo.','Café é meu único amigo ☕','Essa é só a temperatura do mercado.']},
      {id:'work-friday',name:'Sextou',icon:'🎉',fundo:'office',luzes:{a:'#59e3c548',b:'#ffd45b55',ax:'50%',ay:'20%',bx:'90%',by:'60%'},props:['smoke-light','tie-fly','confetti'],musica:'work',fogo:{level:.18,shape:'smolder'},sfx:'tada',anim:'bounce',dica:'▣ recomeçar a semana (socorro)',falas:['SEXTOU! Minha gravata pediu demissão!','Até segunda, responsabilidade!','O escritório pegou fogo, mas meu espírito tá livre.','Meta de hoje: alcançar a porta.','Liberdade tem cheiro de petisco. E de fumaça.']}
    ]},
    naughty:{name:'O Galanteador',moments:[
      {id:'flirt-arrive',name:'Chegou de surpresa',icon:'🎁',fundo:'neon',luzes:{a:'#a747ff4d',b:'#ff5fa855',ax:'15%',ay:'50%',bx:'55%',by:'25%'},props:[],maos:['bouquet-back'],musica:'flirt',anim:'shy',dica:'✦ aperte de novo pra ver a surpresa',falas:['Trouxe uma coisinha... mas é surpresa. 😏','Minha felicidade não tem preço, tem seu nome.','Sua presença torna qualquer lugar mais especial.','Só de ouvir a sua risada, meu dia fica melhor instantaneamente.','Não sou corretora de imóveis, mas posso te mostrar meu apartamento.']},
      {id:'flirt-reveal',name:'Tcharam!',icon:'💐',fundo:'neon',luzes:{a:'#ff5fa870',b:'#ffd36b55',ax:'62%',ay:'45%',bx:'55%',by:'25%'},props:['sparkles'],maos:['bouquet'],musica:'flirt',sfx:'tada',efeito:'flash',anim:'bounce',toque:'rose',dica:'💐 toque no buquê pra ganhar uma rosa',falas:['Tcharam! 🌹 Escolhi as mais bonitas... depois de você.','Essa piscadinha costuma abrir portas.','Além de me fazer perder a cabeça, o que mais você faz, vida?','Se eu fosse um catálogo, você seria a seção mais marcante.','Você é como um livro aberto e estou ansiosa para ler cada capítulo.','Você é uma obra de arte ambulante. Posso admirar cada detalhe?']},
      {id:'flirt-rose',name:'Rosa no bico',icon:'🌹',fundo:'neon',luzes:{a:'#ff2a5a88',b:'#a747ff55',ax:'50%',ay:'40%',bx:'15%',by:'55%'},props:['spot'],maos:['rose'],musica:'flirt',sfx:'whoosh',anim:'tango',toque:'rose',dica:'🌹 toque no patinho · olé!',falas:['Agora a noite ficou interessante.','Com você estou disposta a fazer a química virar muita física.','Me chama de fritura porque eu só tenho “óleos” para você, bebê.','Você não é chá, mas está me esquentando por dentro.','Seu perfume me deixa tão tonta que mal consigo pensar direito.']},
      {id:'flirt-serenade',name:'Serenata',icon:'🎶',fundo:'neon',luzes:{a:'#ff5fa870',b:'#4fe5ff4d',ax:'40%',ay:'35%',bx:'75%',by:'50%'},props:['notes','hearts'],maos:['bouquet'],musica:'flirt',anim:'sway',toque:'rose',dica:'💐 toque no buquê pra jogar uma rosa',falas:['Eu não danço bem. Eu danço com convicção.','Estou muito cansada, posso sentar em você?','Podemos brincar de quebra-cabeça e encaixar uma na outra.','Seu toque é tão suave que faz todos os meus sentidos se aguçarem.','Seu abraço é o melhor lugar para se estar quando tudo parece desmoronar.']},
      {id:'flirt-petals',name:'Chuva de pétalas',icon:'🌸',fundo:'neon',luzes:{a:'#ff5fa888',b:'#ffd36b55',ax:'50%',ay:'20%',bx:'50%',by:'70%'},props:['petals','hearts'],musica:'flirt',sfx:'sparkle',efeito:'flash',anim:'bounce',toque:'rose',dica:'✦ recomeçar o galanteio',falas:['Uma piscadinha e nenhuma promessa. 😏','Hoje o jantar é por minha conta, mas a sobremesa é você.','Se eu estou na minha cama e você está na sua, alguma de nós está no lugar errado.','Nem precisa acender a luz para ficar claro que eu amo você.','Não sei se é o vinho ou se é você, mas estou sentindo um calor imenso aqui.','Se eu fosse uma gata, já teria perdido todas as minhas vidas por você.']}
    ]},
    romantico:{name:'O Encontro',moments:[
      {id:'heart-invite',name:'O convite',icon:'🌷',fundo:'sunset',luzes:{a:'#ff729966',b:'#ffbd7166',ax:'72%',ay:'62%',bx:'40%',by:'50%'},props:[],maos:['tulip-back'],musica:'romance',anim:'shy',dica:'🍷 responda o convite',falas:['E se a gente... sei lá... saísse hoje? 👉👈','Eu trouxe uma flor. Ela ficou tímida também.','Prometo um encontro com muitos pius.','Quer sair comigo? Eu ensaiei isso oito vezes.','Sem pressão... mas eu já escolhi a gravatinha.']},
      {id:'heart-ready',name:'Se arrumando',icon:'🎀',fundo:'mirror',luzes:{a:'#78bfff40',b:'#ffcf8a55',ax:'78%',ay:'45%',bx:'34%',by:'40%'},props:['mirror','sparkles'],musica:'romance',sfx:'sparkle',anim:'bounce',dica:'🍷 aperte de novo quando ele estiver pronto',falas:['Penas no lugar... quase pronto!','Será que esse topete tá bom?','Um último brilho e eu tô impecável. ✨','Respira, patinho. É só o melhor encontro da vida.','Elegância: 10. Nervosismo: 99.']},
      {id:'heart-dinner',name:'O jantar',icon:'🕯️',fundo:'dinner',luzes:{a:'#ff9a515f',b:'#a91f6260',ax:'82%',ay:'62%',bx:'50%',by:'35%'},props:['candle'],musica:'romance',anim:'sway-slow',toque:'clink',dica:'🥂 toque no patinho pra brindar',falas:['Aceita uma tacinha? 🍷','Safra 2024, patinho de bom gosto.','A vela não é a única coisa brilhando aqui.','Um brinde ao encontro mais bonito do lago.','Eu cozinhei... quer dizer, pedi com muito carinho.']},
      {id:'romantic-toast',name:'Um brinde a nós',icon:'🥂',fundo:'dinner',luzes:{a:'#ff9a516b',b:'#d4479566',ax:'82%',ay:'62%',bx:'50%',by:'45%'},props:['candle','hearts'],musica:'romance',sfx:'clink',anim:'sway-slow',toque:'clink',dica:'🥂 tim-tim! toque de novo',falas:['Hoje eu tô inspirado...','Um brinde aos nossos momentos!','Tim-tim! 🥂','Essa música é pra você 🎶','Brindo a você. E ao próximo encontro.']},
      {id:'heart-music',name:'Curtindo a música',icon:'🎶',fundo:'ballroom',luzes:{a:'#b865ff55',b:'#ff78914d',ax:'50%',ay:'20%',bx:'20%',by:'60%'},props:['notes'],musica:'romance',anim:'sway',toque:'kiss',dica:'🎶 feche os olhos e sinta...',falas:['Essa música me lembra você 🎶','Fecha os olhos e sente...','♪ la la la ♪','Acho que meu coração acertou o ritmo.','Essa é a nossa música agora, combinado?']},
      {id:'heart-dance',name:'Dança lenta',icon:'🪩',fundo:'ballroom',luzes:{a:'#fff0c970',b:'#8c5cff43',ax:'50%',ay:'15%',bx:'50%',by:'70%'},props:['notes','sparkles'],musica:'romance',anim:'spin',toque:'kiss',dica:'🪩 toque nele pra rodopiar junto',falas:['Me concede essa dança?','Devagarinho... eu ainda piso nas próprias patas.','O mundo ficou quietinho só pra gente.','Um, dois, piu... um, dois, piu...','Não precisa saber dançar. Só fica aqui.']},
      {id:'heart-moon',name:'Sob a lua',icon:'🌕',fundo:'moon',luzes:{a:'#8cbcff4a',b:'#ffb85b55',ax:'70%',ay:'25%',bx:'14%',by:'45%'},props:['bigheart'],musica:'romance',anim:'shy',toque:'kiss',dica:'💋 toque nele pra um beijinho de boa noite',falas:['Foi a melhor noite da minha vida de pato.','A lua tá bonita... mas você ganhou.','Posso guardar esse momento pra sempre?','Até o próximo encontro, meu bem. 💋','Vai com cuidado. Meu coração vai junto.']}
    ]}
  };
  const secretMoments={
    secretLove:{id:'secretLove',icon:'🌺',name:'Pétalas no jantar',fundo:'dinner',luzes:{a:'#ffa07075',b:'#d447956b',ax:'82%',ay:'60%',bx:'50%',by:'40%'},props:['candle','petals'],musica:'romance',anim:'sway-slow',toque:'clink',sfx:'sparkle',falas:['Romântico e depois coração? Chove pétalas no jantar!','Até as flores quiseram participar.','Reservei a mesa mais bonita do lago.','Pétalas na mesa? É meu charme especial.','Um brinde à nossa surpresa!']},
    secretChaos:{id:'secretChaos',icon:'📞',name:'Ligação no expediente',fundo:'office',luzes:{a:'#ff7a3a55',b:'#ff8d9963',ax:'30%',ay:'60%',bx:'50%',by:'40%'},props:['hearts'],maos:['phone'],musica:'work',fogo:{level:.35,shape:'smolder'},anim:'shy',falas:['Alô? Tá tudo pegando fogo... mas pensei em você.','Só liguei pra ouvir seu piu rapidinho.','Minha pausa favorita tem a sua voz.','Não conta pro chefe que eu sorri agora.','Até a planilha ficou romântica.']},
    secretWink:{id:'secretWink',icon:'💘',name:'Flores pro crush',fundo:'neon',luzes:{a:'#d45cff67',b:'#ff678e66',ax:'32%',ay:'38%',bx:'71%',by:'46%'},props:['hearts','spot'],maos:['bouquet'],musica:'flirt',anim:'tango',toque:'rose',falas:['Você também tá aqui? Que coincidência boa!','Eu trouxe flores... e encontrei você.','Quer dançar comigo no meio da rua?','A noite ficou mais bonita de repente.','Essa piscadinha foi só pra você.']}
  };
  const heldItems={
    bouquet:{sprite:'bouquet',cls:'held-bouquet',tap:true},'bouquet-back':{sprite:'bouquet',cls:'held-bouquet-back',back:true},
    rose:{sprite:'rose',cls:'held-rose'},mug:{sprite:'mug',cls:'held-mug'},phone:{sprite:'phone',cls:'held-phone'},'tulip-back':{sprite:'tulip',cls:'held-tulip-back',back:true}
  };
  const fireLines=['Tssss! ...voltou.','Apaguei! ...não, não apaguei.','Tá tudo bem. Sério.','Obrigado, mas o fogo é corporativo.','Isso aí é problema da próxima segunda.'];
  const touchLines={
    melt:['Aiii, faz cosquinha ♥','Blub! 💛','Tô mole demais pra reagir.','Hehe... derreti mais um pouquinho.'],
    sip:['Slurp... ☕','Ahhh. Agora sim.','Esse café é tudo que eu tenho.','Mais um golinho e eu enfrento qualquer coisa.'],
    rose:['Pra você! 🌹','Pega essa! 🌹','Tem mais de onde veio essa. 😏','Uma rosa pra cada piscadinha.'],
    clink:['Tim-tim! 🥂','Ao nosso encontro! 🥂','Cuidado, a taça é de cristal... de lago.','Brinde aceito. ♥'],
    kiss:['Mwah! 💋','Um beijinho de pato 💋','Guarda esse. 💋','Pra dar sorte. 💋']
  };
  const storyMoments=Object.values(stories).flatMap(story=>story.moments);
  const reactions=Object.fromEntries([...storyMoments.map(m=>[m.id,{icon:m.icon,name:m.name}]),...Object.entries(secretMoments)]);
  const saved=JSON.parse(localStorage.getItem('patinho-save')||'{}');
  const savedProgress=saved.storyProgress||{};
  const state={found:new Set((saved.found||[]).filter(id=>reactions[id])),mood:saved.mood??50,secrets:new Set(saved.secrets||[]),history:[],duckClicks:0,last:{},muted:saved.muted??false,idleTimer:null,sleeping:false,mode:null,currentMoment:null,progress:{heart:savedProgress.heart||0,work:savedProgress.work||0,naughty:savedProgress.naughty||0,romantico:savedProgress.romantico||0},noAttempts:0,transitioning:false,fireTaps:0};
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const duck=$('#duck'),duckSprite=$('#duckSprite'),duckReflection=$('#duckReflection'),stage=$('.stage'),speechText=$('#speechText'),toast=$('#toast'),particles=$('#particles'),choicePanel=$('#choicePanel'),inviteNo=$('#inviteNo'),inviteYes=$('#inviteYes'),transition=$('#sceneTransition');
  const spriteAssets=Object.fromEntries([...new Set(Object.values(spriteMap).filter(src=>src.startsWith('assets/')))].map(src=>{const image=new Image();image.src=src;return [src,image]}));
  const defaultHint=$('#hint').textContent;

  function save(){localStorage.setItem('patinho-save',JSON.stringify({found:[...state.found],mood:state.mood,secrets:[...state.secrets],muted:state.muted,storyProgress:state.progress}))}
  function sound(note=520,d=.08){musicEngine.playEffect(note,d)}
  function type(text){clearInterval(type.t);speechText.textContent='';if(reducedMotion()){speechText.textContent=text;return}let i=0;type.t=setInterval(()=>{speechText.textContent=text.slice(0,++i);if(i>=text.length)clearInterval(type.t)},26)}
  function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)}
  function burst(chars,{x,y}={}){if(reducedMotion())return;for(let i=0;i<9;i++){const p=document.createElement('span');p.className='particle';p.textContent=chars[i%chars.length];p.style.setProperty('--x',`${-95+Math.random()*190}px`);p.style.left=x!==undefined?`${x}px`:`${35+Math.random()*30}%`;if(y!==undefined)p.style.top=`${y}px`;p.style.animationDelay=`${Math.random()*.12}s`;particles.append(p);setTimeout(()=>p.remove(),1250)}}
  function discover(id){if(!state.found.has(id)){state.found.add(id);showToast(`Nova reação: ${reactions[id].icon} ${reactions[id].name}`);sound(830,.13)}render();save()}
  function pickLine(moment,list=moment.falas){const key=list===moment.falas?moment.id:`${moment.id}:${moment.toque}`,previous=state.last[key];let line;do{line=list[Math.floor(Math.random()*list.length)]}while(line===previous&&list.length>1);state.last[key]=line;return line}
  function sceneFx(kind){if(!kind||reducedMotion())return;stage.classList.remove(kind);void stage.offsetWidth;stage.classList.add(kind);setTimeout(()=>stage.classList.remove(kind),450)}
  function renderProps(props){
    const rand=(a,b)=>(a+Math.random()*(b-a)).toFixed(2);
    const build={
      hearts:()=>`<span class="fx fx-hearts">${Array.from({length:7},()=>`<img src="${Scenes.sprites.heart.src}" style="--x:${rand(5,95)}%;--d:${rand(0,5)}s;--t:${rand(4,7)}s;--s:${rand(.6,1.3)}">`).join('')}</span>`,
      sparkles:()=>`<span class="fx fx-sparkles">${Array.from({length:8},()=>`<i style="--x:${rand(20,80)}%;--y:${rand(15,70)}%;--d:${rand(0,1.6)}s">✦</i>`).join('')}</span>`,
      petals:()=>`<span class="fx fx-petals">${Array.from({length:22},()=>`<img src="${Scenes.sprites.petal.src}" style="--x:${rand(0,100)}%;--d:${rand(0,4)}s;--t:${rand(3,6)}s;--r:${rand(-200,200)}deg">`).join('')}</span>`,
      confetti:()=>`<span class="fx fx-petals">${Array.from({length:22},(_,i)=>`<i style="--x:${rand(0,100)}%;--d:${rand(0,3)}s;--t:${rand(2.5,4.5)}s;--r:${rand(-300,300)}deg;--c:${['#ffd84a','#83e6e5','#ff8fba','#b9eff0'][i%4]}"></i>`).join('')}</span>`,
      notes:()=>`<span class="fx fx-notes">${['♪','♫','♪','♬'].map((n,i)=>`<i style="--d:${i*.6}s;--x:${rand(-40,40)}px">${n}</i>`).join('')}</span>`,
      smoke:()=>'<span class="fx fx-smoke"></span>','smoke-light':()=>'<span class="fx fx-smoke light"></span>',
      email:()=>'<span class="fx fx-email">📧 URGENTE!!!</span>',
      spot:()=>'<span class="fx fx-spot"></span>',
      mirror:()=>`<span class="fx fx-mirror"><img src="${duckSprite.src}" alt=""></span>`,
      'tie-fly':()=>`<img class="fx fx-tie" src="${Scenes.sprites.tie.src}" alt="">`,
      bigheart:()=>`<img class="fx fx-bigheart" src="${Scenes.sprites.heart.src}" alt="">`
    };
    $('#propsLayer').innerHTML=props.map(prop=>build[prop]?.()||'').join('');
  }
  function renderHeld(items){
    const html=back=>items.map(name=>heldItems[name]).filter(item=>item&&!!item.back===back).map(item=>{const s=Scenes.sprites[item.sprite];return `<img class="held-item ${item.cls}" src="${s.src}" style="--w:${s.w};--h:${s.h}" alt=""${item.tap?' data-tap="rose"':''}>`}).join('');
    $('#heldBack').innerHTML=html(true);$('#heldFront').innerHTML=html(false);
  }
  function renderStoryProgress(action,currentIndex){const story=stories[action];$('#storyProgress').innerHTML=`<span class="story-label">${story.name}</span>${story.moments.map((_,i)=>`<span class="story-dot ${i<=currentIndex?'done':''}" aria-hidden="true"></span>`).join('')}`;$('#storyProgress').setAttribute('aria-label',`${story.name}: momento ${currentIndex+1} de ${story.moments.length}`)}
  function applyMoment(action,moment,index,previousMoment){
    state.mode=action;state.currentMoment=moment;state.noAttempts=0;state.fireTaps=0;
    stage.dataset.mood=action;stage.dataset.scene=moment.fundo;stage.dataset.props=moment.props.join(' ');
    stage.classList.toggle('romantic-scene',moment.musica==='romance');
    stage.style.setProperty('--light-a',moment.luzes.a);stage.style.setProperty('--light-b',moment.luzes.b);stage.style.setProperty('--light-a-x',moment.luzes.ax);stage.style.setProperty('--light-a-y',moment.luzes.ay);stage.style.setProperty('--light-b-x',moment.luzes.bx);stage.style.setProperty('--light-b-y',moment.luzes.by);
    Scenes.setBackdrop(moment.fundo,moment);
    const sprite=spriteMap[moment.id]||spriteMap['heart-invite'],asset=spriteAssets[sprite];
    const showSprite=()=>{if(state.currentMoment!==moment)return;duckSprite.src=sprite;duckReflection.src=sprite;duckSprite.alt=`Patinho em ${moment.name.toLowerCase()}`;const mirror=$('.fx-mirror img');if(mirror)mirror.src=sprite};
    if(!asset||asset.complete&&asset.naturalWidth)showSprite();else asset.addEventListener('load',showSprite,{once:true});
    duck.className=`duck-wrap idle ${action} ${moment.anim?`anim-${moment.anim}`:''} squash`;setTimeout(()=>duck.classList.remove('squash'),320);
    $$('.action').forEach(button=>button.classList.toggle('active',button.dataset.action===action));
    renderProps(moment.props);renderHeld(moment.maos||[]);renderStoryProgress(action,index);
    type(state.muted&&moment.id==='heart-music'?'♪ la la la ♪':pickLine(moment));
    $('#hint').textContent=moment.dica||defaultHint;
    Scenes.fire.set(moment.fogo?.level||0,moment.fogo?.shape);musicEngine.setFire(moment.fogo?.level||0);
    if(moment.derreter!==undefined){const from=Scenes.melt.p||previousMoment?.derreter||0;musicEngine.setWarp(moment.derreter);Scenes.melt.to(moment.derreter,{from,beat:moment.beat,eyes:moment.eyes,boing:moment.boing})}else{Scenes.melt.reset();musicEngine.setWarp(0)}
    if(moment.sfx)musicEngine.sfx(moment.sfx);sceneFx(moment.efeito);
    stage.classList.toggle('petal-scene',moment.id==='secretLove');
    choicePanel.classList.toggle('show',moment.id==='heart-invite');inviteYes.classList.remove('grow');inviteNo.style.transform='';
    $('.mood-note').textContent=state.muted?'♪ la la la ♪':'♪ nossa música';
    discover(moment.id);
  }
  function transitionTo(callback,fade=true){if(reducedMotion()||!fade){callback();return}state.transitioning=true;transition.classList.add('active');setTimeout(()=>{try{callback()}finally{transition.classList.remove('active');setTimeout(()=>state.transitioning=false,160)}},155)}
  function showNextMoment(action,{record=true}={}){if(state.transitioning)return;wake();const story=stories[action],index=state.progress[action]%story.moments.length;let moment=story.moments[index];const previousMoment=story.moments[(index+story.moments.length-1)%story.moments.length];state.progress[action]=(index+1)%story.moments.length;if(record){const previous=state.history.at(-1);state.history.push(action);state.history=state.history.slice(-3);const secret=checkCombo(previous);if(secret){moment={...secret,musica:story.moments[index].musica};state.progress[action]=index;showToast('★ MOMENTO SECRETO! ★');burst(secret.id==='secretLove'?['🌸','🌺']:['★','♥'])}}const fade=moment.fundo!==state.currentMoment?.fundo;musicEngine.change(moment.musica);transitionTo(()=>applyMoment(action,moment,index,previousMoment),fade);if(action==='heart'){state.mood=Math.min(100,state.mood+6);burst(['♥','♡'])}if(action==='work'){state.mood=Math.max(0,state.mood-4);burst(['▣','☕'])}if(action==='naughty'){state.mood=Math.min(100,state.mood+2);burst(['✦','♥'])}if(action==='romantico'){state.mood=Math.min(100,state.mood+5);burst(['♥','♪','🍷'])}sound(action==='heart'?660:action==='work'?390:action==='romantico'?720:560);navigator.vibrate?.(20);render();save();resetIdle()}
  function act(action){showNextMoment(action)}
  // Combos: trocar de historinha para ♥ Coração libera um momento secreto (uma vez cada).
  function checkCombo(previous){const current=state.history.at(-1);let key,id;if(previous==='romantico'&&current==='heart'){key='love';id='secretLove'}else if(previous==='work'&&current==='heart'){key='chaos';id='secretChaos'}else if(previous==='naughty'&&current==='heart'){key='wink';id='secretWink'}if(!id||state.secrets.has(key))return null;state.secrets.add(key);return secretMoments[id]}
  function acceptInvite(){if(state.currentMoment?.id!=='heart-invite'||!choicePanel.classList.contains('show'))return;choicePanel.classList.remove('show');type('SIM?! Então vamos! ♥');burst(['♥','✦','♡']);duck.classList.add('squash');musicEngine.sfx('tada');setTimeout(()=>{if(state.currentMoment?.id==='heart-invite')showNextMoment('romantico',{record:false})},reducedMotion()?0:750)}
  function dodgeNo(){if(state.currentMoment?.id!=='heart-invite')return;if(reducedMotion()){type('Tudo bem... o SIM continua aqui quando quiser.');inviteYes.classList.add('grow');return}state.noAttempts++;if(state.noAttempts<=3){const x=-90+Math.random()*180,y=-42+Math.random()*84;inviteNo.style.transform=`translate(${x}px,${y}px)`;type(['Ops, esse botão escorregou!','Quase! Ele é meio tímido.','Última tentativa... talvez.'][state.noAttempts-1]);musicEngine.sfx('whoosh')}if(state.noAttempts>=3){inviteNo.style.transform='';inviteYes.classList.add('grow');duck.classList.add('annoyed');type('Ah... tudo bem. Mas o SIM ficou bem bonito, né?');setTimeout(()=>duck.classList.remove('annoyed'),600)}}
  function throwRose(){const from=($('.held-bouquet')||duck).getBoundingClientRect(),box=stage.getBoundingClientRect();const rose=document.createElement('img');rose.className='thrown-rose';rose.src=Scenes.sprites.rose.src;rose.alt='';rose.style.left=`${from.left-box.left+from.width/2}px`;rose.style.top=`${from.top-box.top+from.height/3}px`;particles.append(rose);setTimeout(()=>rose.remove(),1100);musicEngine.sfx('throw');setTimeout(()=>musicEngine.sfx('kiss'),350)}
  function touch(kind,moment){
    wake();duck.classList.remove('squash');void duck.offsetWidth;duck.classList.add('squash');setTimeout(()=>duck.classList.remove('squash'),310);
    if(kind==='melt'){Scenes.melt.jiggle();musicEngine.sfx(moment.derreter>=1?'blub':'beat');burst(['♥','💛','♡'])}
    else if(kind==='sip'){musicEngine.sfx('sip');burst(['☕','♨'])}
    else if(kind==='rose'){if(!reducedMotion())throwRose();else musicEngine.sfx('kiss');burst(['🌹','♥'])}
    else if(kind==='clink'){musicEngine.sfx('clink');burst(['✦','♥','🥂'])}
    else if(kind==='kiss'){musicEngine.sfx('kiss');burst(['💋','♥','♡']);if(moment.id==='heart-moon'){renderProps(['bigheart']);}}
    type(pickLine(moment,touchLines[kind]));state.mood=Math.min(100,state.mood+2);navigator.vibrate?.(15);render();save();resetIdle();
  }
  function pet(){const moment=state.currentMoment;if(moment?.toque){touch(moment.toque,moment);return}wake();state.duckClicks++;duck.classList.add('squash');setTimeout(()=>duck.classList.remove('squash'),310);if(state.duckClicks===1)type('Hehe... isso faz cosquinha!');else if(state.duckClicks===5){duck.classList.add('annoyed');type('Ei! Carinho tem limite, viu?');burst(['💢'])}else if(state.duckClicks===10){type('Tá bom, você venceu: carinho infinito!');burst(['👑','♥','★']);showToast('Momento especial desbloqueado!')}else type(['Piu!','Mais carinho?','Eu gostei disso.'][state.duckClicks%3]);state.mood=Math.min(100,state.mood+2);sound(720);navigator.vibrate?.(15);render();save();resetIdle()}
  function tapFire(event){
    const moment=state.currentMoment;if(!moment?.fogo)return;
    const box=stage.getBoundingClientRect(),x=event.clientX-box.left,y=event.clientY-box.top;
    if(!Scenes.fire.extinguishAt(x/box.width))return;
    musicEngine.sfx('sizzle');burst(['☁','≋','💧'],{x,y});state.fireTaps++;
    if(state.fireTaps%2===1)type(fireLines[Math.floor(state.fireTaps/2)%fireLines.length]);
    if(state.fireTaps===6)showToast('🧯 Bombeiro honorário (o fogo discorda)');
    resetIdle();
  }
  function render(){document.documentElement.style.setProperty('--mood',state.mood);document.documentElement.style.setProperty('--mood-color',state.mood<30?'#9d93d8':state.mood<65?'#83e6e5':'#ff8fba');$('#foundCount').textContent=state.found.size;$('#albumTotal').textContent=Object.keys(reactions).length;$('.bar').setAttribute('aria-valuenow',state.mood);$('#moodLabel').textContent=state.mood<30?'emburrado':state.mood<65?'curioso':'radiante';$('#sound').textContent=state.muted?'🔇':'🔊';$('#sound').classList.toggle('muted',state.muted);$('#sound').setAttribute('aria-pressed',String(!state.muted));$('#sound').setAttribute('aria-label',state.muted?'Ativar música e efeitos':'Desativar música e efeitos');$('#comboCount').textContent=`Combos ${state.secrets.size}/3`;$$('.secret').forEach((item,i)=>item.classList.toggle('found',state.secrets.has(['love','chaos','wink'][i])));$('#albumGrid').innerHTML=Object.entries(reactions).map(([id,reaction])=>`<div class="card ${state.found.has(id)?'found':''}"><span><b>${state.found.has(id)?reaction.icon:'?'}</b>${state.found.has(id)?reaction.name:'???'}</span></div>`).join('')}
  function wake(){state.sleeping=false;duck.classList.remove('sleep');$('.zzz').style.opacity=''}
  function resetIdle(){clearTimeout(state.idleTimer);state.idleTimer=setTimeout(()=>{state.sleeping=true;duck.classList.add('sleep');type('Zzz... só mais cinco minutinhos...')},25000)}

  $$('.action').forEach(button=>button.addEventListener('click',()=>act(button.dataset.action)));
  duck.addEventListener('click',event=>{if(event.detail)duck.blur();if(event.target.closest('[data-tap]'))return;pet()});duck.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pet()}});
  $('#heldFront').addEventListener('click',event=>{if(event.target.closest('[data-tap]')&&state.currentMoment){event.stopPropagation();touch('rose',state.currentMoment)}});
  stage.addEventListener('pointerdown',event=>{if(event.target.closest('button,.panel,.speech,.choice-panel,#duck,.scene-bottom,.story-progress'))return;tapFire(event)});
  // Mini intro: aparece na primeira visita e pelo botão "?".
  const intro=$('#intro');
  function openIntro(){intro.classList.add('open');intro.querySelector('.album-card').scrollTop=0;$('#closeIntro').focus({preventScroll:true})}
  function closeIntro(start){intro.classList.remove('open');localStorage.setItem('patinho-intro','1');if(start)act(start);else{$('#openIntro').focus();musicEngine.sfx('sparkle')}}
  $('#openIntro').onclick=openIntro;$('#closeIntro').onclick=()=>closeIntro();
  $$('[data-start]').forEach(chip=>chip.addEventListener('click',()=>closeIntro(chip.dataset.start)));
  intro.addEventListener('click',event=>{if(event.target===intro)closeIntro()});
  document.addEventListener('keydown',event=>{if(!intro.classList.contains('open'))return;if(event.key==='Escape'){closeIntro();event.stopImmediatePropagation()}else if(['1','2','3','4'].includes(event.key)){closeIntro({1:'heart',2:'work',3:'naughty',4:'romantico'}[event.key]);event.stopImmediatePropagation()}},true);
  if(!localStorage.getItem('patinho-intro'))openIntro();
  document.addEventListener('keydown',event=>{if(choicePanel.classList.contains('show')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();acceptInvite();return}if(event.key==='1')act('heart');if(event.key==='2')act('work');if(event.key==='3')act('naughty');if(event.key==='4')act('romantico');if(event.key==='Escape')$('#album').classList.remove('open')});
  inviteYes.addEventListener('click',acceptInvite);inviteNo.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover)').matches)dodgeNo()});inviteNo.addEventListener('click',()=>{if(!matchMedia('(hover:hover)').matches)dodgeNo()});
  document.addEventListener('romance-audio-error',()=>showToast('Não consegui iniciar a música. Toque em 🔊 e tente novamente.'));
  $('#sound').onclick=()=>{state.muted=!state.muted;musicEngine.setMuted(state.muted);if(!state.muted)sound(600);if(state.muted&&state.currentMoment?.id==='heart-music')type('♪ la la la ♪');$('.mood-note').textContent=state.muted?'♪ la la la ♪':'♪ nossa música';render();save()};
  $('#openAlbum').onclick=()=>{$('#album').classList.add('open');$('#closeAlbum').focus()};$('#closeAlbum').onclick=()=>{$('#album').classList.remove('open');$('#openAlbum').focus()};$('#album').addEventListener('click',event=>{if(event.target.id==='album')$('#album').classList.remove('open')});
  $('#reset').onclick=()=>{if(confirm('Apagar todas as reações, segredos e o progresso das historinhas?')){localStorage.removeItem('patinho-save');location.reload()}};
  document.addEventListener('pointermove',event=>{if(reducedMotion())return;const rect=duck.getBoundingClientRect(),x=(event.clientX-(rect.left+rect.width/2))/innerWidth;duck.style.filter=`drop-shadow(${x*8}px 12px 0 #18103488)`});
  Scenes.init({stageEl:stage,backdrop:$('#backdrop'),fireCanvas:$('#fireCanvas'),meltCanvas:$('#meltCanvas'),duckImg:duckSprite,duckWrap:duck});
  duckSprite.src=spriteMap['heart-invite'];duckReflection.src=spriteMap['heart-invite'];musicEngine.setMuted(state.muted);render();resetIdle();
})();
