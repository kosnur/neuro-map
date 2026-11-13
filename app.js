'use strict';

/* ================= classification rules ================= */
const SUB_RULES={
 vaz_tuning:'ваз|2107|itelma|эбу|автомоб|вождени|nissan|магнитол|двигател',
 vr_gaming:'psvr|meta quest|квест|шлем|виртуальн',
 anime:'аниме|jujutsu|stone|bleach|дзюдзюцу|ранобэ|фанфик|персонаж',
 assetto:'assetto|ассетто|руль|f1|гонк|gta|fifa|steam|игр|cs2|faceit|counter|ark|гранпри|локалк|монет|fps|uno',
 python_tools:'python|питон|скрипт|arduino|ардуино|excel|access|word кесте|код|погрешност|стандартное отклонение|github|фоторезистор|программ|кнопк',
 os_opt:'windows|виндовс|bios|uefi|bitlocker|tpm|драйвер|загрузочн|bsod|активац|vt|реестр|powershell|автоустановк|установк|проводник|пропуск|пропустить вход',
 hardware:'ноутбук|компьютер|материнск|asus|acer|lenovo|victus|nitro|tuf|fx505|жидкий металл|термопаст|монитор|ssd|жестк|диск|дефраг|флешк|принтер|canon|картридж|wi-?fi|вайфай|зарядк|апгрейд|домофон|bluetooth|адаптер|болтик|экран|модем|роутер|клавиатур|ajazz|i7|сеть|сети|пк|тв',
 migration:'android|ios|iphone|айфон|whatsapp|ватсап|перенос|apple watch|mac|macbook|icloud|sim|tele2|тариф|5g|смартфон',
 roots:'родослов|шежіре|тайп|жезде|туыстық|сатт|ұлы жүз|жамбыл|қабдеш|аул|темір дәуір|империй|партизан|ақын|арнау|юбилей|ветеран|афган',
 olympiad:'олимпиад|делегац|орал',
 lifestyle:'одежд|брюк|поло|прическ|причёск|волос|фен|овсян|завтрак|рецепт|картошк|картофел|куриц|пюре|ужин|пельмен|клетчат|гарнир|тесто|шарлотк|разморозк|рацион|массанабор|mewing|beauty|упражнен|тренажер|глажк|полиэстер|сушилк|отёк|отек|насморк|ванн|мебел|диван|матрас|футболк|помпадур|суши|питание|калори|сон больше|режим сна',
 simulators:'html|javascript|фронт|бэкэнд|сайт|веб|canvas|css|react|приложение|нарисуй схему|три тела|как объяснить график|графический|визуализ|диаграмм',
 collabs:'ғылыми|научн|зерттеу|исследован|рецензир|соавтор|публикац|жарияланым|антиплагиат|патент|литератур|мақала|статья|отчет|отчёт|гипотез|фрейер|плагиат|морали|стандартты ауытқу|t-test|pearson|практик',
 physics:'физик|термодинам|гидравл|гидромех|квант|оптик|оптич|комптон|волн(?!ист)|толқын|колебан|тербел|энерги|молекул|жылу|жылдамдық|кулон|кернеу|магнит|интерференц|заряд(?!к)|шағылу|айнымалы|rlc|гироскоп|давлен|қысым|температур|температ|механик|фотон|линз|астигмат|изотерм|поршн|диффуз|менделеев|клапейрон|тепло|атмосфер|заттың|электр|ток күші|сопромат|радиал|жарылыс|аэротруб|масса алмасу|изобар|газ',
 curriculum:'конспект|лекци|дәріс|урок|сабақ|тапсырма|критери|дескриптор|блум|дидактик|педагог|методик|әдістем|оқыту|тест|викторин|wordwall|зертхана|лаборатор|презентац|stem|жобалық|жоба|бағалау|сценари|пәнаралық|мұғалім|преподав|математ|предел|интеграл|детерминант|производн|касательн|уравнен|эллипс|гипербол|квадрик|аналитическ|перпендикуляр|градиент функции|идз|задач|есеп|сыни ойлау|өткізгіш|lego|робот'
};
const _RE={};
for(const [k,v] of Object.entries(SUB_RULES))
  _RE[k]=new RegExp('(?:^|[^а-яёәғқңөұүіһa-z0-9])(?:'+v+')','g');
function classifyChat(r){
  const title=r.t.toLowerCase(),user=r.m.map(p=>p[0]).join(' ').toLowerCase();
  let best=null,bs=0;
  for(const id of Object.keys(_RE)){
    const re=_RE[id];re.lastIndex=0;
    let s=re.test(title)?5:0;re.lastIndex=0;
    s+=Math.min(3,(user.match(re)||[]).length);
    if(s>bs){bs=s;best=id}
  }
  return bs>=3?best:null;
}

/* ================= helpers ================= */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=(t,long)=>t?new Date(t*1000).toLocaleDateString('ru-RU',long?{day:'numeric',month:'long',year:'numeric'}:{day:'2-digit',month:'2-digit',year:'2-digit'}):'—';
const chatYear=c=>new Date((c.d||0)*1000).getFullYear();
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(toast._t);toast._t=setTimeout(()=>t.style.opacity=0,3000)}
const isMobile=()=>window.matchMedia('(max-width:900px)').matches;

