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


// Standard Materials for referencing

class StandardMaterial {
    // Prepare material
    constructor() {

        // White Points Material
        this.materialPoint = new THREE.PointsMaterial({
            depthTest: false,
            // size: 2.5,
            size: 4.0,
            color: 0xFFFFFF
        });

        // Mesh Material for masking
        this.materialMeshStandard = new THREE.MeshBasicMaterial({ color: 0x252525 });

    }
    PointMaterial() {
        return this.materialPoint;
    }

    MeshStandardMaterial() {
        return this.materialMeshStandard;
    }
}

class PredefinedBuffers {
    constructor() {

    }

    BoxPoints(BoxSizeX = 1, BoxSizeY = 1, BoxSizeZ = 1, offsetX = 0.0, offsetY = 0.0, offsetZ = 0.0) {
        const BigBoxBuffer = new THREE.BufferGeometry();

        const boxGeometry = [];

        for (var i = 0; i <= BoxSizeX; ++i) {

            for (var j = 0; j <= BoxSizeY; ++j) {

                for (var k = 0; k <= BoxSizeZ; ++k) {

                    // Optimize this buffer (don't render unnecessary points)
                    if ((i == 0 || j == 0 || k == 0) || (i == BoxSizeX || j == BoxSizeY || k == BoxSizeZ)) {
                        boxGeometry.push(offsetX + i - BoxSizeX * 0.5, offsetY + j - BoxSizeY * 0.5, offsetZ + k - BoxSizeZ * 0.5);
                    }


                }

            }

        }

        BigBoxBuffer.setAttribute('position', new THREE.Float32BufferAttribute(boxGeometry, 3));

        return new THREE.Points(BigBoxBuffer, standardMaterials.PointMaterial());
    }

    GetSmallBoxPoints() {
        return this.boxPointsSmall;
    }

    GetMediumBoxPoints() {
        return this.boxPointsMedium;
    }
}

class PredefinedDotAnimation {


    static Footstep(offsetX = 0.0, offsetY = 0.0, offsetZ = 0.0, offsetAnimation = 0.0, offsetDurationAnimation = 0.0) {
        var steps = 10;
        var animationSets = [];

        for (var i = 0; i <= steps; ++i) {
            // var fountainObject = new FountainDotsObject(i * 1.9, 1.6);
            var fountainObject = new FountainDotsObject(offsetAnimation + (i * 0.3), offsetDurationAnimation + 0.3);

            //      Footstep animation

            // fountainObject.position.x = (steps * 0.5) - 3 * i;
            // fountainObject.position.z = (i % 2) * 3;

            fountainObject.position.x = offsetX + (steps * 0.5) - 3 * i;
            fountainObject.position.z = offsetZ + (steps * 0.5) - 3 * i;


            const childObject = new THREE.Group();

            const BigBoxGeometry = new THREE.BoxGeometry(3.0, 3.0, 3.0, 1, 1, 1);
            const BigBoxMeshMaterial = standardMaterials.MeshStandardMaterial();
            const BigBoxMesh = new THREE.Mesh(BigBoxGeometry, BigBoxMeshMaterial);

            childObject.add(BigBoxMesh);
            childObject.add(predefinedBuffers.BoxPoints(3, 3, 3, 0.0, 0.0, 0.0));


            childObject.position.y = 1.5;

            fountainObject.add(childObject);

            animationSets.push(fountainObject);
        }

        return animationSets;
    }


    static RotatingCubes() {
        // const rangeStart = 7;
        // const rangeSize = 6;

        // const range = rangeStart + (Math.random() * rangeSize);
        var animationSets = [];

        // for (var i = 0; i <= range; ++i) {
        var boxRotation = new BoxRotationDotsObject(0.0, 1.2);

        const childObject = new THREE.Group();

        const rotatingCubeGeometry = new THREE.BoxGeometry(3.0, 3.0, 3.0, 1, 1, 1);
        const rotatingCubeMesh = new THREE.Mesh(rotatingCubeGeometry, standardMaterials.MeshStandardMaterial())

        childObject.add(rotatingCubeMesh);
        childObject.add(predefinedBuffers.BoxPoints(3, 3, 3, 0.0, 0.0, 0.0));

        childObject.position.x = 1.5;
        childObject.position.y = 1.5;

        boxRotation.add(childObject);
        animationSets.push(boxRotation);
        // }

        return animationSets;
    }
}





class DotsAnimationObject extends THREE.Group {

    constructor(offset, duration) {

        super();

        this.frameTime = -offset;
        this.animationDuration = duration;

        this.isAnimationFinished = false;

    }

    UpdateAnimation(delta) {

        if (this.frameTime > this.animationDuration) {

            this.isAnimationFinished = true;

        }

        this.frameTime += delta;
    }

    SetFrameTime(value) {
        this.frameTime = value;
    }

    GetFrameTime() {
        return this.frameTime;
    }

    SetDuration(value) {
        this.animationDuration = value;
    }

    GetDuration() {
        return this.animationDuration;
    }

    InitializeDotObject() {

    }
}

class FountainDotsObject extends DotsAnimationObject {

