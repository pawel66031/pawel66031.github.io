import * as THREE from 'three';

const sqrt2 = Math.sqrt(2);

const DotObject_AnimationType = {
    ROTATE: 'ROTATE',
    FOUNTAIN: 'FOUNTAIN',

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

class DotsAnimationObject extends THREE.Object3D {
    constructor(offset, duration) {
        super(THREE.Object3D);

        this.frameTime = offset;
        this.animationDuration = duration;
    }

    UpdateAnimation(delta) {
        this.frameTime += delta;
    }
}

class FountainDotsObject extends DotsAnimationObject {
    constructor(offsetAnimation, duration) {
        super(offsetAnimation, duration);

        console.log(this.frameTime);
    }

    UpdateAnimation(delta) {


        // Always put super at the end in order to update frame time
        super.UpdateAnimation(delta);
    }
}


class DotsFloor {
    constructor(size_x, size_y) {
        // Variables for controlling animation
        this.actionsToPlay = [];


        //  Dots size
        this.size_x = 128;
        this.size_y = 128;

        this.animationValue = 0.0;

        this.dotScene = new THREE.Scene();
        this.dotScene.background = new THREE.Color(0x252525)
        // this.camera = new THREE.OrthographicCamera(-20.0, 20.0, -10.0, 10.0, 0.1, 2000.0);
        this.camera = new THREE.OrthographicCamera(-0.68, 0.68, 1.0, -1.0, 0.1, 2000.0);
        // this.camera = new THREE.PerspectiveCamera(54.0, 1.0, 0.1, 100.0);

        if (size_x !== undefined) this.size_x = size_x;
        if (size_y !== undefined) this.size_y = size_y;
    }

    InitScene() {
        const aspectRatio = window.innerWidth / window.innerHeight;

        // this.camera = new THREE.OrthographicCamera(-20.0, 20.0, -10.0, 10.0, 0.1, 200.0);
        this.camera.position.z = 50;

        /* Dot floor generator */
        const geometry = new THREE.BufferGeometry();

        const positions = [];

        // const size = 40;
        const halfSize = this.size_x * 0.5;

        const degree = Math.PI * 0.25;

        for (var i = 0; i < this.size_x; ++i) {
            for (var j = 0; j < this.size_y; ++j) {

                // const x = -halfSize + i;
                // const y = -halfSize + j;

                // positions.push((x * Math.cos(degree) - y * Math.sin(degree)), 0.0, x * Math.sin(degree) + y * Math.cos(degree));
                positions.push(-halfSize + i + 0.5, 0.0, -halfSize + j + 0.5);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 3.0,
            color: 0xFFFFFF
        });
        // const material = new THREE.PointsMaterial({ color: 0xFFFFFF });

        this.dotFloor = new THREE.Points(geometry, material);

        this.dotScene.add(this.dotFloor);

        /* Empty object to parent with camera */
        const emptyCamera = new THREE.Object3D();
        this.dotScene.add(emptyCamera);

        console.log(emptyCamera);

        emptyCamera.attach(this.camera);

        /* To move camera, change those values */
        emptyCamera.rotateY(Math.PI * 0.25);
        emptyCamera.rotateX(-0.6154);


        /* Test Cube for Debugging */


        /* Geometry creator */
        // const box = new THREE.BoxGeometry(1, 1, 1);
        this.dotCube = this.PistonGeometry();


        this.dotCube.translateX(0);
        this.dotCube.translateY(0.5);
        this.dotCube.translateZ(0);

        this.dotCube.scale.x = 1.0;

        console.log(this.dotCube);


        this.dotScene.add(this.dotCube);

        const boxGeometry = new THREE.BoxGeometry(1, 2, 1, 1, 2, 1);

        const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0x252525 }))
        const boxPoint = new THREE.Points(boxGeometry, material);

        this.dotScene.add(boxMesh);


        this.cameraController = emptyCamera;

        // Testing purpose
        var dotAnimation = new FountainDotsObject(-20, 10);
    }

    // User defined list of Geometry
    PistonGeometry() {
        const materialDebug = new THREE.PointsMaterial({
            size: 3.0,
            color: 0xFFFFFF
        });

        const box = new THREE.BufferGeometry();
        const boxGeometry = [];

        const BoxSizeX = 1;
        const BoxSizeY = 2;
        const BoxSizeZ = 1;

        for (var i = 0; i <= BoxSizeX; ++i) {
            for (var j = 0; j <= BoxSizeY; ++j) {
                for (var k = 0; k <= BoxSizeZ; ++k) {
                    boxGeometry.push(i, j, k);
                }
            }
        }

        box.setAttribute('position', new THREE.Float32BufferAttribute(boxGeometry, 3));
        console.log(boxGeometry);

        return new THREE.Points(box, materialDebug);
    }


    GetDotScene() {
        return this.dotScene;
    }

    GetCamera() {
        return this.camera;
    }
    GetCameraController() {
        return this.cameraController;
    }


    _Update() {
        // this.animationValue = (this.animationValue + 0.025) % 2.0;

        /* Point Fontain */
        this.animationValue = (this.animationValue + 0.05) % (Math.PI * 0.5);

        // Play each defined action
        this.actionsToPlay.forEach(element => {
            element.Update();
        });

        this.dotCube.scale.y = Math.max(0.0, Math.sin(this.animationValue));
    }

}


