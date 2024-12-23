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


function IsAnimationFinished(val) {
    return val.isAnimationFinished;
}


class DotsAnimationObject extends THREE.Group {

    constructor(offset, duration) {

        super();

        this.frameTime = offset;
        this.animationDuration = duration;

        this.isAnimationFinished = false;

    }

    UpdateAnimation(delta) {

        if (this.frameTime > this.animationDuration) {

            this.isAnimationFinished = true;

        }

        this.frameTime += delta;
    }

    InitializeDotObject() {

    }
}

class FountainDotsObject extends DotsAnimationObject {

    constructor(offsetAnimation, duration) {

        super(offsetAnimation, duration);

        console.log(this.frameTime);

    }

    UpdateAnimation(delta) {

        this.scale.y = 0.0 * (this.frameTime / this.animationDuration);

        // Always put super at the end in order to update frame time
        super.UpdateAnimation(delta);
    }

    InitializeDotObject() {

    }
}


class DotsFloor {
    constructor(size_x, size_y) {
        // Variables for controlling animation
        this.actionsToPlay = [];
        this.candidateToRemove = [];

        this.dotMaterial = new THREE.PointsMaterial({
            depthTest: false,
            size: 3.0,
            color: 0xFFFFFF
        });

        // Timer
        this.timer = new THREE.Clock();


        //  Dots size
        this.size_x = 128;
        this.size_y = 128;

        this.animationValue = 0.0;

        this.dotScene = new THREE.Scene();
        this.dotScene.background = new THREE.Color(0x252525);

        this.camera = new THREE.OrthographicCamera(-0.68, 0.68, 1.0, -1.0, 0.1, 2000.0);

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


        this.dotFloor = new THREE.Points(geometry, this.dotMaterial);
        this.dotFloor.renderOrder = 2;

        this.dotScene.add(this.dotFloor);

        /* Empty object to parent with camera */
        const emptyCamera = new THREE.Object3D();
        this.dotScene.add(emptyCamera);

        this.PrepareDotObjects();

        emptyCamera.attach(this.camera);

        /* To move camera, change those values */
        emptyCamera.rotateY(Math.PI * 0.25);
        emptyCamera.rotateX(-0.6154);


        /* Test Cube for Debugging */


        /* Geometry creator */
        // const box = new THREE.BoxGeometry(1, 1, 1);
        // this.dotCube = this.PistonGeometry();
        this.dotCube = this.dotObjects[0].clone();
        this.dotCube.renderOrder = 3;


        this.dotCube.translateX(0);
        this.dotCube.translateY(0.5);
        this.dotCube.translateZ(0);

        this.dotCube.rotateY(Math.PI * 0.5);

        this.dotCube.scale.x = 1.0;

        console.log(this.dotCube);


        this.dotScene.add(this.dotCube);

        // const boxGeometry = new THREE.BoxGeometry(4, 4, 4, 1, 1, 1);

        // const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0x25FFFF }))
        // const boxPoint = new THREE.Points(boxGeometry, this.dotMaterial);

        // this.dotScene.add(boxMesh);
        // this.dotScene.add(boxPoint);


        this.cameraController = emptyCamera;

        // // Testing purpose
        // var dotAnimation = new FountainDotsObject(-1.0, 1.0);
        // var dotAnimation2 = new FountainDotsObject(-2.0, 1.0);


        // dotAnimation.scale.y = 3.0;
        // this.dotScene.add(dotAnimation);
        // this.actionsToPlay.push(dotAnimation);
        // this.dotScene.add(dotAnimation2);
        // this.actionsToPlay.push(dotAnimation2);
    }


    PrepareDotObjects() {

        this.dotObjects = [];

        // ###########################
        //        #1 Big box
        // ###########################
        //
        //  .....
        //  .....
        //  .....
        //  .....
        //  .....
        //

        const BigBoxGroup = new THREE.Group();

        const BigBoxGeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0, 1, 1, 1);
        const BigBoxMeshMaterial = new THREE.MeshBasicMaterial({ color: 0x252525 });
        const BigBoxMesh = new THREE.Mesh(BigBoxGeometry, BigBoxMeshMaterial);

        BigBoxGroup.add(BigBoxMesh);

        // Buffer points
        const BigBoxBuffer = new THREE.BufferGeometry();

        const boxGeometry = [];


        const BoxSizeX = 5;
        const BoxSizeY = 5;
        const BoxSizeZ = 5;

        for (var i = 0; i <= BoxSizeX; ++i) {

            for (var j = 0; j <= BoxSizeY; ++j) {

                for (var k = 0; k <= BoxSizeZ; ++k) {

                    // Optimize this buffer (don't render unnecessary points)
                    if ((i == 0 || j == 0 || k == 0) || (i == BoxSizeX || j == BoxSizeY || k == BoxSizeZ)) {
                        boxGeometry.push(i - BoxSizeX * 0.5, j - BoxSizeY * 0.5, k - BoxSizeZ * 0.5);
                    }


                }

            }

        }

        BigBoxBuffer.setAttribute('position', new THREE.Float32BufferAttribute(boxGeometry, 3));

        const BigBoxPoints = new THREE.Points(BigBoxBuffer, this.dotMaterial);

        BigBoxGroup.add(BigBoxPoints);

        this.dotObjects.push(BigBoxGroup);


        // #############################
        //        #2 Small box
        // #############################
    }

    // User defined list of Geometry
    PistonGeometry() {

        const materialDebug = new THREE.PointsMaterial({
            size: 3.0,
            color: 0xFFFFFF
        });

        const box = new THREE.BufferGeometry();
        const boxGeometry = [];


        const BoxSizeX = 4;
        const BoxSizeY = 4;
        const BoxSizeZ = 4;


        for (var i = 0; i <= BoxSizeX; ++i) {

            for (var j = 0; j <= BoxSizeY; ++j) {

                for (var k = 0; k <= BoxSizeZ; ++k) {

                    // if ((i == 0 || j == 0 || k == 0) || (i == BoxSizeX || j == BoxSizeY || k == BoxSizeZ)) {
                    boxGeometry.push(i, j, k);
                    // }


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


    _Update(delta) {

        // Detect if camera is far away
        const valueMeasure = this.animationValue + delta;

        this.animationValue = (this.animationValue + delta) % 1.0;

        if (this.animationValue < valueMeasure) {

            this.dotCube.position.z += 1.0;
            this.dotCube.position.x += 1.0;

            if (this.dotCube.position.x > 12.0) {
                this.dotCube.position.z = -12.0;
                this.dotCube.position.x = -12.0;
            }

            this.actionsToPlay.forEach(element => {

                // element.translateX(1.0);
                // element.translateZ(1.0);

            });


        }

        // Play each defined action
        this.actionsToPlay.forEach(element => {

            element.UpdateAnimation(delta);

        });


        for (var i = this.actionsToPlay.length - 1; i >= 0; --i) {

            // Delete objects after finished animation
            if (this.actionsToPlay[i].isAnimationFinished) {
                this.actionsToPlay.splice(i, 1);
            }

        }
        this.dotCube.rotateY(delta);
        // this.dotCube.scale.y = Math.sin(this.animationValue);
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

        this.render.sortObjects = false;

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
            this.cameraController.position.setX((this.cameraController.position.x - delta) % 1);
            this.cameraController.position.setZ(((this.cameraController.position.z - delta) % 1));


            // this.camera.translateZ(0.01);
            this.dotsUpdater._Update(delta);
            this._Render();
        }
    }

}

const BG_Hero_Scene = new RenderScene(
    document.getElementsByClassName("portfolio-hero-section")[0]
);
BG_Hero_Scene._Initialize();