import * as THREE from "three";

import { GLTFLoader } from './ThreeJS/loaders/GLTFLoader.js';
import { EXRLoader } from './ThreeJS/loaders/EXRLoader.js';

// Do render if you find div that matches the id that is given below
const contentDiv = document.getElementById("frog");
if (contentDiv) {
    var renderer, scene, camera;

    var ambientLight, directionalLight;

    var frogObject;

    var uniforms;

    // Particles
    const flames = {};

    // Scene background
    let exrBackground;

    // Mouse reaction
    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // contentDiv.addEventListener("mousemove", onContentMouseMove);
    init();
    animate();

    function init() {
        scene = new THREE.Scene();

        ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(200, 500, 300);
        scene.add(directionalLight);

        // Setting up camera
        const aspectRatio = contentDiv.clientWidth / contentDiv.clientHeight;
        const cameraWidth = 150;
        const cameraHeight = cameraWidth / aspectRatio;

        // camera = new THREE.OrthographicCamera(
        //     cameraWidth / -2, // left
        //     cameraWidth / 2, // right
        //     cameraHeight / 2, // top
        //     cameraHeight / -2, // bottom
        //     0,
        //     1000
        //     );
        camera = new THREE.PerspectiveCamera(
            54, aspectRatio, 0.1, 3500
        );

        camera.position.set(0, 0.3, 9.5);
        camera.lookAt(0, -0.5, 8);

        // Set up renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        // Append rendered picture to contents id
        // const canvas = contentDiv.appendChild(renderer.domElement);
        renderer.setSize(contentDiv.clientWidth, contentDiv.clientHeight);
        console.log(contentDiv.clientWidth);
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        const canvas = contentDiv.appendChild(renderer.domElement);
        canvas.style = "width:100%; height:100%;";

        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        // Load background

        // scene.background = new EXRLoader()
        //     .load("textures/forest.exr", function (texture) {
        //         exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
        //         scene.background = exrCubeRenderTarget.texture;

        //         texture.dispose();

        //     })

        // Load 3D model

        const loader = new GLTFLoader().setPath("model3D/");
        // loader.load("troglodyte2.gltf", function (gltf) {
        loader.load("zaba.gltf", function (gltf) {
            gltf.scene.position.set(0, -0.5, 8);
            scene.add(gltf.scene);

            frogObject = gltf.scene;

            render();
        });

        // const car = createCar();
        // scene.add(car);

        // const box = new THREE.BoxGeometry(1, 1, 1);
        // const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        // const cube = new THREE.Mesh(box, boxMaterial);
        // scene.add(cube);


        window.addEventListener("resize", resizeWebGLWindow);
    }

    // Rendering

    function render() {
        camera.position.x += (mouseX - camera.position.x) * 0.1;
        camera.position.y += (-mouseY - camera.position.y) * 0.1;

        camera.lookAt(0, 0, -1);
        renderer.setClearColor('rgb(100, 100, 100)')
        renderer.render(scene, camera);
    }

    function onContentMouseMove(event) {
        mouseX = ((event.clientX - windowHalfX) * 0.01);
        mouseY = ((event.clientY - windowHalfY) * 0.01);
        // mouseY = ((event.clientY - windowHalfY) * 0.2) - 2;
    }

    function resizeWebGLWindow() {
        windowHalfX = contentDiv.clientWidth / 2;
        windowHalfY = contentDiv.clientHeight / 2;

        camera.aspect = contentDiv.clientWidth / contentDiv.clientHeight;
        camera.updateProjectionMatrix();
    }

    function animate() {

        requestAnimationFrame(animate);

        frogObject.rotation.y += 0.01;

        render();
    }

    function rotateCamera() {
        requestAnimationFrame(rotateCamera);

        camera.position.x += 0.005;
        camera.position.y += 0.005;

        renderer.render(scene, camera);
    }

    rotateCamera();

}