import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const root = document.getElementById('pet3dRoot');
const stateNode = document.getElementById('petArt');
const animalSelect = document.getElementById('animal');
const outfitSelect = document.getElementById('outfitSelect');
if (!root || !stateNode) throw new Error('Área 3D do Amor Pet não encontrada.');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 1.2, 7.8);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff4fa, 0x8191a4, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-3, 6, 5); key.castShadow=true; scene.add(key);
const fill = new THREE.PointLight(0xffa7cf, 1.2, 12); fill.position.set(3, 2, 3); scene.add(fill);

const mat=(color,roughness=.72,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const materials={fur:mat('#f5bdce'),fur2:mat('#ffe0e9'),muzzle:mat('#fff1f4'),dark:mat('#49313f'),eye:mat('#211927',.28),white:mat('#ffffff',.25),nose:mat('#7c4a60'),pink:mat('#ff8fb0'),shirt:mat('#ff7ea4'),hat:mat('#a59af7'),cape:mat('#8c7bea'),gold:mat('#ffce71',.35,.2),glasses:mat('#352d42',.3,.35),food:mat('#f66b83'),leaf:mat('#65b980'),bowl:mat('#f7a9c2',.3,.12)};
const pet = new THREE.Group(); scene.add(pet); pet.position.y=-.38;
const bodyGroup=new THREE.Group(); pet.add(bodyGroup);
const sphere=new THREE.SphereGeometry(1,32,24);
function ball(parent, material, pos, scale, name=''){const m=new THREE.Mesh(sphere,material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;if(name)m.name=name;parent.add(m);return m;}
function box(parent, material, pos, scale, radius=.06){const geo=new THREE.BoxGeometry(...scale);const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.castShadow=true;parent.add(m);return m;}
function tube(parent, points, material, radius=.035){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,20,radius,8,false),material);parent.add(m);return m;}

// Cute rounded body and head; all facial elements are actual 3D meshes.
const body=ball(bodyGroup,materials.fur,[0,.3,0],[.78,.9,.57],'body');
const headPivot=new THREE.Group();headPivot.position.set(0,1.18,.05);bodyGroup.add(headPivot);
const head=ball(headPivot,materials.fur,[0,.12,0],[.88,.78,.69],'head');
const muzzle=ball(headPivot,materials.muzzle,[0,-.12,.56],[.39,.25,.22],'muzzle');
const nose=ball(headPivot,materials.nose,[0,-.05,.765],[.105,.075,.06],'nose');
const eyeL=ball(headPivot,materials.eye,[-.31,.23,.61],[.105,.145,.055],'eyeL');
const eyeR=ball(headPivot,materials.eye,[.31,.23,.61],[.105,.145,.055],'eyeR');
const glintL=ball(headPivot,materials.white,[-.34,.285,.662],[.032,.04,.02]);
const glintR=ball(headPivot,materials.white,[.28,.285,.662],[.032,.04,.02]);
const lidL=ball(headPivot,materials.fur2,[-.31,.25,.64],[.115,.012,.06],'lidL');
const lidR=ball(headPivot,materials.fur2,[.31,.25,.64],[.115,.012,.06],'lidR');
const mouth=new THREE.Group(); mouth.position.set(0,-.31,.71); headPivot.add(mouth);
tube(mouth,[[-.14,.025,0],[0,-.045,.012],[.14,.025,0]],materials.dark,.027);
const cheekL=ball(headPivot,mat('#ff9bb8'),[-.53,-.04,.53],[.13,.065,.025]);
const cheekR=ball(headPivot,mat('#ff9bb8'),[.53,-.04,.53],[.13,.065,.025]);
const ears=new THREE.Group();headPivot.add(ears);
const earL=ball(ears,materials.fur,[-.62,.72,-.01],[.23,.48,.2]);earL.rotation.z=.35;
const earR=ball(ears,materials.fur,[.62,.72,-.01],[.23,.48,.2]);earR.rotation.z=-.35;
const innerL=ball(ears,materials.pink,[-.62,.75,.16],[.11,.31,.045]);innerL.rotation.z=.35;
const innerR=ball(ears,materials.pink,[.62,.75,.16],[.11,.31,.045]);innerR.rotation.z=-.35;
const paws=[];for(const x of [-.48,.48]){const paw=ball(bodyGroup,materials.fur,[x,-.28,.32],[.24,.28,.28]);paws.push(paw);}
const feet=[];for(const x of [-.36,.36])feet.push(ball(bodyGroup,materials.fur2,[x,-.48,.28],[.25,.14,.28]));
const tail=ball(bodyGroup,materials.fur,[.73,.04,-.18],[.22,.28,.24]);tail.rotation.z=-.7;

