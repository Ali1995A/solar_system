/* Finite solar disk occultation in the illustrative scene, not an ephemeris. */
window.EclipseMath = {
    visibility(s, o, d) {
        if(d >= s+o) return 1;
        if(d <= Math.abs(s-o)) return o >= s ? 0 : 1-o*o/(s*s);
        const clamp=x=>Math.max(-1,Math.min(1,x));
        const area=s*s*Math.acos(clamp((d*d+s*s-o*o)/(2*d*s)))+o*o*Math.acos(clamp((d*d+o*o-s*s)/(2*d*o)))-.5*Math.sqrt(Math.max(0,(-d+s+o)*(d+s-o)*(d-s+o)*(d+s+o)));
        return Math.max(0,Math.min(1,1-area/(Math.PI*s*s)));
    },
    offset(type, progress, distance) {
        const angle=(type==='solar'?Math.PI:0)+(progress-.5)*1.4;
        return {angle,x:Math.cos(angle)*distance,z:-Math.sin(angle)*distance};
    }
};

window.createEclipseController = function({scene,camera,controls,earthEntry,moonMesh,sunMesh,getState,setState}) {
    const earth=earthEntry.mesh,moonOrbit=earthEntry.group.userData.moonOrbit,moonPivot=moonMesh.parent;
    const er=earth.userData.radius,mr=moonMesh.userData.radius,sr=sunMesh.userData.radius;
    const sunPosition=new THREE.Vector3(),earthPosition=new THREE.Vector3(),moonPosition=new THREE.Vector3();
    function shadow(target,occluder,radius,tint,scale) {
        const uniforms={sunPosition:{value:sunPosition},sunRadius:{value:sr},occluder:{value:occluder},occluderRadius:{value:radius},tint:{value:new THREE.Color(tint)}};
        const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
            vertexShader:`varying vec3 surfacePoint; varying vec3 surfaceNormal;
                void main(){vec4 p=modelMatrix*vec4(position,1.0);surfacePoint=p.xyz;surfaceNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*p;}`,
            fragmentShader:`uniform vec3 sunPosition;uniform float sunRadius;uniform vec3 occluder;uniform float occluderRadius;uniform vec3 tint;
                varying vec3 surfacePoint;varying vec3 surfaceNormal;
                float visibleDisk(float s,float o,float d){
                    if(d>=s+o)return 1.0;
                    if(d<=abs(s-o))return o>=s?0.0:1.0-o*o/(s*s);
                    float a=s*s*acos(clamp((d*d+s*s-o*o)/(2.0*d*s),-1.0,1.0));
                    float b=o*o*acos(clamp((d*d+o*o-s*s)/(2.0*d*o),-1.0,1.0));
                    float c=0.5*sqrt(max(0.0,(-d+s+o)*(d+s-o)*(d-s+o)*(d+s+o)));
                    return clamp(1.0-(a+b-c)/(3.14159265359*s*s),0.0,1.0);
                }
                void main(){
                    vec3 light=sunPosition-surfacePoint;vec3 block=occluder-surfacePoint;
                    float ds=length(light);float db=length(block);
                    if(db>=ds||dot(light,block)<=0.0){discard;}
                    float s=asin(clamp(sunRadius/ds,0.0,0.9999));float o=asin(clamp(occluderRadius/db,0.0,0.9999));
                    float d=acos(clamp(dot(normalize(light),normalize(block)),-1.0,1.0));
                    float coverage=1.0-visibleDisk(s,o,d);
                    float day=smoothstep(-0.02,0.15,dot(normalize(surfaceNormal),normalize(light)));
                    gl_FragColor=vec4(tint,coverage*day*0.94);
                }`
        });
        const shell=new THREE.Mesh(new THREE.SphereGeometry(target.userData.radius*scale,64,48),material);
        shell.renderOrder=3;target.add(shell);return shell;
    }
    shadow(earth,moonPosition,mr,0x010309,1.014);
    shadow(moonMesh,earthPosition,er,0x421207,1.003);
    const status=document.getElementById('eclipse-status'),progress=document.getElementById('eclipse-progress'),play=document.getElementById('eclipse-play');
    let mode=null,saved=null,running=false,t=.5;
    function applyPosition() {
        const p=EclipseMath.offset(mode,t,er*2.8);
        earthEntry.group.userData.angle=0;earthEntry.pivot.position.set(earthEntry.distance,0,0);
        moonOrbit.rotation.x=0;moonOrbit.rotation.y=p.angle;moonOrbit.userData.angle=p.angle;moonPivot.position.x=er*2.8;
        const stage=t<.3?'接近对齐':t>.7?'离开对齐':'食影经过';
        status.textContent=(mode==='solar'?'日食：太阳 → 月球 → 地球，观察地球上的本影与半影。':'月食：太阳 → 地球 → 月球，观察月面变暗；红色为大气折射的示意。')+` ${stage}。教学比例、位置和时长，非真实日期。`;
        progress.value=String(Math.round(t*100));
    }
    function start(type) {
        if(!saved) saved={app:getState(),angle:earthEntry.group.userData.angle,earthPosition:earthEntry.pivot.position.clone(),moonAngle:moonOrbit.userData.angle,moonTilt:moonOrbit.rotation.x,moonDistance:moonPivot.position.x,camera:camera.position.clone(),target:controls.target.clone()};
        mode=type;t=.5;running=false;setState({isPaused:true,focusTarget:''});
        document.getElementById('toggle').disabled=true;
        document.getElementById('eclipse-controls').hidden=false;
        document.getElementById('eclipse-exit').disabled=false;
        document.getElementById('info').classList.remove('active');
        for(const id of ['solar','lunar'])document.getElementById(`demo-${id}`).setAttribute('aria-pressed',String(type===id));
        play.textContent='播放过程';applyPosition();
        const center=new THREE.Vector3(earthEntry.distance,0,0);
        // Look toward the illuminated Earth for solar eclipses, toward the Moon for lunar eclipses.
        const target=type==='solar'?center:center.clone().add(new THREE.Vector3(er*2.8,0,0));
        controls.target.copy(target);
        camera.position.copy(target).add(new THREE.Vector3(-er*(type==='solar'?5:2),er*(type==='solar'?2:1.1),er*(type==='solar'?4:2.1)));
        controls.update();
    }
    function stop() {
        if(!saved)return;
        earthEntry.group.userData.angle=saved.angle;earthEntry.pivot.position.copy(saved.earthPosition);
        moonOrbit.userData.angle=saved.moonAngle;moonOrbit.rotation.y=saved.moonAngle;moonOrbit.rotation.x=saved.moonTilt;moonPivot.position.x=saved.moonDistance;
        camera.position.copy(saved.camera);controls.target.copy(saved.target);setState(saved.app);
        mode=null;saved=null;running=false;document.getElementById('toggle').disabled=false;
        document.getElementById('eclipse-controls').hidden=true;document.getElementById('eclipse-exit').disabled=true;
        for(const id of ['solar','lunar'])document.getElementById(`demo-${id}`).setAttribute('aria-pressed','false');
        status.textContent='选择演示，或在正常运行中观察食影。示意模型不预测实际日月食。';
    }
    document.getElementById('demo-solar').addEventListener('click',()=>start('solar'));
    document.getElementById('demo-lunar').addEventListener('click',()=>start('lunar'));
    document.getElementById('eclipse-exit').addEventListener('click',stop);
    progress.addEventListener('input',()=>{if(!mode)return;running=false;play.textContent='播放过程';t=Number(progress.value)/100;applyPosition();});
    play.addEventListener('click',()=>{if(!mode)return;running=!running;if(running)t=0;play.textContent=running?'暂停演示':'播放过程';});
    return {start,stop,update(dt){
        if(mode&&running){t=Math.min(1,t+dt/24);applyPosition();if(t===1){running=false;play.textContent='重播过程';}}
        scene.updateMatrixWorld(true);sunMesh.getWorldPosition(sunPosition);earth.getWorldPosition(earthPosition);moonMesh.getWorldPosition(moonPosition);
    }};
};
