import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';


// import * as LYGIA from '../../resolve'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function getFile(url) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, false);
    httpRequest.send();
    if (httpRequest.status == 200)
        return httpRequest.responseText;
    else
        return "";
}

function resolveLygia(lines) {
    if (!Array.isArray(lines)) {
        lines = lines.split(/\r?\n/);
    }

    let src = "";
    lines.forEach((line, i) => {
        const line_trim = line.trim();
        if (line_trim.startsWith('#include \"lygia')) {
            let include_url = line_trim.substring(15);
            // include_url = "https://lygia.xyz" + include_url.replace(/\"|\;|\s/g, '');
            include_url = include_url.replace(/\"|\;|\s/g, "");
            src += getFile(include_url) + '\n';
        }
        else {
            src += line + '\n';
        }
    });

    return src;
}

async function resolveLygiaAsync(lines) {
    if (!Array.isArray(lines))
        lines = lines.split(/\r?\n/);

    let src = "";
    const response = await Promise.all(
        lines.map(async (line, i) => {
            const line_trim = line.trim();
            if (line_trim.startsWith('#include "lygia')) {
                let include_url = line_trim.substring(15);
                // include_url = "https://lygia.xyz" + include_url.replace(/\"|\;|\s/g, "");
                include_url = include_url.replace(/\"|\;|\s/g, "");
                return fetch(include_url).then((res) => res.text());
            }
            else
                return line;
        })
    );

    return response.join("\n");
}


function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}

function vmin(percent) {
    return Math.min(vh(percent), vw(percent));
}

function vmax(percent) {
    return Math.max(vh(percent), vw(percent));
}


// **************************************
    /*
    *   @param {HTMLCollection} divElement
    */
class ContourShader{
    constructor() {


    }
    
    GetPlaneMesh() {

        // #####  Vertex Shader  #####
        
        const vShader = resolveLygia(`
            uniform float u_time;
            uniform sampler2D noiseTexture;
        
            precision lowp float;

            
            varying vec4 vPos;
            varying vec2 u_uv;

            
            void main() {
                vPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                u_uv = uv;
 
                vPos.y -= texture2D(noiseTexture, fract(u_uv + u_time * 0.5)).y * 3.0;
                // vPos.y -= 3.0;
                // vPos.x += u_time ;
                gl_Position = vPos;
                }
            `);
        
        
        // #####  Fragment Shader  #####
            
            const fShader = resolveLygia(`
            uniform float u_time;
            uniform sampler2D noiseTexture;
            
            precision lowp float;
            
            const float offset = 0.0125;
            const float offset2 = 0.0125;

            const vec3 bgColor = vec3(0.902, 0.78, 0.404);

            varying vec4 vPos;
            varying vec2 u_uv;
            varying float noiseValue;
            // varying mat4 inverseProjectionMatrix;

            float when_eq(float x, float y) {
                return 1.0 - abs(sign(x - y));
            }

            float when_gt(float x, float y) {
                return max(sign(x - y), 0.0);
            }

            void main(){               
                vec3 heightMaps = texture2D(noiseTexture, u_uv).xyz;
                
                float lineMap = fract(heightMaps.x) * 6.0;
                float lineMap2 = fract(heightMaps.x) * 30.0;

                float stepNoise = max(
                    smoothstep(0.95, 1.0, fract( lineMap + offset )),
                    smoothstep(0.05, 0.0, fract( lineMap + offset )) );

                stepNoise += max(
                    smoothstep(0.95, 1.0, fract( lineMap2 + offset )),
                    smoothstep(0.05, 0.0, fract( lineMap2 + offset )) );

                float layerOffset = heightMaps.x - offset;


                // Add layers
                // float maskNoise = when_eq(stepNoise, stepNoise2);
                // maskNoise *= when_eq(stepNoise3, stepNoise4);

                // vec4 color = vec4(bgColor, 1.0 - maskNoise);
                vec4 color = vec4(bgColor, stepNoise);
                // vec4 color = vec4(vec3(stepNoise), 1.0);

                gl_FragColor = vec4( color );
        }
        `)


        // const fShader = `
        // uniform float u_time;
        //     uniform sampler2D noiseTexture;

        //     precision lowp float;

        //     varying vec4 vPos;
        //     varying vec2 u_uv;

        //     void main(){
        //         gl_FragColor = vec4(u_uv, 0.0, 1.0);
        // }
        // `

        
        const plane = new THREE.PlaneGeometry(8.0, 8.0, 64, 64);
        plane.rotateX(THREE.MathUtils.degToRad(-90.0));
        
        
        const noiseTextureLoader = new THREE.TextureLoader();
        const textureNoise = noiseTextureLoader.load("/assets/images/noise_contour_albedo.png");
        // textureNoise.

        const material = new THREE.ShaderMaterial({
            vertexShader: vShader,
            fragmentShader: fShader,
            uniforms: {
                u_time: { value: 0.0 },
                noiseTexture: { value: textureNoise },
            }
        });
        material.transparent = true;


        material.uniforms.noiseTexture.value = textureNoise;

        return new THREE.Mesh(plane, material);
    }

    GetCamera() {
        const camera = new THREE.PerspectiveCamera(40.0, 1.0, 0.1, 8.0);
        camera.position.set(0.6993299722671509, 1.830150842666626, 2.692080020904541);
        camera.rotation.set(-0.7626448083624523, 0.14970809296220136, 0.08631447023515704);

        return camera;
    }
    
    // SendUniformsToPlane(time) {
    //     if (this.material) {
    //         this.material.uniforms.u_time.value = time;
    //     }
    // }
}


class RenderScene{


    constructor(divElement) {
        if (divElement !== undefined) {
            this.bgElement = divElement;

            // Delete img as a placeholder for 3D view
            this.bgElement.getElementsByTagName("img")[0].remove();
        
            this.bgWidth = this.bgElement.offsetWidth;
            this.bgHeight = window.innerHeight;
        }        
    }

    async _Initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.sceneOffset = 0.0;
        
        // Set Timer
        this.clock = new THREE.Clock();
        this.timeElapsed = 0.0;

        this.render = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            // preserveDrawingBuffer: true,
            precision: "lowp",
            powerPreference: "low-power"
        });

        // alert("Width: " + this.bgWidth + ", Height: " + this.bgHeight);

        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(this.bgWidth, this.bgHeight);
        // this.render.setSize(522, 991);
        this.render.setAnimationLoop(() => {
            this.Animate();
        });

        // // Add render scene to HTML
        // this.bgElement.appendChild(this.render.domElement);

        // this.secondContext.fillStyle = "#4c4b16";

        const contour = new ContourShader();
        this.contour = contour;

        this.planeMesh = contour.GetPlaneMesh();
        this.scene.add(this.planeMesh);
        
        this.camera = contour.GetCamera();
        this.scene.add(this.camera);

        // this.camera.far = 32.0;

        
        
        // **************************** //
        //      Background Canvas       //
        // **************************** //
        this.bgCanvas = document.getElementById("hero-3d-background");
        this.bgContext = this.bgCanvas.getContext("2d");
        
        this.bgCanvas.width = (this.bgWidth * 0.5);
        this.bgCanvas.height = (this.bgHeight * 0.5);
        this.bgCanvas.style = "width: 100%;";

        // We need another canvas for displaying render (the second canvas will be blured)
        
        // **************************** //
        //        Second Canvas         //
        // **************************** //
        this.secondCanvas = document.getElementById("hero-3d-content");
        
        this.secondContext = this.secondCanvas.getContext("2d");
        
        this.secondCanvas.width = this.bgWidth - 2 * this.sceneOffset;
        this.secondCanvas.height = this.bgHeight - 2 * this.sceneOffset;
        
        this._OnWindowResize();

        // Add event listener
        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);
    
        // const bgURL = this.render.domElement.toDataURL();
        
        // var insideBorder = document.getElementsByClassName("portfolio-hero-border")[0];
        // insideBorder.style.background = "url(" + bgURL + ")";

        this._Render();
    }

    _OnWindowResize() {

        this.bgWidth = this.bgElement.offsetWidth;
        this.bgHeight = window.innerHeight;

        this.camera.aspect = this.bgWidth / this.bgHeight;
        this.camera.updateProjectionMatrix();

        this.render.setSize(this.bgWidth, this.bgHeight);

        this.sceneOffset = Math.max(20, vmin(4)) + 12;

        this.bgCanvas.width = this.bgWidth * 0.5;
        this.bgCanvas.height = this.bgHeight * 0.5;
    
        this.secondCanvas.width = this.bgWidth - 2 * this.sceneOffset;
        this.secondCanvas.height = this.bgHeight - 2 * this.sceneOffset;
    
    }

    _Render() {
        // this.render.autoClear = true;
        
        this.render.setSize(this.bgWidth * 0.5, this.bgHeight * 0.5);
        this.render.setViewport(0, 0, this.bgWidth * 0.5, this.bgHeight * 0.5);
        this.render.render(this.scene, this.camera);
        
        
        this.bgContext.fillStyle = "#4c4b16";
        this.bgContext.fillRect(0, 0, this.bgWidth, this.bgHeight);
        this.bgContext.drawImage(this.render.domElement, 0, 0)
        
        // ################## //
        // #  Second Canvas # //
        // ################## //

        this.render.setSize(this.bgWidth - (2 * this.sceneOffset), this.bgHeight - (2 * this.sceneOffset));
        this.render.setViewport(-this.sceneOffset, -this.sceneOffset, this.bgWidth, this.bgHeight);
        this.render.render(this.scene, this.camera);

        this.secondContext.fillStyle = "#4c4b16";
        this.secondContext.fillRect(0, 0, this.bgWidth, this.bgHeight);
        this.secondContext.drawImage(this.render.domElement, 0, 0)
        
        // this.render.autoClear = false;
        // context.drawImage(renderer.domElement, 0, 0);

    }

    Animate() {
        if (window.scrollY <= this.bgHeight) {
            const delta = this.clock.getDelta();
            this.timeElapsed += delta * 0.2;
            // this.camera.position.setY(this.camera.position.y + 0.01);

            
            if (this.planeMesh) {
                this.planeMesh.material.uniforms.u_time.value = this.timeElapsed;
            }

            this._Render();
            
            // this.ctx.clearRect(-20, -20, this.bgWidth - 40, this.bgHeight - 40);
            // this.ctx.drawImage(this.render.domElement, -20, -20, this.bgWidth - 40, this.bgHeight - 40);

            // const rotateValue = 0.01;
            // this.cameraRadians += rotateValue;
            // // this.cameraLength = 5.0;

            // this.camera.position.setZ(this.cameraLength * Math.sin(this.cameraRadians));
            // this.camera.position.setY(-this.cameraLength * Math.cos(this.cameraRadians));
            // // this.camer
            // this.camera.rotateX(-rotateValue);
            // this.camera.position.setZ(this.camera.position.z += 0.1)
        }
    }

}

const BG_Hero_Scene = new RenderScene(
    document.getElementsByClassName("portfolio-hero-bg")[0]
);
BG_Hero_Scene._Initialize();