// Clothing meshes fit around the torso rather than floating as emojis.
const clothes=new THREE.Group();bodyGroup.add(clothes);
const shirt=ball(clothes,materials.shirt,[0,.22,.02],[.795,.54,.585],'shirt');
const shirtCollar=ball(clothes,materials.white,[0,.66,.43],[.22,.10,.11]);
const cape= new THREE.Mesh(new THREE.ConeGeometry(.63,.9,4),materials.cape);cape.position.set(0,.18,-.43);cape.rotation.x=-.22;cape.castShadow=true;clothes.add(cape);
const hatBase=new THREE.Mesh(new THREE.CylinderGeometry(.46,.46,.1,32),materials.hat);hatBase.position.set(0,.9,.03);hatBase.castShadow=true;clothes.add(hatBase);
const hatTop=new THREE.Mesh(new THREE.ConeGeometry(.34,.52,32),materials.hat);hatTop.position.set(0,1.18,.03);hatTop.castShadow=true;clothes.add(hatTop);
const glasses=new THREE.Group();clothes.add(glasses);
const ringGeo=new THREE.TorusGeometry(.13,.025,8,24);
for(const x of [-.23,.23]){const ring=new THREE.Mesh(ringGeo,materials.glasses);ring.position.set(x,.26,.67);glasses.add(ring);ball(glasses,materials.glasses,[x,.26,.66],[.115,.115,.035]);}
box(glasses,materials.glasses,[0,.26,.68],[.22,.035,.035],.02);
const bow=new THREE.Group();clothes.add(bow);const bowL=ball(bow,materials.pink,[-.14,.72,.16],[.16,.12,.08]);bowL.rotation.z=.5;const bowR=ball(bow,materials.pink,[.14,.72,.16],[.16,.12,.08]);bowR.rotation.z=-.5;ball(bow,materials.gold,[0,.72,.23],[.07,.07,.04]);
shirt.visible=false;shirtCollar.visible=false;cape.visible=false;hatBase.visible=false;hatTop.visible=false;glasses.visible=false;bow.visible=false;

