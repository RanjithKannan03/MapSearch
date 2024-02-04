import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import BookData from './Data.json'

import * as CANNON from 'cannon-es';


import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import {land} from '../library/buildings/land.js'

import { createStructure } from '../library/buildings/normal.js';



import {helicam} from '../library/camera/Coc.js'


import { Vec3 } from 'cannon-es';

import {createCar} from '../library/utils/Car.js'

import { load } from '../library/utils/loader.js';
import { naturalEffect } from '../library/light/natural.js';

import SearchBar from './SearchBar.jsx';
import { Paper, Typography } from '@mui/material';



const MapSearch = () => {
  const containerRef = useRef(null);
  const [mobile , isMobile] = useState(false);
  const objArr = [];
  var originalColors = new Map();
  const searchBuilding = (value)=>{
    for(const buildings of objArr){
        if(buildings.name === value){
          buildings.mesh.material.color.set(0xff0000)
        }
    }
  }
  const clear = ()=>{
  for(const obj of objArr){
    
    obj.mesh.material.color.set(originalColors.get(obj.mesh))
  }
}
  let scene,camera ,renderer;

  useEffect(() => {

    
    scene = new THREE.Scene();
    if(window.innerWidth < 768)
      isMobile(true)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    var drivingMode = false


const map = new Map();
const map2 = new Map();


// const loader = new GLTFLoader();


var a = load('/static/carUpdated.glb')
a.scale.set(0.9,0.9,0.9)
var bridge = load('bridge3.glb')
var tree = load('/static/tree.glb')
var hostelEntrance = load('/static/hostel.glb')
var pedestal = load('/static/pedestal1.glb')
var arc = load('/static/archblend.glb')

const staticObjects = [];

const raycaster = new THREE.Raycaster()
let currentIntersect = null
const rayDirection = new THREE.Vector3(10,0,0)
rayDirection.normalize();




    scene.add(bridge) 
    bridge.scale.set(0.7,0.7,0.7)

    scene.add(arc)
    arc.rotation.y = Math.PI



    arc.position.set(7.661,0.725,-17.917)

    scene.add(hostelEntrance)
    hostelEntrance.scale.set(0.1,0.1,0.1)
    scene.add(pedestal)

    hostelEntrance.position.set(-241.99,0,28.959)
    
    hostelEntrance.scale.set(0.23,0.23,0.23)

    bridge.position.set(-25.815,0.614,2.471)
    
    scene.add(a)

    a.position.set(10,10,10)
 
   
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const floor = land(2000,2000)
    
    scene.add(floor)



    const visiblity = new THREE.AmbientLight(0xffffff,1);
    scene.add(visiblity)
  
    const light = naturalEffect()

    scene.add(light)
   
    


    
    light.castShadow = true
  
    
    
    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const cmaterial = new CANNON.Material('default');
const Cmaterial = new CANNON.ContactMaterial(
    cmaterial,
    cmaterial,
    {
        friction:0.5,
        restitution:0.2
    }
)
physicsWorld.addContactMaterial = Cmaterial
physicsWorld.defaultContactMaterial = Cmaterial

    
  

    const canvas = document.querySelector('canvas');


   
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
     
      shape: new CANNON.Plane(),
    });

    
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    
    
    physicsWorld.addBody(groundBody);




   
    const vehicle = createCar(physicsWorld,cmaterial)
   
    const obj = {}
    


    

    obj.params = {}
    obj.params.l = 1
    obj.params.b = 1
    obj.params.h = 1
    obj.params.color = 0xffffff
    

    

    obj.params.name = ""
    obj.params.roomName = ""
    obj.params.querry = ""
    
   

    
    


    const config = {}
    config.canvas = canvas
    config.sizes = sizes
    
    

    renderer.setSize(config.sizes.width, config.sizes.height)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000)
    renderer.physicallyCorrectLights = true
    
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 3

    
    
    const camera = new helicam()
    scene.add(camera)
    camera.position.set(-10,40,-60)

    
    
    
    window.addEventListener('resize', () =>
    {
      if(window.innerWidth < 768)
        isMobile(true);
      else
        isMobile(false);
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      
      
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    
    let volume = 0
    var offset = 0.5
   
    document.addEventListener('keydown', (event) => {
      
      const maxSteerVal = Math.PI / 4;
      const maxForce = 110;
      let boost = 2;
      var movingF = false
      
      switch (event.key) {
    
        case 'w':
          if(event.shiftKey == true && drivingMode)
          {
            if(offset < 6)
              offset += 0.1
            
             break;
          }
          else if(drivingMode)
          {
           
            vehicle.vehicle.setWheelForce(maxForce, 2);
            vehicle.vehicle.setWheelForce(maxForce, 3);
            
            movingF = true
            
            
            break;
          }
          break;

        case 's':

            if(event.shiftKey == true && drivingMode)
            {
              if(offset > 0.5)
              offset -= 0.1
            
             break;
            }
            else if(drivingMode)
            {
              vehicle.vehicle.setWheelForce(-maxForce, 2);
              vehicle.vehicle.setWheelForce(-maxForce, 3);
              if(volume < 1){
                volume  = volume + 0.1
              }
            
              break;
            }
            break;

        case 'a':

          if(drivingMode){
          vehicle.vehicle.setSteeringValue(maxSteerVal, 0);
          vehicle.vehicle.setSteeringValue(maxSteerVal, 1);
          break;
          }
          break;

        case 'd':

          if(drivingMode){
          vehicle.vehicle.setSteeringValue(-maxSteerVal, 0);
          vehicle.vehicle.setSteeringValue(-maxSteerVal, 1);
          break;
          }
          break;
          

        case ',':
          {
            if(drivingMode)
            {
              drivingMode = false
              shut.play()
          
              break;
            }
            drivingMode = true
            ignition.play()
            sound.play()
            
            break;
          }break;

          case 'g':
            {if(drivingMode)
                horn.play();
            }
        
      }
      
      
      
      
    });

   
    document.addEventListener('keyup', (event) => {
      
      switch (event.key) {
        case 'w':

          vehicle.vehicle.setWheelForce(0, 2);
          vehicle.vehicle.setWheelForce(0, 3);
          break;

        case 's':

          vehicle.vehicle.setWheelForce(0, 2);
          vehicle.vehicle.setWheelForce(0, 3);
          
          break;

        case 'a':

          vehicle.vehicle.setSteeringValue(0, 0);
          vehicle.vehicle.setSteeringValue(0, 1);
          break;

        case 'd':

          vehicle.vehicle.setSteeringValue(0, 0);
          vehicle.vehicle.setSteeringValue(0, 1);
          break;
      }
    });


    const control = new MapControls(camera,renderer.domElement);
    control.enableZoom = true
    control.panSpeed = 1
    // control.minDistance = 10

    
    control.maxPolarAngle = Math.PI * 0.4

    const eblock = createStructure(16,8,9,'eBlock')
    eblock.mesh.position.set(-0.558,4,11.641)
    eblock.body.position.set(-0.558,4,11.641)

    const iblock = createStructure(7, 28, 8, 'iBlock');
  iblock.body.position.set(40, 10, -20)
objArr.push(iblock)


const dblock = createStructure(3, 7.5, 3, 'dBlock');
dblock.body.position.set(10, 10, -25.9)
objArr.push(dblock)

const d2block = createStructure(3, 6.5, 3, 'dBlock');
d2block.body.position.set(10, 10, -14.7)
objArr.push(d2block)

const ablock = createStructure(10, 14, 8, 'aBlock');
ablock.body.position.set(15, 10, -55)
objArr.push(ablock)

const nblock = createStructure(10, 14, 8, 'nBlock');
nblock.body.position.set(2, 10, -55)
objArr.push(nblock)

const bblock = createStructure(10, 14, 8, 'bBlock');
bblock.body.position.set(45, 10, -55)
objArr.push(bblock)

const rroom = createStructure(5, 5, 5, 'bBlock');
rroom.body.position.set(35, 10, -51)
objArr.push(rroom)



scene.add(tree)

    

    objArr.push(eblock);
    

    
    const fblock = createStructure(7,14,8,'fBlock');
    fblock.body.position.set(16.066,10,3)
    objArr.push(fblock)
    
    const behindg = createStructure(9,6,4,'tBlock');
    behindg.body.position.set(20.093,1.0,16.651)
    objArr.push(behindg)
    // behindg.body.position.set()

    const jblock = createStructure(9,6,9,'jBlock')
    jblock.body.position.set(18.372,10,25.256)
    objArr.push(jblock)

    const eblockext = createStructure(16,8,13,'kBlock');
    eblockext.body.position.set(-0.558,20,21)
    objArr.push(eblockext)
    const mblock = createStructure(16,8,13,'mBlock');
    mblock.body.position.set(-0.558,20,30)
    objArr.push(mblock)

    // const gblockb = createStructure(7,8,4);
    const gblock = createStructure(14,7,8.8,'gBlock')
    gblock.body.position.set(14.936,10,-7.434)
    objArr.push(gblock)

    const yblock = createStructure(20,7,8,'yBlock')
    yblock.body.position.set(18.377,20,-33.246)
    objArr.push(yblock);

    for(const obj of objArr){
      originalColors.set(obj.mesh,obj.color)
    }
    
  
    const listener = new THREE.AudioListener();
  camera.add( listener );

const sound = new THREE.Audio( listener );


    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '/static/idle.wav', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 0.1);
      
    });
    const ignition = new THREE.Audio(listener)
    audioLoader.load('/static/startup.mp3',function(buffer){
      ignition.setBuffer(buffer)
      ignition.setLoop(false);
      ignition.setVolume(0.1)
    })

    const shut = new THREE.Audio(listener)
    audioLoader.load('/static/reveal-1.wav',function(buffer){
      shut.setBuffer(buffer)
      shut.setLoop(false)
      shut.setVolume(0.2)
    })

    const horn = new THREE.Audio(listener)
    audioLoader.load('/static/horn.mp3',(buffer)=>{
      horn.setBuffer(buffer)
      horn.setPlaybackRate(1.25)
      horn.setVolume(0.6)
    })

    const hitSound = new Audio('/static/car-hit-1.mp3')



    const playHitSound = (collision) =>
  {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()


        if(impactStrength > 0.5){        
          hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
        }
    
  }

  vehicle.carBody.addEventListener('collide',playHitSound)


    for(let i = 0;i<objArr.length;i++){
      scene.add(objArr[i].mesh);
      physicsWorld.addBody(objArr[i].body)
    }
    var prevTime = 0;
    const clock = new THREE.Clock();
    

    const mouse = new THREE.Vector2()