/* ================= state ================= */
let seedNodes=[],seedPairs=[],baseChats=[],extraChats=[];
let nodes=[],edges=[],chats=[],subsByNode={};
let selected=null,selSub=null,selStart=0,drag=null,pan=null,hover=null,hoverSub=null,panAnim=null,subLayout=[],click=null;
let W=800,H=600,dpr=1,scale=1,ox=0,oy=0,viewInit=false;
let hiddenCats=new Set(),yearFilter='all';
let saveTimer=null;
const colors={'Образование':'#61c9ff','Разработка':'#a68cff','Техника':'#ff9c72','Игры':'#65e0ad','Аниме':'#ffd16f','Быт':'#f28cc8','Другое':'#b7c5d8'};

const canvas=$('graph'),ctx=canvas.getContext('2d');

/* ================= persistence ================= */
function idbOpen(){return new Promise((res,rej)=>{const r=indexedDB.open('neuro-map',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('kv'))r.result.createObjectStore('kv')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbGet(k){try{const db=await idbOpen();return await new Promise((res,rej)=>{const t=db.transaction('kv','readonly').objectStore('kv').get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error)})}catch(e){return null}}
async function idbSet(k,v){try{const db=await idbOpen();await new Promise((res,rej)=>{const t=db.transaction('kv','readwrite').objectStore('kv').put(v,k);t.onsuccess=()=>res();t.onerror=()=>rej(t.error)})}catch(e){console.warn('IDB save failed',e)}}
async function idbDel(k){try{const db=await idbOpen();await new Promise((res,rej)=>{const t=db.transaction('kv','readwrite').objectStore('kv').delete(k);t.onsuccess=()=>res();t.onerror=()=>rej(t.error)})}catch(e){}}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{idbSet('state',{v:1,nodes,edges,extraChats})},450)}

/* ================= data load ================= */
async function boot(){
  bindUI();
  try{
    const inline=$('encdata');
    if(inline){
      showLogin(JSON.parse(inline.textContent));
    }else{
      const res=await fetch('data.json',{cache:'no-store'});
      if(!res.ok)throw new Error('data.json: HTTP '+res.status);
      await startApp(await res.json());
    }
  }catch(e){
    console.error(e);
    const err=$('loginError');
    if(err){err.hidden=false;err.textContent='Не удалось загрузить карту: '+e.message}
    else toast('Не удалось загрузить карту: '+e.message);
  }
}

function showLogin(env){
  const box=$('login');
  box.hidden=false;
  document.body.classList.add('locked');
  setTimeout(()=>$('loginPass').focus(),80);
  let remembered=null;
  try{remembered=localStorage.getItem('nm_pass')}catch(e){}
  if(remembered)tryUnlock(env,remembered,true);
  $('loginForm').addEventListener('submit',e=>{
    e.preventDefault();
    tryUnlock(env,$('loginPass').value,false);
  });
}

let unlocking=false;
async function tryUnlock(env,pass,silent){
  if(unlocking)return;
  unlocking=true;
  const err=$('loginError');
  try{
    if(!pass)throw new Error('empty');
    const data=await decryptEnvelope(env,pass);
    try{if($('loginRemember').checked)localStorage.setItem('nm_pass',pass);else localStorage.removeItem('nm_pass')}catch(e){}
    await startApp(data);
    $('login').hidden=true;
    document.body.classList.remove('locked');
    err.hidden=true;
  }catch(e){
    if(silent){
      try{localStorage.removeItem('nm_pass')}catch(_){}
      setTimeout(()=>$('loginPass').focus(),80);
    }else{
      err.hidden=false;
      err.textContent='Неверный пароль. Попробуйте ещё раз.';
      const card=$('loginForm');
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      $('loginPass').select();
    }
  }finally{unlocking=false}
}

async function decryptEnvelope(env,password){
  if(!window.crypto||!crypto.subtle)throw new Error('WebCrypto недоступен. Откройте карту в современном браузере.');
  const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey(
    {name:'PBKDF2',salt:b64(env.salt),iterations:env.iter||250000,hash:'SHA-256'},
    km,{name:'AES-GCM',length:256},false,['decrypt']
  );
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(env.iv)},key,b64(env.ct));
  return JSON.parse(new TextDecoder().decode(plain));
}

async function startApp(data){
  seedNodes=data.seed||[];
  seedPairs=data.pairs||[];
  baseChats=data.chats||[];
  const saved=await idbGet('state');
  if(saved&&Array.isArray(saved.nodes)&&saved.nodes.length){
    nodes=saved.nodes;
    edges=Array.isArray(saved.edges)?saved.edges:[];
    const seen=new Set(baseChats.map(c=>c.t+'|'+c.d));
    extraChats=(saved.extraChats||[]).filter(c=>!seen.has(c.t+'|'+c.d));
  }else{
    nodes=seedNodes.map(n=>({...n}));
    edges=seedPairs.map(([a,b])=>({a,b,weight:1}));
    extraChats=[];
  }
  chats=[...baseChats,...extraChats];
  rebuildSubs();
  buildFilters();
  resize();
  refresh();
  document.body.classList.add('ready');
  registerSW();
}