// Bowl and visible food appear during the eating action.
const bowlGroup=new THREE.Group();scene.add(bowlGroup);bowlGroup.position.set(1.15,-.92,.45);
const bowlMesh=new THREE.Mesh(new THREE.CylinderGeometry(.42,.3,.2,32,1,true),materials.bowl);bowlMesh.castShadow=true;bowlGroup.add(bowlMesh);
const bowlRim=new THREE.Mesh(new THREE.TorusGeometry(.36,.045,8,32),materials.white);bowlRim.rotation.x=Math.PI/2;bowlRim.position.y=.1;bowlGroup.add(bowlRim);
const foodPieces=new THREE.Group();bowlGroup.add(foodPieces);
for(let i=0;i<5;i++){const f=ball(foodPieces,i%2?materials.leaf:materials.food,[(Math.random()-.5)*.38,.08,(Math.random()-.5)*.28],[.11,.08,.09]);f.rotation.z=Math.random();}
bowlGroup.visible=false;
const floor=new THREE.Mesh(new THREE.CircleGeometry(2.3,48),new THREE.MeshStandardMaterial({color:'#a8d9a7',roughness:1,transparent:true,opacity:.75}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.02;floor.receiveShadow=true;scene.add(floor);
const shadow=new THREE.Mesh(new THREE.CircleGeometry(.85,32),new THREE.MeshBasicMaterial({color:'#557c67',transparent:true,opacity:.17}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-1.005,.05);shadow.scale.set(1.3,.55,1);scene.add(shadow);

let currentAnimal='cat', currentOutfit='none', currentMood='';
function refreshLook(){currentAnimal=animalSelect?.value||'cat';currentOutfit=outfitSelect?.value||'none';const animalColors={cat:'#f5bdce',dog:'#c9946d',bunny:'#fff0f3',fox:'#e98a5c',bear:'#a97965',penguin:'#34384c'};materials.fur.color.set(animalColors[currentAnimal]||'#f5bdce');materials.fur2.color.set(currentAnimal==='penguin'?'#f7f5fa':'#ffe0e9');
 ears.visible=currentAnimal!=='penguin';tail.visible=currentAnimal!=='penguin';
 if(currentAnimal==='bunny'){earL.scale.y=.75;earR.scale.y=.75;earL.position.y=.95;earR.position.y=.95;}else{earL.scale.y=currentAnimal==='cat'?.48:.34;earR.scale.y=currentAnimal==='cat'?.48:.34;earL.position.y=.72;earR.position.y=.72;}
 shirt.visible=currentOutfit==='shirt';shirtCollar.visible=currentOutfit==='shirt';cape.visible=currentOutfit==='cape';hatBase.visible=currentOutfit==='hat';hatTop.visible=currentOutfit==='hat';glasses.visible=currentOutfit==='glasses';bow.visible=currentOutfit==='bow';
}
function resize(){const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(root);resize();
const clock=new THREE.Clock();let blinkAt=2,blink=0,emotionTimer=0;
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();const classes=stateNode.classList;
 const sleeping=classes.contains('is-sleeping');const hungry=classes.contains('is-hungry');const sleepy=classes.contains('is-sleepy');const sad=classes.contains('is-sad');const happy=classes.contains('is-playing')||classes.contains('happy')||classes.contains('is-happy');const sharedEating=stateNode.dataset.lastAction==='eating' && Date.now()-Number(stateNode.dataset.lastActionAt||0)<10000;const eating=classes.contains('is-eating')||sharedEating;const refusing=classes.contains('is-refusing');
 if(animalSelect?.value!==currentAnimal||(outfitSelect?.value||'none')!==currentOutfit)refreshLook();
 const mood=[sleeping,hungry,sleepy,sad,happy,eating,refusing].join('|');if(mood!==currentMood){currentMood=mood;emotionTimer=t;}
 const targetLid=sleeping?1:(sleepy?.55:0);blinkAt-=clock.getDelta();if(blinkAt<=0&&!sleeping){blink=.9;blinkAt=2+Math.random()*3;}blink=Math.max(0,blink-.09);
 const lidY=Math.max(targetLid,blink);lidL.scale.y=.012+lidY*.14;lidR.scale.y=.012+lidY*.14;glintL.visible=glintR.visible=!sleeping&&lidY<.45;
 eyeL.scale.y=.145*(1-lidY*.65);eyeR.scale.y=.145*(1-lidY*.65);
 mouth.scale.y=(sleeping||sleepy)?.65:(eating?1.8:(happy?1.25:1));mouth.position.y=eating?-.34:-.31;
 cheekL.visible=cheekR.visible=happy||refusing;
 headPivot.rotation.x=sleeping?.18:(eating?.12:(sleepy?.08:0));headPivot.rotation.z=refusing?Math.sin(t*14)*.15:(sad?-.08:Math.sin(t*.9)*.025);
 const bob=sleeping?Math.sin(t*2)*.018:(happy?Math.abs(Math.sin(t*7))*.12:Math.sin(t*2.4)*.045);pet.position.y=-.38+bob;pet.rotation.y=Math.sin(t*.55)*.08+(refusing?Math.sin(t*14)*.12:0);tail.rotation.z=-.7+Math.sin(t*8)*(happy?.55:.12);paws.forEach((p,i)=>{p.rotation.x=happy?Math.sin(t*8+i)*.25:Math.sin(t*2+i)*.025;});
 bowlGroup.visible=eating; if(eating){const name=stateNode.dataset.foodName||'Morangos';const foodColors={'Morangos':'#ef4f72','Maçã':'#e54f58','Peixinho':'#e6a6b4','Cenoura':'#f28c39','Biscoitinho':'#c99361','Ração':'#916c55'};materials.food.color.set(foodColors[name]||'#ef4f72');bowlGroup.position.x=.88+Math.sin(t*8)*.04;headPivot.position.y=1.18+Math.sin(t*9)*.035;foodPieces.scale.setScalar(.9+Math.abs(Math.sin(t*10))*.12);}else{headPivot.position.y=1.18;}
 renderer.render(scene,camera);
}
refreshLook();animate();