class RenderScene {


    constructor(divElement) {
        if (divElement !== undefined) {
            this.bgElement = divElement;

            // Delete img as a placeholder for 3D view
            this.bgElement.innerHTML = "";

            this.bgWidth = this.bgElement.offsetWidth;
            this.bgWidth = this.bgElement.offsetHeight;
            // this.bgHeight = window.innerHeight;
        }
    }

    _Initialize() {
        this.scene = new THREE.Scene();
        // this.camera = new THREE.PerspectiveCamera();
        this.camera = new THREE.PerspectiveCamera(40.0, 1.0, 0.1, 8.0);
        this.sceneOffset = 0.0;

        // Set Timer
        this.clock = new THREE.Clock();
        this.timeElapsed = 0.0;

        this.render = new THREE.WebGLRenderer({
            antialias: true,
            precision: "lowp"
        });

        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(this.bgWidth, this.bgHeight);
        this.render.setAnimationLoop(() => {
            this.Animate();
        });

        // // Add render scene to HTML
        this.bgElement.appendChild(this.render.domElement);

        // this.secondContext.fillStyle = "#4c4b16";


        const dotsFloor = new DotsFloor();
        // this.contour = contour;

        dotsFloor.InitScene();
        this.scene = dotsFloor.GetDotScene();
        this.camera = dotsFloor.GetCamera();
        this.cameraController = dotsFloor.GetCameraController();


        this.dotsUpdater = dotsFloor;


        // this.camera.far = 32.0;

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
        const frustumSize = 10;


        this.bgWidth = this.bgElement.offsetWidth;
        this.bgHeight = window.innerHeight;

        this.camera.aspect = this.bgWidth / this.bgHeight;
        const aspect = this.bgWidth / this.bgHeight;
        this.camera.updateProjectionMatrix();

        this.render.setSize(this.bgWidth, this.bgHeight);

        this.sceneOffset = Math.max(20, vmin(4)) + 12;

        this.camera.left = -0.5 * frustumSize * aspect;
        this.camera.right = 0.5 * frustumSize * aspect;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = -frustumSize / 2;
        this.camera.updateProjectionMatrix();

    }

    _Render() {
        this.render.render(this.scene, this.camera);
    }

    Animate() {
        if (window.scrollY <= this.bgHeight) {
            const delta = this.clock.getDelta();
            this.timeElapsed += delta;


            if (this.planeMesh) {
                this.planeMesh.material.uniforms.u_time.value = this.timeElapsed;
            }
            // this.camera.rotateZ(0.01);
            this.cameraController.position.setX((this.cameraController.position.x - 0.01) % 1);
            this.cameraController.position.setZ(((this.cameraController.position.z - 0.01) % 1));


            // this.camera.position.setZ(((this.camera.position.z - 0.01) % sqrt2));


            // this.camera.translateZ(0.01);
            this.dotsUpdater._Update();
            this._Render();
        }
    }

}

const BG_Hero_Scene = new RenderScene(
    document.getElementsByClassName("portfolio-hero-section")[0]
);
BG_Hero_Scene._Initialize();