/* ================= graph model ================= */
function rebuildSubs(){
  subsByNode={};
  chats.forEach((c,i)=>{
    if(yearFilter!=='all'&&chatYear(c)!==+yearFilter)return;
    if(nodes.some(n=>n.id===c.k))(subsByNode[c.k]=subsByNode[c.k]||[]).push(i);
  });
  for(const k in subsByNode)subsByNode[k].sort((a,b)=>chats[a].d-chats[b].d);
}
const nodeById=id=>nodes.find(n=>n.id===id);
const neighborIds=id=>{const s=new Set();edges.forEach(e=>{if(e.a===id)s.add(e.b);else if(e.b===id)s.add(e.a)});return s};
const catVisible=n=>!hiddenCats.has(n.cat);

function resize(){
  const r=canvas.parentElement.getBoundingClientRect();
  dpr=window.devicePixelRatio||1;
  W=r.width||canvas.parentElement.clientWidth||800;
  H=r.height||canvas.parentElement.clientHeight||600;
  canvas.width=W*dpr;canvas.height=H*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(!viewInit&&nodes.length){fitAll();viewInit=true}
  draw();
}
function pos(n){return{x:ox+n.x*Math.min(W,H)*0.82*scale,y:oy+n.y*Math.min(W,H)*0.82*scale}}
function radius(n){return 7+n.freq*1.75}
const subR=c=>3.6+Math.min(3.2,Math.log2(c.n+1)*1.1);
const ringScale=()=>Math.min(1.5,Math.max(0.85,scale));

function ringPlan(count,r0){
  const rings=[];let left=count,k=0;
  while(left>0){const R=r0+k*15,cap=Math.max(6,Math.floor(2*Math.PI*R/13)),cnt=Math.min(cap,left);rings.push({R,cnt});left-=cnt;k++}
  return rings;
}
function layoutSubs(n,ease){
  const list=subsByNode[n.id]||[];if(!list.length)return[];
  const p=pos(n),ks=ringScale(),plan=ringPlan(list.length,radius(n)+26),out=[];let at=0;
  plan.forEach((rg,ri)=>{
    for(let i=0;i<rg.cnt;i++){
      const a=-Math.PI/2+(i/rg.cnt)*2*Math.PI+(ri%2)*(Math.PI/rg.cnt),rr=rg.R*ks*ease,ci=list[at+i];
      out.push({ci,x:p.x+Math.cos(a)*rr,y:p.y+Math.sin(a)*rr,r:subR(chats[ci])*(0.4+0.6*Math.min(1,ease))});
    }
    at+=rg.cnt;
  });
  return out;
}
function ringExtent(n){
  const list=subsByNode[n.id]||[];if(!list.length)return radius(n)+30;
  const plan=ringPlan(list.length,radius(n)+26);return (plan[plan.length-1].R+14)*ringScale();
}
/* вписать все видимые узлы в экран */
function fitAll(){
  const visible=nodes.filter(catVisible);
  if(!visible.length){ox=W/2;oy=H/2;scale=1;return}
  const base=Math.min(W,H)*0.82,pad=Math.max(40,Math.min(76,Math.min(W,H)*0.09));
  let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
  visible.forEach(n=>{
    const r=radius(n)+34;
    minX=Math.min(minX,n.x*base-r);maxX=Math.max(maxX,n.x*base+r);
    minY=Math.min(minY,n.y*base-r);maxY=Math.max(maxY,n.y*base+r);
  });
  const w=Math.max(1,maxX-minX),h=Math.max(1,maxY-minY);
  const s=clamp(Math.min((W-2*pad)/w,(H-2*pad)/h),0.35,1.6);
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  scale=s;ox=W/2-cx*s;oy=H/2-cy*s;
}

