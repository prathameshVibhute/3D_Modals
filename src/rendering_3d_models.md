## Rendering 3d Models using ThreeJs

### GLFT Format
GLTF stands for `Graphics library transmission format` is an open standard, royalty free file format design by the [Khronos Group](https://www.khronos.org/gltf/). 

GLTF supports different sets of data like `geometries`, `materials`, `cameras`, `lights`, `scene graphs`, `animations`, `skeletons`, `embed textures`.

GLTF has provided various models for [Github](https://github.com/KhronosGroup/glTF-Sample-Models/tree/main)

--- 

### 1] glTG Folder Default Format
A glTF folder has multiple file i.e .gltf file, .bin file and .png file. Each file has its own meaning.

#### a] .gltf file:
Its is a json file which contains data like camera, lights, scene, materials, objects transformation, no geometry and no texture.

#### b] .bin file:
This file contains binary format data like geometries (Vertices, position, UV coordinates, normal, color,  etc).

#### c] .png: 
This is the texture of the model.

When we load the gltf file it automatically loads all the file required to it like .bin and .png file. You can see it in .glft file where images property contains `.png` texture file name and buffer property `.bin` file name.

Use this file when you want to work on data like camera, lights, scene, materials, objects transformation.

---

### 2] glTF-Binary Format
This folder contains 1 file whose extension is .glb, its small in size and therefore easier to load. But it is hard to alter(edit) its data.

Use this file when you want your model to be low in size for better performances

### 3] glTFDraco
This folder also contain multiple file which are in binary. 

#### 4] glTF-Embedded
This folder contains 1 file whose extension is .gltf which is a json file, unlike we see on default flTF folder. But this file contains details of texture and buffer already present in it (Check the file once). As this file contain all the data it will be Heavier.

--- 

### Using GLTF Loader

Import GLTF loader form here `three/examples/jsm/loaders/GLTFLoader.js`, and we initialize the GLTF loader as shown below

```Typescript
const gltfLoader: GLTFLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF/Duck.gltf',
(gltf: any) => {
  console.log("Load",gltf);
  scene.add(gltf.scene.children[0]);
},() => {
  console.log("Load");
},() => {
  console.log("Load");
});
```

In above code you can see that i have added gltc.scene.children[0] to the scene. Which actually add the model to scene and then its visible

#### Loading different format gltf
```Typescript
// Fox
const defaultPath: string = "/models/Duck/glTF/Duck.gltf";          // GLTF Default
const binaryPath: string = "/models/Duck/glTF-Binary/Duck.glb";     // GLTF Binary
const dracoPath: string = "/models/Duck/glTF-Draco/Duck.gltf";      // GLTF Draco does not work
const embeddedPath: string = "/models/Duck/glTF/Duck.gltf";         // GLTF embedded
```

In above code you can see that we can access models from different folders like this expect the draco one.

#### Loading model which has multiple children in `gltf.scene.children`
Previously we loaded a duck which was containing only single mesh, but with larger and complex models the children array may contain multiple mesh and then loading them like `gltf.scene.children[0]` is not a proper way because it will render only specific mesh/part of the model

```Typescript
const gltfLoader: GLTFLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/FighterHelmet/FighterHelmet.gltf',
(gltf: any) => {
  scene.add(gltf.scene.children[0]);
});
```

Hence told a scene.children with multiple mesh we can use for loop as shown below
```Typescript
const gltfLoader: GLTFLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/FighterHelmet/FighterHelmet.gltf',
(gltf: any) => {
  gltf.scene.children.forEach((mesh: any) => {
    scene.add(mesh);
  });
});
```

We think that this will work but it does not. Because when ever we add the mesh in our scene it also gets remove from scene.children array and because of that our model is not completely renderer.

But there are 2 ways to show these big model, one by using destructuring operator in scene.add itself as show below (Here also the scene.children looses its value but it renders all the mesh in the scene) or but adding entire gltf.scene in our scene.

``` Typescript
const gltfLoader: GLTFLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/FighterHelmet/FighterHelmet.gltf',
(gltf: any) => {
  scene.add(...gltf.scene.children);          // Option 1
  scene.add(gltf.scene);                      // Option 2
});
```
---

### Loading Draco format
Draco folder file are usually less in size then default gltf folder, and we cannot load then directly using GLTFLoader. Hence to load a Draco folder gltf model we need to use `DracoLoader`.

We import the DRACO loader as shown below:
```Typescript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
```

---

### Animation playing
Playing animation on 3D model is quite interesting. Each gltf object contains `Animations` array which has list of `AnimationClip` object. `AnimationClip` is a Three-js class which contains model animation. To show animation of our model we use a class called `AnimationMixer`. 

```Typescript
mixer = new THREE.AnimationMixer(gltf.scene);
const action = mixer.clipAction(gltf.animations[2]);
action.play();
```

While creating object of AnimationMixer we pass the gltf model scene to it, then the object has multiple properties and function. For running the animation we call `clipAction(<AnimationClip Object>)`. This `clipAction` return a object of `AnimationAction`, this object also has multiple properties in which we have a `play()` which we can use to play our action.

**Note:** Using playing the video is not enough, we need to call update() on the mixer object which will update the frame after each render on the screen. This function accepts delta time which denotes the speed of the animation.