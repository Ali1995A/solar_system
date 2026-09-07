const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach(script => new vm.Script(script));
new vm.Script(fs.readFileSync(path.join(root, 'surfaces.js'), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'unique HTML IDs');
for (const match of html.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)) assert(ids.includes(match[1]), `missing ${match[1]}`);
const main = scripts.find(s => s.includes('const planetData'));
const data = main.slice(main.indexOf('const planetData'), main.indexOf('const scene'));
const context = vm.createContext({window:{THREE:{}}, THREE:{OrbitControls:true}});
vm.runInContext(data, context);
const planets = vm.runInContext('planetData', context);
assert.equal(planets.length, 8);
assert.deepEqual(Array.from(planets.filter(p => Math.cos(p.tilt * Math.PI / 180) < 0), p => p.id), ['venus', 'uranus']);
const animate = main.slice(main.indexOf('function animate()'), main.indexOf('window.addEventListener("resize"'));
function simulate(frames, dt, paused = false, hidden = false) {
    const groups = planets.map(p => ({group:{userData:{angle:0,speed:2*Math.PI/p.orbitalPeriod,moonOrbit:p.id==='earth'?{userData:{angle:0},rotation:{y:0}}:null}},pivot:{position:{}},mesh:{rotation:{y:0},userData:p},distance:100}));
    const c = vm.createContext({requestAnimationFrame(){}, clock:{getDelta:()=>dt}, document:{hidden,getElementById:()=>({textContent:''})},getAppliedSpeed:()=>1,isPaused:paused,elapsedDays:0,DAYS_PER_SECOND:1,orbitGroups:groups,moonData:{orbitalPeriod:27.3},updateFocus(){},controls:{update(){}},renderer:{render(){}},scene:{},camera:{}});
    vm.runInContext(animate, c);
    for (let i=0;i<frames;i++) vm.runInContext('animate()', c);
    return {groups,elapsed:c.elapsedDays};
}
const one = simulate(1,1), many = simulate(60,1/60);
for(let i=0;i<8;i++) {
    const g = one.groups[i];
    assert(g.pivot.position.z < 0, 'prograde orbit advances toward -Z from +X');
    assert(Math.abs(g.mesh.rotation.y-2*Math.PI/planets[i].rotationDays)<1e-10, 'sidereal rotation rate');
    assert(Math.abs(g.group.userData.angle-many.groups[i].group.userData.angle)<1e-10,'frame-rate independent orbit');
}
assert.equal(simulate(2,1,true).elapsed,0,'pause freezes simulated time');
assert.equal(simulate(2,1,false,true).elapsed,0,'hidden page freezes time');
assert(Math.abs(one.groups[2].group.userData.moonOrbit.rotation.y-2*Math.PI/27.3)<1e-10,'Moon period');
assert(main.includes('pivot.add(moonOrbit)') && !main.includes('mesh.add(moonOrbit)'), 'Moon independent of Earth spin');
assert(main.includes('ring.rotation.x = Math.PI / 2;'), 'Saturn rings in equatorial plane');
console.log('PASS: script syntax, DOM references, 8-planet direction/rotation rates, frame independence, pause/hidden time, Moon period and hierarchy, Saturn ring plane. Browser rendering not tested.');
