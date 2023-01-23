import * as THREE from "three";

// Camera

var camera = new THREE.Camera();
// Scene
// Renderer

class WebScene {
    constructor(width = window.innerWidth, height = window.innerHeight) {
        this.camera = null;
        this.scene = new THREE.Scene();
        this.renderer = null;

        this.renderWidth = width;
        this.renderHeight = height;

        this.init();
    }

    init() {
        var divLocation = document.getElementById("threed-view");
        // Camera
        this.cameraFov = 70;
        this.cameraNear = 1;
        this.cameraFar = 1000;
        // this.cameraRatio = this.renderWidth / this.renderHeight;
        this.cameraRatio = this.renderWidth / divLocation.offsetHeight;
        // this.cameraRatio = this.renderWidth / this.renderHeight;

        this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.cameraRatio, this.cameraNear, this.cameraFar);
        this.camera.position.set(0, 0, 4);

        this.light = new THREE.SpotLight("#ffffff", 1.0, 20.0);
        this.light.position.set(0, 3, 3);
        this.scene.add(this.light);

        // Create a box
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial({
            color: "#00ff00"
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.cube);

        // Renderer
        this.renderer = new THREE.WebGLRenderer();
        if (divLocation) {
            this.cameraRatio = this.renderWidth / divLocation.offsetHeight;
            this.renderer.setSize(this.renderWidth, divLocation.offsetHeight);
            divLocation.appendChild(this.renderer.domElement);
        }
        else {
            this.renderer.setSize(this.renderWidth, this.renderHeight);
            document.body.appendChild(this.renderer.domElement);
        }
        this.renderer.setClearColor('rgb(255, 154, 100)');

        // Look for div with class named threed-view
        // document.body.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        this.updateFrame();
        this.onWindowResize();
    }
    webSceneRender() {
        this.cube.rotation.x = this.cube.rotation.y += 0.01;
    }

    updateFrame() {
        this.renderer.render(this.scene, this.camera);
        this.webSceneRender();
        // requestAnimationFrame(()=>{
        //     this.updateFrame();
        // });
        requestAnimationFrame(() => {
            this.updateFrame();
        });
    }

    onWindowResize() {
        window.addEventListener("resize", () => {
            this.renderWidth = window.innerWidth;
            this.renderHeight = window.innerHeight;
            // this.camera.aspect = this.renderWidth / this.renderHeight;
            this.camera.aspect = this.renderWidth / document.getElementById("threed-view").offsetHeight;
            this.camera.updateProjectionMatrix();

            // this.renderer.setSize(this.renderWidth, this.renderHeight);
            this.renderer.setSize(this.renderWidth, document.getElementById("threed-view").offsetHeight);
        })
    }
}
new WebScene();