/* ================= rendering ================= */
function drawNow(now){
  if(!W||!H)return;
  const pulse=.5+.5*Math.sin(now/420);
  const t=selected?Math.min(1,(now-selStart)/520):1;
  const c1=1.3,ease=1+(c1+1)*Math.pow(t-1,3)+c1*Math.pow(t-1,2);
  const nb=selected?neighborIds(selected):null;
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.strokeStyle='rgba(115,165,220,0.07)';ctx.lineWidth=1;
  for(let x=ox%55;x<W;x+=55){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
  for(let y=oy%55;y<H;y+=55){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}

  edges.forEach(e=>{
    const a=nodeById(e.a),b=nodeById(e.b);if(!a||!b||!catVisible(a)||!catVisible(b))return;
    const A=pos(a),B=pos(b),active=selected&&(e.a===selected||e.b===selected);
    ctx.save();
    ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);
    if(active){ctx.shadowColor='rgba(113,215,255,.95)';ctx.shadowBlur=10+8*pulse;ctx.strokeStyle='rgba(140,225,255,.9)';ctx.lineWidth=2.4}
    else{ctx.strokeStyle=selected?'rgba(104,139,181,0.045)':'rgba(104,139,181,0.19)';ctx.lineWidth=Math.min(1.4,0.45+e.weight*0.2)}
    ctx.stroke();ctx.restore();
  });

  nodes.forEach(n=>{
    if(!catVisible(n))return;
    const p=pos(n),r=radius(n),c=colors[n.cat]||colors['Другое'];
    const active=!selected||n.id===selected||nb.has(n.id);
    const isSel=n.id===selected;
    ctx.globalAlpha=active?1:0.13;
    if(active){
      const gr=r*(isSel?4.2+0.8*pulse:selected?3.9:3.3);
      const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,gr);
      g.addColorStop(0,c+(selected?'cc':'88'));g.addColorStop(1,c+'00');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,gr,0,Math.PI*2);ctx.fill();
    }
    if(isSel){
      ctx.beginPath();ctx.arc(p.x,p.y,r+6+16*pulse,0,Math.PI*2);ctx.strokeStyle=c+Math.round(120*(1-pulse)).toString(16).padStart(2,'0');ctx.lineWidth=2;ctx.stroke();
    }
    ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
    ctx.strokeStyle=isSel?'#fff':'rgba(255,255,255,0.55)';ctx.lineWidth=isSel?2.5:1;ctx.stroke();
    ctx.fillStyle='#eaf2ff';
    ctx.font=`${isSel?'bold ':''}${Math.max(10,Math.min(13,10+n.freq*0.25))}px system-ui`;
    ctx.textAlign='center';
    ctx.fillText(n.name,p.x,p.y+r+15);
    ctx.globalAlpha=1;
  });

  subLayout=[];
  const sn=selected&&nodeById(selected);
  if(sn&&catVisible(sn)){
    const c=colors[sn.cat]||colors['Другое'],P=pos(sn);
    subLayout=layoutSubs(sn,ease);
    const al=Math.min(1,t*1.6);
    subLayout.forEach(s=>{
      const on=s.ci===selSub,hv=s.ci===hoverSub;
      ctx.globalAlpha=al*(on||hv?1:.55);
      ctx.beginPath();ctx.moveTo(P.x,P.y);ctx.lineTo(s.x,s.y);
      ctx.strokeStyle=on?'rgba(255,198,109,.85)':c+'44';ctx.lineWidth=on?1.6:.7;ctx.stroke();
    });
    subLayout.forEach(s=>{
      const on=s.ci===selSub,hv=s.ci===hoverSub,r=s.r+(hv?2.2:0)+(on?1.5+1.2*pulse:0);
      ctx.globalAlpha=al;
      const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r*3);
      g.addColorStop(0,c+(on?'cc':'77'));g.addColorStop(1,c+'00');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,r*3,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.fillStyle=on?'#ffd98f':c;ctx.fill();
      ctx.strokeStyle=on?'#fff':'rgba(255,255,255,.7)';ctx.lineWidth=on?2:1;ctx.stroke();
    });
    ctx.globalAlpha=1;
    ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=4;
    ctx.strokeStyle='rgba(6,14,26,.95)';ctx.strokeText(sn.name,P.x,P.y+radius(sn)+15);
    ctx.fillStyle='#fff';ctx.fillText(sn.name,P.x,P.y+radius(sn)+15);
    const hs=subLayout.find(s=>s.ci===hoverSub)||subLayout.find(s=>s.ci===selSub);
    if(hs){
      const ch=chats[hs.ci];let title=ch.t.length>46?ch.t.slice(0,45)+'…':ch.t;
      const sub=`${fmtDate(ch.d,true)} · ${ch.n} обм.`;
      ctx.font='600 12px system-ui';const w=Math.max(ctx.measureText(title).width,ctx.measureText(sub).width)+20,h=40;
      let tx=hs.x-w/2,ty=hs.y-hs.r-h-12;
      if(ty<4)ty=hs.y+hs.r+12;tx=Math.max(4,Math.min(W-w-4,tx));
      ctx.fillStyle='rgba(8,18,32,.94)';ctx.strokeStyle='#5a8dbb';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect?ctx.roundRect(tx,ty,w,h,8):ctx.rect(tx,ty,w,h);ctx.fill();ctx.stroke();
      ctx.textAlign='left';ctx.fillStyle='#eaf2ff';ctx.fillText(title,tx+10,ty+16);
      ctx.font='11px system-ui';ctx.fillStyle='#91a4c1';ctx.fillText(sub,tx+10,ty+31);
    }
  }
  ctx.restore();
}
let looping=false;
function frame(now){
  if(panAnim){
    const dx=panAnim.tx-ox,dy=panAnim.ty-oy;
    if(Math.abs(dx)+Math.abs(dy)<.6){ox=panAnim.tx;oy=panAnim.ty;panAnim=null}else{ox+=dx*.16;oy+=dy*.16}
  }
  drawNow(now);
  if(selected||panAnim)requestAnimationFrame(frame);else looping=false;
}
function draw(){if(!looping){looping=true;requestAnimationFrame(frame)}}

function hit(x,y){return [...nodes].reverse().find(n=>{if(!catVisible(n))return false;const p=pos(n);return Math.hypot(p.x-x,p.y-y)<radius(n)+10})}
function hitSub(x,y){
  let best=null,bd=1e9;
  for(const s of subLayout){const d=Math.hypot(s.x-x,s.y-y);if(d<s.r+8&&d<bd){bd=d;best=s.ci}}
  return best;
}

