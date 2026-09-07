/* Deterministic procedural illustrations, not satellite imagery. No external assets. */
window.makeSurface = function makeSurface(kind, base) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    let seed = Array.from(kind).reduce((n, c) => n + c.charCodeAt(0), 17);
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    ctx.fillStyle = '#' + base.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 1024, 512);
    const gas = ['jupiter', 'saturn', 'venus', 'uranus', 'neptune'].includes(kind);
    if (gas) {
        const palettes = {
            jupiter: ['#b58768', '#e7d8b8', '#a57558', '#f0e2ca', '#cba17f'],
            saturn: ['#d7c49b', '#ad9971', '#efe0b7', '#c5b084'],
            venus: ['#e5bd80', '#d8a966', '#f3d6a4'],
            uranus: ['#a6d9de', '#9dccd5', '#b8e3e1'],
            neptune: ['#325ab3', '#416dc9', '#284897'],
        };
        for (let y = 0; y < 512; y += 1) {
            ctx.fillStyle = palettes[kind][Math.floor(random() * palettes[kind].length)];
            ctx.globalAlpha = ['uranus', 'neptune'].includes(kind) ? .09 : .16;
            ctx.beginPath(); ctx.moveTo(0, y);
            for (let x = 0; x <= 1024; x += 8) ctx.lineTo(x, y + Math.sin(x / 1024 * Math.PI * 6 + y / 35) * 4);
            ctx.lineTo(1024, y + 5); ctx.lineTo(0, y + 5); ctx.fill();
        }
        if (kind === 'jupiter') {
            ctx.globalAlpha = 1;
            ctx.save();ctx.translate(710,315);ctx.rotate(.12);ctx.scale(1,.38);
            const storm=ctx.createRadialGradient(-5,0,4,0,0,63);
            storm.addColorStop(0,'rgba(151,83,53,.85)');storm.addColorStop(.35,'rgba(193,119,75,.8)');
            storm.addColorStop(.65,'rgba(170,100,65,.65)');storm.addColorStop(.85,'rgba(214,168,120,.35)');storm.addColorStop(1,'rgba(214,168,120,0)');
            ctx.fillStyle=storm;ctx.fillRect(-65,-65,130,130);ctx.restore();
        }
    } else if (kind === 'sun') {
        ctx.fillStyle='#ffb039'; ctx.fillRect(0,0,1024,512);
    } else {
        for (let i = 0; i < 350; i++) {
            const x=random()*1024, y=30+random()*452, r=1+Math.pow(random(),3)*15;
            for (const offset of [-1024,0,1024]) {
                const g=ctx.createRadialGradient(x+offset-r*.1,y-r*.1,r*.1,x+offset,y,r);
                g.addColorStop(0,'rgba(22,19,16,.24)');g.addColorStop(.6,'rgba(24,21,18,.18)');
                g.addColorStop(.8,'rgba(233,221,201,.18)');g.addColorStop(1,'rgba(233,221,201,0)');
                ctx.fillStyle=g;ctx.fillRect(x+offset-r,y-r,r*2,r*2);
            }
        }
        if (kind === 'mars') { ctx.fillStyle='#ddd3c2'; ctx.fillRect(0,0,1024,14); }
    }
    ctx.globalAlpha = 1;
    // Periodic value noise: continuous at the longitude seam, without random pixel speckle.
    function noise(x,y,period) {
        const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
        const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
        const hash=(a,b)=>{a=((a%period)+period)%period;let n=Math.imul(a+kind.length*137,374761393)+Math.imul(b,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
        const mix=(a,b,t)=>a+(b-a)*t;
        return mix(mix(hash(ix,iy),hash(ix+1,iy),sx),mix(hash(ix,iy+1),hash(ix+1,iy+1),sx),sy);
    }
    const detail=(u,v)=>noise(u*8,v*8,8)*.53+noise(u*16,v*16,16)*.27+noise(u*32,v*32,32)*.13+noise(u*64,v*64,64)*.07;
    const makeCanvas=()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;return c;};
    const bumpCanvas=makeCanvas(),roughCanvas=makeCanvas();
    const source=ctx.getImageData(0,0,1024,512), out=ctx.createImageData(1024,512);
    const bump=ctx.createImageData(1024,512),rough=ctx.createImageData(1024,512);
    for(let y=0;y<512;y++) for(let x=0;x<1024;x++) {
        const u=x/1024,v=y/511,i=(y*1024+x)*4,n=detail(u,v),fine=noise(u*192,v*192,192);
        const wx=(x+Math.round((n-.5)*18)+1024)%1024,wy=Math.max(0,Math.min(511,y+Math.round((fine-.5)*5)));
        const j=(wy*1024+wx)*4;
        let rgb=[source.data[j],source.data[j+1],source.data[j+2]],height=.5,r=.95;
        if(kind==='sun') {
            const cells=noise(u*256,v*256,256),heat=.3+n*.53+(cells-.5)*.4;
            rgb=[255,100+heat*140,12+heat*89];
            if(n>.77 && Math.abs(v-.5)<.3) rgb=rgb.map(c=>c*.48);
        } else if(gas) {
            const shade=.9+n*.2;rgb=rgb.map(c=>c*shade);r=1;
        } else {
            const shade=.62+n*.65+(fine-.5)*.12;rgb=rgb.map(c=>c*shade);
            height=.24+n*.42+(rgb[0]/255)*.12;
        }
        out.data.set([...rgb.map(c=>Math.max(0,Math.min(255,c))),255],i);
        bump.data.set([height*255,height*255,height*255,255],i);
        rough.data.set([r*255,r*255,r*255,255],i);
    }
    ctx.putImageData(out,0,0);bumpCanvas.getContext('2d').putImageData(bump,0,0);roughCanvas.getContext('2d').putImageData(rough,0,0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    const bumpMap=new THREE.CanvasTexture(bumpCanvas),roughnessMap=new THREE.CanvasTexture(roughCanvas);
    texture.userData={bumpMap,roughnessMap};
    return texture;
};

window.makeRingTexture = () => {
    const c=document.createElement('canvas');c.width=1024;c.height=1;
    const ctx=c.getContext('2d'),img=ctx.createImageData(1024,1);
    for(let x=0;x<1024;x++) {
        const t=x/1023,grain=.5+.5*Math.sin(t*780)*Math.sin(t*317),b=.65+grain*.3;
        const gap=t>.57&&t<.62,edge=Math.min(1,t*25,(1-t)*22);
        img.data.set([218*b,200*b,165*b,gap?3:edge*(135+grain*95)],x*4);
    }
    ctx.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
};

window.makeCoronaTexture = () => {
    const c=document.createElement('canvas');c.width=256;c.height=256;const ctx=c.getContext('2d');
    const g=ctx.createRadialGradient(128,128,0,128,128,128);
    g.addColorStop(0,'rgba(255,180,66,0)');g.addColorStop(.42,'rgba(255,180,66,0)');
    g.addColorStop(.5,'rgba(255,183,80,.28)');g.addColorStop(.62,'rgba(255,143,43,.07)');g.addColorStop(1,'rgba(255,112,30,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
};
