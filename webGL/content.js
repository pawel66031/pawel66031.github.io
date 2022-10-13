import * as THREE from "three"; 

import { GLTFLoader } from './ThreeJS/loaders/GLTFLoader.js';

function createWheels(){
    const geometry = new THREE.BoxGeometry(12, 12, 33);

    const material = new THREE.MeshLambertMaterial({color: 0x333333});
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
}

function createCar() {
    const car = new THREE.Group();

    const backWheel = createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = createWheels();
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    // Create mesh
    const mainMesh = new THREE.Mesh(
        new THREE.BoxGeometry(60, 15, 30),
        new THREE.MeshLambertMaterial({color:0x78b14b})
    );
    mainMesh.position.y = 12;
    car.add(mainMesh);

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 12, 24),
        new THREE.MeshLambertMaterial({color: 0xffffff})
    );

    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);

    return car;
}


// Do render if you find div that matches the id that is given below
const contentDiv = document.getElementById("contents");
if(contentDiv){
    var renderer, scene, camera;

    var ambientLight, directionalLight;

    // Mouse reaction
    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    contentDiv.addEventListener("mousemove", onContentMouseMove);
    init();
    animate();

    function init(){
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
                70, aspectRatio, 0.1, 1000
            );

            camera.position.set(0, 0, 10);
            camera.lookAt(0, 0, -1000);
                
                const loader = new GLTFLoader().setPath("model3D/");
                loader.load("troglodyte2.gltf", function (gltf) {
                    scene.add(gltf.scene);

                    render();
                });

            // const car = createCar();
            // scene.add(car);

            // const box = new THREE.BoxGeometry(1, 1, 1);
            // const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
            // const cube = new THREE.Mesh(box, boxMaterial);
            // scene.add(cube);


            // Set up renderer
            renderer = new THREE.WebGLRenderer({antialias: true});
            // Append rendered picture to contents id
            // const canvas = contentDiv.appendChild(renderer.domElement);
            renderer.setSize(contentDiv.clientWidth, contentDiv.clientHeight);
            console.log(contentDiv.clientWidth);
            // renderer.setSize(window.innerWidth, window.innerHeight);
            // document.body.appendChild( renderer.domElement );
            const canvas = contentDiv.appendChild(renderer.domElement);
            canvas.style = "width:100%; height:100%;";

            window.addEventListener("resize", resizeWebGLWindow);
    }
    function render(){
        camera.position.x += (mouseX - camera.position.x) * 0.1;
        camera.position.y += (-mouseY - camera.position.y) * 0.1;

        camera.lookAt(0, 0, -1000);

        renderer.render(scene, camera);
    }

    function onContentMouseMove( event ){
        mouseX = ((event.clientX - windowHalfX) * 0.01);
        mouseY = ((event.clientY - windowHalfY) * 0.01) - 2;
    }

    function resizeWebGLWindow(){
        windowHalfX = contentDiv.clientWidth / 2;
        windowHalfY = contentDiv.clientHeight / 2;

        camera.aspect = contentDiv.clientWidth / contentDiv.clientHeight;
        camera.updateProjectionMatrix();
    }

    function animate(){
        requestAnimationFrame(animate);
        render();
    }

    function rotateCamera(){
        requestAnimationFrame(rotateCamera);
        
        camera.position.x += 0.01;
        camera.position.y += 0.01;
        
        renderer.render(scene, camera);
    }

    rotateCamera();

}