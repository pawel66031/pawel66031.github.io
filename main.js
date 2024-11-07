import * as THREE from 'three';

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-5, 5, -5, 5, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const size = 10;
const divisions = 10;

// const gridHelper = new THREE.GridHelper(size, divisions);
const gridHelper = new THREE.InfiniteGridHelper()
scene.add(gridHelper);

camera.position.y = 20;
camera.rotation.x = -Math.PI * 0.5;

renderer.render(scene, camera);

// function animate() {

//     camera.rotation.x += 0.01;
//     // camera.rotation.y += 0.01;

//     renderer.render(scene, camera);

// }