let prevIntersect = null;
window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))
    renderer.render(scene,camera);

    window.addEventListener('click', () =>
{
  
    if(currentIntersect)
    {
   
        prevIntersect = currentIntersect.object
        
        // panelReset(currentIntersect.object)
    }

    if(prevIntersect){
        console.log(prevIntersect.name)
    }
})

var onFocus = null;



obj.add = ()=>{
  addNames()
}


const addNames = ()=>{

    if(prevIntersect != null){
       for(const obje of objArr){
          if(obje.mesh === prevIntersect){
              if(!present(obje.roomName,obj.params.roomName)){
                obje.roomName.push(obj.params.roomName)
                
              }else{
                continue;
              }
          }
          }
       }
    }



const present = (arr,name)=>{
  for(const names of arr){
    if(names === name){
      return true;
    }
  }

  return false;
}


    const bridgeShape = new CANNON.Box(new CANNON.Vec3(17.5,3,4))
    const bridgeBody = new CANNON.Body({
      shape:bridgeShape,
      mass:0,
      position: new CANNON.Vec3(-22.5,0,0)
    })

    physicsWorld.addBody(bridgeBody)


    
    pedestal.rotation.z = Math.PI
    
    pedestal.position.set(-11.914,0.728,-23.116)


    const pedestalBody = new CANNON.Body({
      shape:new CANNON.Box(new CANNON.Vec3(3,3,3)),
      mass:0,
      position:new Vec3(0,0,0)
    })

    console.log(pedestal.position)
   
    pedestalBody.position.x = pedestal.position.x + 5
    pedestalBody.position.y = pedestal.position.y
    pedestalBody.position.z = pedestal.position.z
    
    physicsWorld.addBody(pedestalBody)

  

   
    

    const animate = () => {
      raycaster.setFromCamera(mouse,camera);
      const objectsToTest = []
      for(const objects of objArr){
        objectsToTest.push(objects.mesh)
      }
      // cannonDebugger.update()
      

      const intersects = raycaster.intersectObjects(objectsToTest)
      if(intersects.length)
      {
          currentIntersect = intersects[0]
      }
      else
      {
          currentIntersect = null
      }

      
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - prevTime;
      prevTime = elapsedTime;

      physicsWorld.step(1/60,deltaTime,3)
      eblock.mesh.position.copy(eblock.body.position)
   
      for( const obj of objArr){
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion)
        map.set(obj.mesh,obj.name)
        map2.set(obj.mesh,obj.body)
       
      }
      for(const obj of staticObjects){
        obj.mesh.position.copy(obj.body.position)
      }
     
      a.position.x = vehicle.carBody.position.x
      a.position.z = vehicle.carBody.position.z
      a.position.y = offset+Math.abs(Math.sin(elapsedTime))
      a.quaternion.copy(vehicle.carBody.quaternion)

      
      
      if(drivingMode)
      {
      
      control.enabled = false
      camera.rotation.set(-2.553,-0.2705,-2.96)
      camera.position.y = 20
      camera.position.x = vehicle.carBody.position.x - 10
      camera.position.z = vehicle.carBody.position.z - 30
      


      
      }else{
        control.enabled = true
        sound.pause()
      }
      
      renderer.render(scene,camera);
     
      window.requestAnimationFrame(animate);

    };
    animate();

    // Clean up function
    return () => {
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <React.Fragment>
    
      
        <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
    <Paper style={{ margin: '20px', padding: '20px', borderRadius:'10px' }}>
      <Typography variant="h4">PSG College of Technology</Typography>
      <Typography variant="body1">
        pinch to zoom out
      {!mobile &&
        "press ',' to start the vehicle , a, s, d, f to move"
}
      </Typography>
    </Paper>
  

    
    <SearchBar placeholder={'search for event'} data = {BookData} selected ={searchBuilding} clear={clear} />
    </React.Fragment>
};

export default MapSearch;
