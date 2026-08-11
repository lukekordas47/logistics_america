(function(){
  const img = document.getElementById('base');
  const canvas = document.getElementById('draw');
  const ctx = canvas.getContext('2d');
  const stage = document.getElementById('stage');

  const STORE_KEY = 'ports_rail_map_annotations_v1';
  let painting=false, tool='pen', color='#c81e1e', size=4;
  let last=null;
  const strokes=[];        // completed strokes for undo
  let current=null;

  // ---- setup canvas to natural image resolution ----
  function initCanvas(){
    canvas.width  = img.naturalWidth  || 1651;
    canvas.height = img.naturalHeight || 1145;
    restore();
  }
  function tryInit(){ if(img.naturalWidth){ initCanvas(); return true; } return false; }
  if(!tryInit()){ img.addEventListener('load', initCanvas, {once:true}); if(img.decode){ img.decode().then(initCanvas).catch(function(){}); } window.addEventListener('load', initCanvas); }

  // ---- coordinate mapping (displayed px -> canvas px) ----
  function pos(e){
    const r = canvas.getBoundingClientRect();
    const p = (e.touches && e.touches[0]) ? e.touches[0] : e;
    return {
      x:(p.clientX - r.left) * (canvas.width / r.width),
      y:(p.clientY - r.top)  * (canvas.height / r.height)
    };
  }

  function drawSeg(a,b,c,s,erase){
    ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = c; ctx.lineWidth = s;
    ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  }

  function start(e){
    e.preventDefault();
    painting=true; last=pos(e);
    current={tool, color, size, pts:[last]};
    // dot for single taps
    drawSeg(last,last,color,size,tool==='erase');
  }
  function move(e){
    if(!painting) return;
    e.preventDefault();
    const p=pos(e);
    drawSeg(last,p,color,size,tool==='erase');
    current.pts.push(p); last=p;
  }
  function end(){
    if(!painting) return;
    painting=false;
    if(current && current.pts.length){ strokes.push(current); persist(); }
    current=null;
  }

  canvas.addEventListener('mousedown',start);
  canvas.addEventListener('mousemove',move);
  window.addEventListener('mouseup',end);
  canvas.addEventListener('touchstart',start,{passive:false});
  canvas.addEventListener('touchmove',move,{passive:false});
  canvas.addEventListener('touchend',end);

  // ---- repaint from stroke list ----
  function repaint(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const s of strokes){
      for(let i=1;i<s.pts.length;i++) drawSeg(s.pts[i-1],s.pts[i],s.color,s.size,s.tool==='erase');
      if(s.pts.length===1) drawSeg(s.pts[0],s.pts[0],s.color,s.size,s.tool==='erase');
    }
    ctx.globalCompositeOperation='source-over';
  }

  // ---- persistence ----
  function persist(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(strokes)); }catch(_){} }
  function restore(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(raw){ const arr=JSON.parse(raw); if(Array.isArray(arr)){ strokes.length=0; arr.forEach(s=>strokes.push(s)); repaint(); } }
    }catch(_){}
  }

  // ---- toolbar wiring ----
  const penBtn=document.getElementById('penBtn'), eraseBtn=document.getElementById('eraseBtn');
  function setTool(t){ tool=t; penBtn.classList.toggle('active',t==='pen'); eraseBtn.classList.toggle('active',t==='erase'); }
  penBtn.onclick=()=>setTool('pen');
  eraseBtn.onclick=()=>setTool('erase');

  const palette=['#c81e1e','#1e63c8','#178a3a','#e0a400','#7a1fb0','#111111','#ffffff'];
  const colorsEl=document.getElementById('colors');
  palette.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='swatch'+(i===0?' sel':''); b.style.background=c; b.title=c;
    b.onclick=()=>{ color=c; document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); setTool('pen'); };
    colorsEl.appendChild(b);
  });
  document.getElementById('customColor').oninput=e=>{ color=e.target.value; document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('sel')); setTool('pen'); };

  const sizeEl=document.getElementById('size'), sizeVal=document.getElementById('sizeVal');
  sizeEl.oninput=e=>{ size=+e.target.value; sizeVal.textContent=size; };

  document.getElementById('undoBtn').onclick=()=>{ strokes.pop(); repaint(); persist(); };
  document.getElementById('clearBtn').onclick=()=>{ if(confirm('Clear all your marks?')){ strokes.length=0; repaint(); persist(); } };

  document.getElementById('saveBtn').onclick=()=>{
    const out=document.createElement('canvas');
    out.width=canvas.width; out.height=canvas.height;
    const o=out.getContext('2d');
    o.drawImage(img,0,0,out.width,out.height);
    o.drawImage(canvas,0,0);
    const a=document.createElement('a');
    a.download='ports-rail-map-annotated.png';
    a.href=out.toDataURL('image/png'); a.click();
  };

  // keyboard shortcuts
  window.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); strokes.pop(); repaint(); persist(); }
    else if(e.key.toLowerCase()==='p'){ setTool('pen'); }
    else if(e.key.toLowerCase()==='e'){ setTool('erase'); }
  });
})();
