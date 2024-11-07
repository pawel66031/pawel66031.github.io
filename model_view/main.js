import * as THREE from 'three';
import {Wall_VertexShader, Wall_FragmentShader} from '/model_view/Scene_Shader.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var _APP = null;
const DPR = 0.75;

class ParticleSystem {
    constructor(params) {
        const uniforms = {
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
            }
        };
    }
}
    
class Scene_RoomWithBalls {
    constructor() {
        // this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._Initialize();
    }

    _ScenePreparer() {
        this._RAF();
    }

    _Initialize() {
        this._processLoad = [];
        this._target = null;

        this.clock = new THREE.Clock();

        this._render = new THREE.WebGLRenderer({
            antialias: true,
            precision: "lowp",
        });
        this._render.setPixelRatio(window.devicePixelRatio);
        this._render.setSize(window.innerWidth, window.innerHeight);
        this._render.setClearColor(new THREE.Color(0.2, 0.5, 0.2));

        this._UpdateRenderTarget();
        this._depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, THREE.FloatType);

        document.body.appendChild(this._render.domElement);

        this._requestProjectionMatrixUpdate = false;

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);


        this._scene = new THREE.Scene();

        this.light = new THREE.PointLight();
        this._scene.add(this.light);

        const loader = new GLTFLoader();

        this._processLoad.push(loader);
        loader.load('/assets/3d/door_scene.glb',
            (gltf) => {
                const model = gltf.scene;

                this._camera = gltf.cameras[0];
                this._animations = gltf.animations;


                // Register door Material
                const Door = gltf.scenes[0].children[0];
                Door.material = new THREE.ShaderMaterial();


                // Register door animation
                this._CubeMixer = new THREE.AnimationMixer(gltf.scenes[0].children[0]);
                const CubeAction = this._CubeMixer.clipAction(gltf.animations[0]);
                CubeAction.clampWhenFinished = true;
                CubeAction.setLoop(THREE.LoopOnce);
                CubeAction.play();


                // Camera animation
                this._CameraMixer = new THREE.AnimationMixer(this._camera);
                const CameraAction = this._CameraMixer.clipAction(gltf.animations[1]);
                CameraAction.clampWhenFinished = true;
                CameraAction.setLoop(THREE.LoopOnce).play();
                
                // this._camera.far = 5.0;

                // Set custom shader for wall
                // this._wallMaterial = new THREE.ShaderMaterial({
                //     uniforms: {
                //         u_depthTexture: { value: null },
                //         u_resolution: { value: new THREE.Vector2(window.innerWidth * DPR, window.innerHeight * DPR) },
                //         cameraWorldMatrix: { value: this._camera.matrixWorld },
                //         cameraProjectionMatrixInverse: { value: this._camera.projectionMatrixInverse.clone() }
                //     },
                //         vertexShader: Wall_VertexShader,
                //         fragmentShader: Wall_FragmentShader,
                // });

                // Wall object
                const Wall = gltf.scenes[0].children[2];
                // Wall.material = this._wallMaterial;
                
                this._scene.add(model);
                this._OnWindowResize();


                this._processLoad.splice(this._processLoad.indexOf(loader), 1);
                this._ScenePreparer();
            }
        );

        this._previousRAF = null;
        // this._RAF();
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._requestProjectionMatrixUpdate = true;
        this._camera.updateProjectionMatrix();

        // this._wallMaterial.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth * DPR, window.innerHeight * DPR);
    }
    
    _RAF() {

        // Scene updater
        requestAnimationFrame((t) => {
            const delta = this.clock.getDelta();
            
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }
            
            
            if (this._requestProjectionMatrixUpdate === true) {
                const dpr = this._render.getPixelRatio();
                this._target.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
                this._render.setSize(window.innerWidth, window.innerHeight);
            }

            this._CubeMixer.update(delta);
            this._CameraMixer.update(delta);

            // this._render.setRenderTarget(this._target);
            this._render.render(this._scene, this._camera);

            // this._wallMaterial.uniforms.u_depthTexture.value = this._target.depthTexture;
            
            // this._wallMaterial.uniforms.cameraWorldMatrix.value = this._camera.matrixWorld;


            // this._Update(t - this._previousRAF);
            this._previousRAF = t;
            
            // this._camera.rotateX(this._camera.rotation.x + 1.0);
            this._UpdateRenderTarget();
            this._RAF();
            // console.log("Loop");
        })
    }

    _UpdateRenderTarget() {
        if (this._target) this._target.dispose();

        const dpr = this._render.getPixelRatio();
        // const dpr = 1.0;
        
        this._target = new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr);
        this._target.texture.minFilter = THREE.NearestFilter;
        this._target.texture.magFilter = THREE.NearestFilter;
        this._target.stencilBuffer = false;
        this._target.samples = 0;

        // Depth Texture
        this._target.depthTexture = new THREE.DepthTexture();
        // this._target.depthTexture.format = THREE.DepthFormat;
        this._target.depthTexture.type = THREE.UnsignedShortType;
    }
}

// let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    // _APP = new MainPageDemo(); 
    _APP = new Scene_RoomWithBalls();
});