/* ================= selection / dialog ================= */
function choose(n,recenter){
  const id=n?.id||null;
  if(id!==selected){selected=id;selStart=performance.now();selSub=null;hideDialog()}
  if(n&&recenter!==false)fitToView(n);
  renderDetails(n);renderList();draw();
}
function fitToView(n){
  const p=pos(n),ext=ringExtent(n)+24;let dx=0,dy=0;
  if(2*ext>=W)dx=W/2-p.x;else if(p.x<ext)dx=ext-p.x;else if(p.x>W-ext)dx=W-ext-p.x;
  if(2*ext>=H)dy=H/2-p.y;else if(p.y<ext)dy=ext-p.y;else if(p.y>H-ext)dy=H-ext-p.y;
  if(Math.abs(dx)+Math.abs(dy)>2)panAnim={tx:ox+dx,ty:oy+dy};
}
function selectSub(ci){
  const c=chats[ci];if(!c)return;
  if(selected!==c.k){const n=nodeById(c.k);if(!n)return;choose(n)}
  selSub=ci;showDialog(ci);renderDetails(nodeById(selected));draw();
}

function fmtText(s){
  let h=esc(s);
  h=h.replace(/```[a-z]*\n?([\s\S]*?)```/g,(m,c)=>'<code style="display:block;white-space:pre-wrap;padding:6px 8px">'+c.trim()+'</code>');
  h=h.replace(/^#{1,4}\s*(.+)$/gm,'<b>$1</b>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/`([^`\n]+)`/g,'<code>$1</code>');
  return h;
}
function showDialog(ci){
  const c=chats[ci],n=nodeById(c.k);
  $('dlgTitle').textContent=c.t;
  $('dlgMeta').textContent=`${fmtDate(c.d,true)} · тема: ${n?n.name:'—'} · обменов: ${c.n}`;
  let h=c.m.map(([q,a])=>`<div class="msg u"><div class="who">Вы</div><div class="txt">${fmtText(q||'(пусто)')}</div></div><div class="msg a"><div class="who">Ответ</div><div class="txt">${fmtText(a||'(нет ответа)')}</div></div>`).join('');
  if(c.n>c.m.length)h+=`<div class="note">Показаны первые ${c.m.length} из ${c.n} обменов</div>`;
  $('dialogBody').innerHTML=h;$('dialogBody').scrollTop=0;
  $('dialogPanel').hidden=false;
  if(isMobile()){
    $('dialogPanel').classList.add('open');
    $('sheetBackdrop').hidden=false;
    document.body.classList.add('sheet-open');
  }else{
    $('side').scrollTop=0;
    $('dialogPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
function hideDialog(){
  selSub=null;
  $('dialogPanel').hidden=true;
  $('dialogBody').innerHTML='';
  $('dialogPanel').classList.remove('open');
  $('dialogPanel').style.transform='';
  $('sheetBackdrop').hidden=true;
  document.body.classList.remove('sheet-open');
}

function renderDetails(n){
  const el=$('details');
  if(!n){el.innerHTML='<h2>Карточка узла</h2><p class="muted">Выбери нейрон на карте, чтобы увидеть его связи, период, описание и список подтем-чатов.</p>';return}
  const linked=edges.filter(e=>e.a===n.id||e.b===n.id).map(e=>nodeById(e.a===n.id?e.b:e.a)).filter(Boolean);
  const subs=subsByNode[n.id]||[];
  const list=subs.length?`<p class="small" style="margin:10px 0 0"><b>Подтемы из чатов (${subs.length}):</b></p><div class="sublist">${subs.map(ci=>`<div class="subitem${ci===selSub?' on':''}" data-ci="${ci}"><span class="dt">${fmtDate(chats[ci].d)}</span><span>${esc(chats[ci].t)}</span></div>`).join('')}</div>`:'<p class="small">Чатов в базе для этой темы пока нет.</p>';
  el.innerHTML=`<div class="detailTitle">${esc(n.name)}</div><div class="metric">Важность: ${n.freq}/10 · ${esc(n.cat)}</div><p>${esc(n.desc||'Описание не добавлено.')}</p><p class="small">Период: ${esc(n.date||'не указан')}</p><p class="small"><b>Связи:</b> ${linked.length?linked.map(x=>esc(x.name)).join(' · '):'пока нет'}</p>${list}<p style="margin-bottom:0"><button id="delNode">Удалить узел</button></p>`;
  el.querySelectorAll('.subitem').forEach(it=>it.onclick=()=>selectSub(+it.dataset.ci));
  $('delNode').onclick=()=>{nodes=nodes.filter(x=>x.id!==n.id);edges=edges.filter(e=>e.a!==n.id&&e.b!==n.id);selected=null;hideDialog();rebuildSubs();buildFilters();refresh();scheduleSave();toast('Узел удалён')};
}

function renderList(){
  const q=$('search').value.trim().toLowerCase();
  let h=nodes.filter(n=>n.name.toLowerCase().includes(q)||n.cat.toLowerCase().includes(q)).sort((a,b)=>b.freq-a.freq).map(n=>`<div class="nodeitem" data-id="${n.id}">● ${esc(n.name)} <span class="small">· ${n.freq}/10 · чатов ${(subsByNode[n.id]||[]).length}</span></div>`).join('');
  if(q){
    const found=[];chats.forEach((c,i)=>{if(found.length<25&&c.t.toLowerCase().includes(q)&&nodeById(c.k))found.push(i)});
    h+=found.map(i=>`<div class="nodeitem chat" data-ci="${i}">↳ ${esc(chats[i].t)} <span class="small">· ${fmtDate(chats[i].d)}</span></div>`).join('');
  }
  $('nodes').innerHTML=h;
  document.querySelectorAll('#nodes .nodeitem[data-id]').forEach(el=>el.onclick=()=>{const n=nodeById(el.dataset.id);const p=pos(n);ox+=W/2-p.x;oy+=H/2-p.y;choose(n,false)});
  document.querySelectorAll('#nodes .nodeitem[data-ci]').forEach(el=>el.onclick=()=>selectSub(+el.dataset.ci));
}

function updateStats(){
  $('countN').textContent=nodes.filter(catVisible).length;
  $('countE').textContent=edges.filter(e=>{const a=nodeById(e.a),b=nodeById(e.b);return a&&b&&catVisible(a)&&catVisible(b)}).length;
  $('countC').textContent=new Set(nodes.filter(catVisible).map(n=>n.cat)).size;
  $('countS').textContent=Object.values(subsByNode).reduce((s,a)=>s+a.length,0);
}
function refresh(){
  updateStats();
  renderList();
  draw();
  renderDetails(nodeById(selected));
  renderActivity();
}

/* ================= filters ================= */
function buildFilters(){
  const cats=[...new Set(nodes.map(n=>n.cat))].sort();
  const box=$('catChips');
  box.innerHTML=cats.map(c=>`<button type="button" class="chip${hiddenCats.has(c)?' off':''}" data-cat="${esc(c)}"><span style="background:${colors[c]||colors['Другое']}"></span>${esc(c)}</button>`).join('');
  box.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{
    const c=ch.dataset.cat;
    if(hiddenCats.has(c))hiddenCats.delete(c);else hiddenCats.add(c);
    if(selected&&hiddenCats.has(nodeById(selected)?.cat)){selected=null;hideDialog()}
    buildFilters();refresh();draw();
  });
  const years=[...new Set(chats.map(chatYear))].filter(y=>y>1970).sort();
  const sel=$('yearFilter');
  sel.innerHTML='<option value="all">Все годы</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
  sel.value=yearFilter;
  sel.onchange=()=>{yearFilter=sel.value;rebuildSubs();refresh();draw()};
}

function renderActivity(){
  const cv=$('activity');if(!cv)return;
  const box=cv.parentElement.getBoundingClientRect();
  const w=Math.max(140,box.width-2),h=62,d=window.devicePixelRatio||1;
  cv.width=w*d;cv.height=h*d;cv.style.width=w+'px';cv.style.height=h+'px';
  const g=cv.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);
  const map=new Map();
  chats.forEach(c=>{
    if(yearFilter!=='all'&&chatYear(c)!==+yearFilter)return;
    const dt=new Date((c.d||0)*1000);
    if(dt.getFullYear()<2000)return;
    const k=dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0');
    map.set(k,(map.get(k)||0)+1);
  });
  const keys=[...map.keys()].sort();
  if(!keys.length){g.fillStyle='#91a4c1';g.font='11px system-ui';g.fillText('Нет данных о чатах',6,24);return}
  const [minY,minM]=keys[0].split('-').map(Number),[maxY,maxM]=keys[keys.length-1].split('-').map(Number);
  const months=[];let y=minY,m=minM;
  while(y<maxY||(y===maxY&&m<=maxM)){months.push(y+'-'+String(m).padStart(2,'0'));m++;if(m>12){m=1;y++}}
  const shown=months.slice(-36);
  const max=Math.max(1,...shown.map(k=>map.get(k)||0));
  const bw=w/shown.length;
  shown.forEach((k,i)=>{
    const v=map.get(k)||0,bh=v?Math.max(2,(v/max)*(h-16)):1;
    g.fillStyle=v?'#4ea7d8':'#223650';
    g.fillRect(i*bw+1,h-bh-12,Math.max(1,bw-2),bh);
    if(k.endsWith('-01')){g.fillStyle='#91a4c1';g.font='9px system-ui';g.fillText(k.slice(2,4),i*bw+1,h-2)}
  });
}

/* ================= pointer interaction ================= */
const pts=new Map();
let pinch=null;
function localXY(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

canvas.addEventListener('pointerdown',e=>{
  const p=localXY(e);
  pts.set(e.pointerId,p);
  try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  if(pts.size===2){
    drag=null;pan=null;click=null;
    const [a,b]=[...pts.values()];
    pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,scale,ox,oy};
    return;
  }
  panAnim=null;
  const s=hitSub(p.x,p.y);
  if(s!==null){click={type:'sub',ci:s,x:p.x,y:p.y};pan={x:p.x,y:p.y,ox,oy}}
  else{
    const n=hit(p.x,p.y);
    if(n){drag={n,dx:pos(n).x-p.x,dy:pos(n).y-p.y};choose(n,false);click=null}
    else{pan={x:p.x,y:p.y,ox,oy};click={type:'blank',x:p.x,y:p.y}}
  }
});

canvas.addEventListener('pointermove',e=>{
  if(pts.has(e.pointerId))pts.set(e.pointerId,localXY(e));
  if(pinch&&pts.size>=2){
    const [a,b]=[...pts.values()];
    const d=Math.hypot(a.x-b.x,a.y-b.y)||1;
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    const ns=clamp(pinch.scale*d/pinch.d,.35,3);
    const k=ns/pinch.scale;
    scale=ns;
    ox=mx-(pinch.mx-pinch.ox)*k;
    oy=my-(pinch.my-pinch.oy)*k;
    draw();
    return;
  }
  const p=localXY(e);
  if(click&&Math.hypot(p.x-click.x,p.y-click.y)>6)click=null;
  if(drag){const k=Math.min(W,H)*0.82*scale;drag.n.x=(p.x+drag.dx-ox)/k;drag.n.y=(p.y+drag.dy-oy)/k;draw()}
  else if(pan){ox=pan.ox+p.x-pan.x;oy=pan.oy+p.y-pan.y;draw()}
  else{
    const hs=hitSub(p.x,p.y),hn=hs===null?hit(p.x,p.y):null;
    if(hs!==hoverSub){hoverSub=hs;draw()}
    hover=hn;canvas.style.cursor=(hs!==null||hn)?'pointer':'grab';
  }
});

function endPointer(e){
  pts.delete(e.pointerId);
  if(pts.size<2)pinch=null;
  if(drag)scheduleSave();
  if(click){
    if(click.type==='sub')selectSub(click.ci);
    else if(click.type==='blank'&&selected){selected=null;hideDialog();renderDetails(null);renderList();draw()}
  }
  click=null;drag=null;pan=null;
}
canvas.addEventListener('pointerup',endPointer);
canvas.addEventListener('pointercancel',endPointer);
canvas.addEventListener('pointerleave',e=>{if(!pts.size&&hoverSub!==null){hoverSub=null;draw()}});
canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const p=localXY(e);
  const ns=clamp(scale*(e.deltaY<0?1.08:0.92),.35,3);
  const k=ns/scale;
  ox=p.x-(p.x-ox)*k;
  oy=p.y-(p.y-oy)*k;
  scale=ns;
  draw();
},{passive:false});

