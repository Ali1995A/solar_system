// Uses the existing bundled @napi-rs/canvas; never installs dependencies.
const {createCanvas} = require('@napi-rs/canvas');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const context={window:{},document:{createElement:()=>createCanvas(1,1)},THREE:{CanvasTexture:class {constructor(image){this.image=image;}},sRGBEncoding:3001}};
new Function('window','document','THREE',fs.readFileSync(path.join(__dirname,'../surfaces.js'),'utf8'))(context.window,context.document,context.THREE);
const bodies=[['sun',0xffb638],['mercury',0x8b8b8b],['venus',0xe7c57f],['earth',0x3f78d1],['mars',0xc55a2a],['jupiter',0xd1b178],['saturn',0xe6c894],['uranus',0xa8d6d8],['neptune',0x4a63d8],['moon',0xc7c7c7]];
const sheet=createCanvas(1200,590),ctx=sheet.getContext('2d');ctx.fillStyle='#09121d';ctx.fillRect(0,0,1200,590);
ctx.fillStyle='#cfb68c';ctx.font='18px sans-serif';ctx.fillText('PROCEDURAL MATERIAL STUDIES / CPU preview, not WebGL verification',24,30);
for(const [index,[name,base]] of bodies.entries()) {
    const t=context.window.makeSurface(name,base),c=t.image;
    assert.equal(c.width,1024);assert.equal(c.height,512);assert(t.userData.bumpMap && t.userData.roughnessMap);
    const pixels=c.getContext('2d').getImageData(0,0,1024,512).data;
    const range=new Set();for(let i=0;i<pixels.length;i+=400)range.add(pixels[i]+pixels[i+1]+pixels[i+2]);assert(range.size>12,`${name} color variation`);
    if(name==='earth') {
        const a=t.userData.cloudMap.image.getContext('2d').getImageData(0,0,1024,512).data;
        let min=255,max=0;for(let i=3;i<a.length;i+=4){min=Math.min(min,a[i]);max=Math.max(max,a[i]);}
        assert(min===0 && max>150,'clouds must have clear and opaque regions');
    }
    const cloudPixels=t.userData.cloudMap?.image.getContext('2d').getImageData(0,0,1024,512).data;
    const size=190,r=90,img=ctx.createImageData(size,size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
        const nx=(x-size/2)/r,ny=(size/2-y)/r;if(nx*nx+ny*ny>1)continue;
        const nz=Math.sqrt(1-nx*nx-ny*ny),u=(.58+Math.atan2(nx,nz)/(2*Math.PI))%1,v=Math.acos(ny)/Math.PI;
        const src=(Math.min(511,Math.floor(v*512))*1024+Math.floor(u*1024))*4,dst=(y*size+x)*4;
        const light=name==='sun'?1:.18+.85*Math.max(0,nx*-.5+ny*.28+nz*.82);
        for(let k=0;k<3;k++) {const alpha=cloudPixels?cloudPixels[src+3]/255:0;img.data[dst+k]=(pixels[src+k]*(1-alpha)+242*alpha)*light;}img.data[dst+3]=255;
    }
    const ox=(index%5)*240+25,oy=Math.floor(index/5)*260+55,stamp=createCanvas(size,size);stamp.getContext('2d').putImageData(img,0,0);ctx.drawImage(stamp,ox,oy);
    ctx.fillStyle='#e7e0d4';ctx.font='15px sans-serif';ctx.fillText(name.toUpperCase(),ox+45,oy+214);
}
const ring=context.window.makeRingTexture().image.getContext('2d').getImageData(0,0,1024,1).data;
assert(ring[600*4+3]<10 && ring[450*4+3]>100,'ring gap alpha');
const corona=context.window.makeCoronaTexture().image.getContext('2d').getImageData(0,0,256,256).data;
assert.equal(corona[(128*256+128)*4+3],0,'corona does not wash out the solar center');
if(process.argv[2])fs.writeFileSync(process.argv[2],sheet.toBuffer('image/png'));
console.log('PASS: all ten texture generators, material maps, cloud alpha range, ring gap, transparent corona center.');
