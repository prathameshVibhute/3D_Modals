import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface SIZE {
  width: number,
  height: number
}

const canvas: HTMLElement | null = document.getElementById('three-js');
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({canvas} as any);
const scene: THREE.Scene = new THREE.Scene();

const gltfLoader: GLTFLoader = new GLTFLoader();

// Duck
const defaultPath: string = "/models/Duck/glTF/Duck.gltf";          // GLTF Default
const binaryPath: string = "/models/Duck/glTF-Binary/Duck.glb";     // GLTF Binary
const dracoPath: string = "/models/Duck/glTF-Draco/Duck.gltf";      // GLTF Draco
const embeddedPath: string = "/models/Duck/glTF/Duck.gltf";         // GLTF embedded

// Flight helmet
const defaultPathFlightHelmet: string = "/models/FlightHelmet/glTF/FlightHelmet.gltf";          // GLTF Default
const binaryPathFlightHelmet: string = "/models/FlightHelmet/glTF-Binary/FlightHelmet.glb";     // GLTF Binary
const dracoPathFlightHelmet: string = "/models/FlightHelmet/glTF-Draco/FlightHelmet.gltf";      // GLTF Draco
const embeddedPathFlightHelmet: string = "/models/FlightHelmet/glTF/FlightHelmet.gltf";         // GLTF embedded

// Fox
const defaultPathFox: string = "/models/Fox/glTF/Fox.gltf";          // GLTF Default
const binaryPathFox: string = "/models/Fox/glTF-Binary/Fox.glb";     // GLTF Binary
const dracoPathFox: string = "/models/Fox/glTF-Draco/Fox.gltf";      // GLTF Draco
const embeddedPathFox: string = "/models/Fox/glTF/Fox.gltf";         // GLTF embedded

let mixer: any = null;

gltfLoader.load(defaultPathFox,
(gltf: any) => {
  gltf.scene.scale.set(0.02,0.02,0.02);
  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[2]);
  console.log(typeof action, action);
  action.play();
},() => {
  console.log("Load");
},() => {
  console.log("Load");
});

function getSize(): SIZE {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(5,5);
const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
const plane: THREE.Mesh = new THREE.Mesh(geometry,material);
scene.add(plane)

plane.rotation.x = Math.PI * 0.5;

// Lights
const ambientLight: THREE.AmbientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight();
scene.add(directionalLight);

// Camera
let size: SIZE = getSize();
const fieldOfView: number = 45;
const aspectRatio: number = size.width / size.height;
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio);
camera.position.z = 10;
camera.position.y = 8;
scene.add(camera);

// Controls
const controls: OrbitControls = new OrbitControls(camera,canvas);
controls.enableDamping = true;

window.addEventListener('resize',() => {
  size = getSize();
  camera.aspect = size.width / size.height;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.width,size.height);
  renderer.render(scene,camera);
});

renderer.setAnimationLoop(animation);

const clock = new THREE.Clock();
let previousTime = 0;

// Renderer
renderer.setSize(size.width,size.height);
renderer.render(scene,camera);

function animation() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  controls.update();
  if(mixer) {
    mixer.update(deltaTime);
  }
  renderer.render(scene,camera);
}