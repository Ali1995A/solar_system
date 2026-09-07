/* Procedural illustrations, not astronomical surface maps. No external assets. */
window.makeSurface = function makeSurface(kind, base) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    let seed = Array.from(kind).reduce((n, c) => n + c.charCodeAt(0), 17);
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    ctx.fillStyle = '#' + base.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 1024, 512);
    if (['jupiter', 'saturn', 'venus', 'uranus', 'neptune', 'sun'].includes(kind)) {
        const palettes = {
            jupiter: ['#b58768', '#e7d8b8', '#a57558', '#f0e2ca', '#cba17f'],
            saturn: ['#d7c49b', '#ad9971', '#efe0b7', '#c5b084'],
            venus: ['#e5bd80', '#d8a966', '#f3d6a4'],
            uranus: ['#a6d9de', '#9dccd5', '#b8e3e1'],
            neptune: ['#325ab3', '#416dc9', '#284897'],
            sun: ['#ffae32', '#ffcd58', '#ed7920', '#ffe28a']
        };
        for (let y = 0; y < 512; y += 3) {
            ctx.fillStyle = palettes[kind][Math.floor(random() * palettes[kind].length)];
            ctx.globalAlpha = 0.35 + random() * 0.35;
            ctx.beginPath(); ctx.moveTo(0, y);
            for (let x = 0; x <= 1024; x += 8) ctx.lineTo(x, y + Math.sin(x / 1024 * Math.PI * 6 + y / 35) * 4);
            ctx.lineTo(1024, y + 7); ctx.lineTo(0, y + 7); ctx.fill();
        }
        if (kind === 'jupiter') {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#af6546'; ctx.beginPath(); ctx.ellipse(710, 315, 63, 23, 0.12, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#dfb190'; ctx.lineWidth = 6; ctx.stroke();
        }
    } else if (kind === 'earth') {
        ctx.fillStyle = '#20528c'; ctx.fillRect(0, 0, 1024, 512);
        // Hand-drawn land silhouettes intentionally remain an illustration.
        const lands = [ [[100,110],[180,75],[275,120],[240,190],[195,235],[150,185]], [[235,240],[285,280],[290,345],[255,430],[225,365]], [[455,135],[515,105],[545,160],[590,220],[550,330],[505,310],[475,230]], [[540,115],[640,75],[800,95],[865,175],[780,230],[695,180],[650,250],[605,190]], [[815,330],[895,320],[935,375],[845,400]], [[305,50],[350,40],[365,100],[325,125]] ];
        ctx.fillStyle = '#72997a';
        for (const land of lands) { ctx.beginPath(); land.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = '#d8e8e6'; ctx.fillRect(0,0,1024,20); ctx.fillRect(0,482,1024,30);
        for (let i = 0; i < 85; i++) {
            ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2 + random() * 7;
            const x = random()*1024, y = random()*512;
            ctx.beginPath(); ctx.ellipse(x,y,20+random()*70,3+random()*8,-0.25,0,Math.PI); ctx.stroke();
        }
    } else {
        for (let i = 0; i < 500; i++) {
            const x=random()*1024, y=random()*512, r=1+random()*12;
            ctx.fillStyle = kind === 'mars' ? 'rgba(75,36,23,.16)' : 'rgba(20,22,27,.18)';
            ctx.beginPath(); ctx.ellipse(x,y,r*1.4,r,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='rgba(255,230,208,.12)'; ctx.lineWidth=1; ctx.stroke();
        }
        if (kind === 'mars') { ctx.fillStyle='#ddd3c2'; ctx.fillRect(0,0,1024,14); }
    }
    ctx.globalAlpha = 1;
    for (let i=0;i<14000;i++) {
        ctx.fillStyle=random()>.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.045)';
        ctx.fillRect(random()*1024,random()*512,2,2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    return texture;
};
