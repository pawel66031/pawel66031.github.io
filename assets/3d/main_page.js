import * as THREE from 'three'

const sphere = new THREE.SphereGeometry(1, 1, 1);
// const sphereMaterial = new THREE.ShaderMaterial()
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(sphere, sphereMaterial);

const sceneSphere = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window, innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

sceneSphere.add(mesh);

const mainBackground = document.body.getElementsByClassName("site-main-background")[0];
mainBackground.appendChild(renderer.domElement);

camera.position.z = 5;

function animate() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(sceneSphere, camera);
}