/* ================= UI wiring ================= */
function bindUI(){
  $('dlgClose').onclick=()=>{hideDialog();renderDetails(nodeById(selected));draw()};
  $('sheetBackdrop').onclick=()=>{hideDialog();renderDetails(nodeById(selected));draw()};
  $('search').addEventListener('input',renderList);
  $('addToggle').onclick=()=>{const p=$('addPanel');p.hidden=!p.hidden;if(!p.hidden)p.scrollIntoView({behavior:'smooth',block:'nearest'})};
  $('saveNode').onclick=()=>{
    const name=$('newName').value.trim();if(!name)return toast('Укажи название');
    const id='n'+Date.now(),n={id,name,cat:$('newCat').value,freq:clamp(+$('newFreq').value||3,1,10),desc:$('newDesc').value,date:$('newDate').value,x:(Math.random()-0.5)*1.1,y:(Math.random()-0.5)*1.1};
    nodes.push(n);
    const wanted=$('newLinks').value.split(',').map(s=>s.trim().toLowerCase());
    nodes.filter(x=>x.id!==id&&wanted.includes(x.name.toLowerCase())).forEach(x=>edges.push({a:id,b:x.id,weight:2}));
    ['newName','newDesc','newDate','newLinks'].forEach(i=>$(i).value='');
    selected=id;selStart=performance.now();hideDialog();rebuildSubs();buildFilters();refresh();scheduleSave();toast('Нейрон добавлен');
  };
  $('reset').onclick=()=>{panAnim=null;fitAll();draw()};
  $('export').onclick=()=>{const blob=new Blob([JSON.stringify({nodes,edges,chats},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='neural-map-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
  $('png').onclick=exportPNG;
  $('resetEdits').onclick=async()=>{
    if(!confirm('Сбросить добавленные узлы, импортированные чаты и перемещения? Переписка останется.'))return;
    await idbDel('state');
    nodes=seedNodes.map(n=>({...n}));edges=seedPairs.map(([a,b])=>({a,b,weight:1}));
    extraChats=[];chats=[...baseChats];selected=null;selSub=null;hiddenCats=new Set();yearFilter='all';
    hideDialog();rebuildSubs();buildFilters();refresh();draw();toast('Правки сброшены');
  };
  $('installBtn').onclick=async()=>{
    if(!deferredPrompt)return;
    deferredPrompt.prompt();
    try{await deferredPrompt.userChoice}catch(e){}
    deferredPrompt=null;$('installBtn').hidden=true;
  };

  /* свайп вниз для мобильного окна диалога */
  const handle=$('sheetHandle');
  let sheetDrag=null;
  handle.addEventListener('pointerdown',e=>{sheetDrag={y:e.clientY};try{handle.setPointerCapture(e.pointerId)}catch(_){}});
  handle.addEventListener('pointermove',e=>{
    if(!sheetDrag)return;
    const dy=Math.max(0,e.clientY-sheetDrag.y);
    $('dialogPanel').style.transform=`translateY(${dy}px)`;
  });
  const endSheet=e=>{
    if(!sheetDrag)return;
    const dy=e.clientY-sheetDrag.y;sheetDrag=null;
    $('dialogPanel').style.transform='';
    if(dy>90){hideDialog();renderDetails(nodeById(selected));draw()}
  };
  handle.addEventListener('pointerup',endSheet);
  handle.addEventListener('pointercancel',endSheet);

  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(selSub!==null){hideDialog();renderDetails(nodeById(selected));draw()}else if(selected){selected=null;renderDetails(null);renderList();draw()}}});
  window.addEventListener('resize',()=>{resize();renderActivity()});
}

/* ================= export PNG ================= */
function exportPNG(){
  const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;
  const g=out.getContext('2d');
  const grad=g.createRadialGradient(out.width/2,out.height*.2,0,out.width/2,out.height*.2,out.width*.7);
  grad.addColorStop(0,'#142642');grad.addColorStop(.65,'#080d18');
  g.fillStyle=grad;g.fillRect(0,0,out.width,out.height);
  g.drawImage(canvas,0,0);
  out.toBlob(b=>{
    if(!b)return toast('Не удалось сохранить PNG');
    const a=document.createElement('a');a.href=URL.createObjectURL(b);
    a.download='neural-map-'+new Date().toISOString().slice(0,10)+'.png';
    a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
    toast('Карта сохранена в PNG');
  },'image/png');
}

/* ================= import ChatGPT export ================= */
function cleanTxt(s){
  s=s.replace(/\ue200[\s\S]*?\ue201/g,'').replace(/[\ue000-\uf8ff]/g,'');
  if(s.startsWith('genui'))s='[интерактивный блок]';
  return s.trim().replace(/(?:\d{6}-){7}\d{6}/g,'[ключ скрыт]').replace(/(?<!\d)\d{12}(?!\d)/g,'[ИИН скрыт]').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g,'[email скрыт]');
}
function msgText(m){
  const c=m.content||{};if(c.content_type!=='text'&&c.content_type!=='multimodal_text')return null;
  const out=[];let img=false;
  for(const p of c.parts||[]){
    if(typeof p==='string'){if(p.trim())out.push(p.trim())}
    else if(p&&p.content_type==='image_asset_pointer')img=true;
    else if(p&&typeof p.text==='string'&&p.text.trim())out.push(p.text.trim());
  }
  const t=cleanTxt((img?'[изображение] ':'')+out.join('\n'));return t||null;
}
function convToRow(c){
  const mp=c.mapping||{};let id=c.current_node;const path=[];
  while(id&&mp[id]){path.push(mp[id]);id=mp[id].parent}
  path.reverse();
  const msgs=[];
  for(const n of path){
    const m=n.message;if(!m||(m.metadata&&m.metadata.is_visually_hidden_from_conversation))continue;
    const role=m.author&&m.author.role;if(role!=='user'&&role!=='assistant')continue;
    const t=msgText(m);if(t)msgs.push([role,t]);
  }
  const prs=[];let q=[],a=[];
  for(const [r,t] of msgs){
    if(r==='user'){if(a.length){prs.push([q.join('\n\n'),a.join('\n\n')]);q=[];a=[]}q.push(t)}else a.push(t);
  }
  if(q.length||a.length)prs.push([q.join('\n\n'),a.join('\n\n')]);
  if(!prs.length)return null;
  const cut=(s,n)=>s.length>n?s.slice(0,n).trimEnd()+'…':s;
  return{t:(c.title||'Без названия').trim(),d:Math.round(c.create_time||0),n:prs.length,m:prs.slice(0,12).map(([x,y])=>[cut(x,1200),cut(y,2600)])};
}
function bindImport(){
  $('file').onchange=async e=>{
    const files=[...e.target.files];if(!files.length)return;
    try{
      const all=[];
      for(const f of files){
        const data=JSON.parse(await f.text());
        if(Array.isArray(data))all.push(...data);
        else if(Array.isArray(data.conversations))all.push(...data.conversations);
        else if(data.mapping)all.push(data);
        else throw new Error('в '+f.name+' нет диалогов (ожидается conversations-*.json)');
      }
      const seen=new Set(chats.map(c=>c.t+'|'+c.d));let added=0,skipped=0,dup=0;
      for(const conv of all){
        const row=convToRow(conv);if(!row)continue;
        if(seen.has(row.t+'|'+row.d)){dup++;continue}
        const k=classifyChat(row);if(!k||!nodeById(k)){skipped++;continue}
        row.k=k;chats.push(row);extraChats.push(row);seen.add(row.t+'|'+row.d);added++;
      }
      rebuildSubs();buildFilters();refresh();scheduleSave();
      toast(`Добавлено подтем: ${added} · без подходящей темы: ${skipped} · дубликатов: ${dup}`);
    }catch(err){toast('Ошибка импорта: '+err.message)}
    e.target.value='';
  };
}

/* ================= PWA ================= */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  const b=$('installBtn');if(b)b.hidden=false;
});
function registerSW(){
  if(!('serviceWorker'in navigator)||!location.protocol.startsWith('http'))return;
  navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW:',e.message));
}

/* ================= start ================= */
bindImport();
boot();