    constructor(offset, duration) {

        super(offset, duration);

        this.visible = false
        // console.log(this.frameTime);

    }

    UpdateAnimation(delta) {

        if (this.frameTime >= 0.0) {
            if (!this.isVisible) {
                this.visible = true;
            }

            // this.scale.y = Math.sin((this.frameTime / this.animationDuration) * Math.PI);
            this.scale.y = Math.sin((this.frameTime / this.animationDuration) * (Math.PI * 0.5));
            // this.scale.y = 1.0;

            // Always put super at the end in order to update frame time
        }
        super.UpdateAnimation(delta);
    }

    InitializeDotObject() {

    }
}

class BoxRotationDotsObject extends DotsAnimationObject {
    constructor(offset, duration) {

        super(offset, duration);

        this.visible = false

    }
}

class DotsFloor {
    constructor(size_x, size_y) {
        // Variables for controlling animation
        this.actionsToPlay = [];
        this.candidateToRemove = [];

        // Timer
        // this.timer = new THREE.Clock();
        this.addTimer = 0.0;
        this.addedCounter = 0;

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

    AppendDotObject(dotObject) {
        this.dotScene.add(dotObject);
        this.actionsToPlay.push(dotObject);
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


        // this.dotFloor = new THREE.Points(geometry, this.dotMaterial);
        this.dotFloor = new THREE.Points(geometry, standardMaterials.PointMaterial());
        this.dotFloor.renderOrder = 2;

        this.dotScene.add(this.dotFloor);

        /* Empty object to parent with camera */
        const emptyCamera = new THREE.Object3D();
        this.dotScene.add(emptyCamera);

        // this.PrepareDotObjects();

        emptyCamera.attach(this.camera);

        /* To move camera, change those values */
        emptyCamera.rotateY(Math.PI * 0.25);
        emptyCamera.rotateX(-0.6154);


        /* Test Cube for Debugging */


        /* Geometry creator */
        // const box = new THREE.BoxGeometry(1, 1, 1);
        // this.dotCube = this.dotObjects[0].clone();
        // this.dotCube = this.dotObjects[0].clone();
        // this.dotCube.SetFrameTime(0.0);
        // this.dotCube.SetDuration(2.0);

        // this.dotCube.renderOrder = 3;


        // this.dotCube.translateX(0);
        // this.dotCube.translateY(0.5);
        // this.dotCube.translateZ(0);

        // this.dotCube.rotateY(Math.PI * 0.5);

        // this.dotCube.scale.x = 1.0;

        // console.log(this.dotCube);


        // this.dotScene.add(this.dotCube);
        // this.AppendDotObject(this.dotCube);

        // Add footstep animation
        PredefinedDotAnimation.Footstep().forEach(element => {
            this.AppendDotObject(element);
        })

        PredefinedDotAnimation.RotatingCubes().forEach(element => {
            this.AppendDotObject(element);
        })

        this.cameraController = emptyCamera;

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

            this.actionsToPlay.forEach(element => {

                element.position.x += 1.0;
                element.position.z += 1.0;

                if (element.position.x > 12.0) {

                    element.position.z = -12.0;
                    element.position.x = -12.0;

                }
            })
        }

        // Play each defined action
        this.actionsToPlay.forEach(element => {
            element.UpdateAnimation(delta);
        });


        for (var i = this.actionsToPlay.length - 1; i >= 0; --i) {

            // Delete objects after finished animation
            if (this.actionsToPlay[i].isAnimationFinished) {

                this.dotScene.remove(this.actionsToPlay[i]);
                this.actionsToPlay.splice(i, 1);
            }

        }

        // Add fountain
        if (this.addTimer >= 4.0) {
            this.addTimer = this.addTimer % 4.0;
            // PredefinedDotAnimation.Footstep(this.addedCounter - 16).forEach(element => {

            PredefinedDotAnimation.Footstep(6, 0, 6).forEach(element => {
                this.AppendDotObject(element);
            })

            for (var i = 1; i <= 2; ++i) {

                PredefinedDotAnimation.Footstep(6 + (3 * i), 0, 6 - (3 * i), (i * 0.3), (i * 0.3)).forEach(element => {
                    this.AppendDotObject(element);
                })
                PredefinedDotAnimation.Footstep(6 - 3 * i, 0, 6 + 3 * i, i * 0.3, i * 0.3).forEach(element => {
                    this.AppendDotObject(element);
                })

            }

            this.addedCounter = ((this.addedCounter + 8) % 32);
        }
        this.addTimer += delta;

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


            this.viewSuspended = false;
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

        // Add render scene to HTML
        this.bgElement.appendChild(this.render.domElement);


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
        const frustumSize = 20;


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

            if (this.viewSuspended) {
                this.clock.start();
                this.viewSuspended = false;
            }

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
        else {
            if (!this.viewSuspended) {
                this.clock.stop();
                this.viewSuspended = true;
            }
        }
    }

}

const standardMaterials = new StandardMaterial();
const predefinedBuffers = new PredefinedBuffers();

const BG_Hero_Scene = new RenderScene(
    document.getElementsByClassName("portfolio-hero-section")[0]
);
BG_Hero_Scene._Initialize();