import * as THREE from 'three';


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


class DotsFloor {
    constructor(size_x, size_y) {
        this.size_x = 128;
        this.size_y = 128;

        this.dotScene = new THREE.Scene();
        this.dotScene.background = new THREE.Color(0x252525)
        this.camera = new THREE.OrthographicCamera(-20.0, 20.0, -10.0, 10.0, 0.01, 2000.0);
        // this.camera = new THREE.PerspectiveCamera(54.0, 1.0, 0.1, 100.0);

        if (size_x !== undefined) this.size_x = size_x;
        if (size_y !== undefined) this.size_y = size_y;
    }

    InitScene() {
        const aspectRatio = window.innerWidth / window.innerHeight;

        // this.camera = new THREE.OrthographicCamera(-20.0, 20.0, -10.0, 10.0, 0.1, 200.0);
        // this.camera.position.x = 5;
        this.camera.position.y = 5.0;
        // this.camera.position.z = 5;

        this.camera.rotateX(-Math.PI * 0.5);
        this.camera.rotateZ(Math.PI * 0.25);
        // this.camera.rotateX(Math.PI * 0.25);
        // this.camera.rotateZ(-Math.PI * 0.75);

        /* Dot floor generator */
        const geometry = new THREE.BufferGeometry();

        const positions = [];

        const size = 40;
        const halfSize = size / 2.0;

        for (var i = 0; i < 40; ++i) {
            for (var j = 0; j < 40; ++j) {
                positions.push(-halfSize + i, -0.1, -halfSize + j);
            }
        }
        console.log(positions);

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 3.0,
            color: 0xFFFFFF
        });
        // const material = new THREE.PointsMaterial({ color: 0xFFFFFF });

        this.dotFloor = new THREE.Points(geometry, material);

        this.dotScene.add(this.dotFloor);
    }

    GetDotScene() {
        return this.dotScene;
    }

    GetCamera() {
        return this.camera;
    }

}


class RenderScene {


    constructor(divElement) {
        if (divElement !== undefined) {
            this.bgElement = divElement;

            // Delete img as a placeholder for 3D view
            // this.bgElement.getElementsByTagName("img")[0].remove();
            this.bgElement.innerHTML = "";

            this.bgWidth = this.bgElement.offsetWidth;
            this.bgWidth = this.bgElement.offsetHeight;
            // this.bgHeight = window.innerHeight;
        }
    }

    _Initialize() {
        this.scene = new THREE.Scene();
        // this.camera = new THREE.PerspectiveCamera();
        this.camera = new THREE.PerspectiveCamera(40.0, 1.0, 0.1, 8.0);;
        this.sceneOffset = 0.0;

        // Set Timer
        this.clock = new THREE.Clock();
        this.timeElapsed = 0.0;

        this.render = new THREE.WebGLRenderer({
            antialias: true,
            precision: "lowp"
        });

        // alert("Width: " + this.bgWidth + ", Height: " + this.bgHeight);

        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(this.bgWidth, this.bgHeight);
        // this.render.setSize(522, 991);
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

        // this.planeMesh = contour.GetPlaneMesh();
        // this.scene.add(this.planeMesh);

        // this.camera = contour.GetCamera();
        // this.scene.add(this.camera);

        this.camera.far = 32.0;



        // // **************************** //
        // //      Background Canvas       //
        // // **************************** //
        // this.bgCanvas = document.getElementById("hero-3d-background");
        // this.bgContext = this.bgCanvas.getContext("2d");

        // this.bgCanvas.width = (this.bgWidth * 0.5);
        // this.bgCanvas.height = (this.bgHeight * 0.5);
        // this.bgCanvas.style = "width: 100%;";

        // We need another canvas for displaying render (the second canvas will be blured)

        // // **************************** //
        // //        Second Canvas         //
        // // **************************** //
        // this.secondCanvas = document.getElementById("hero-3d-content");

        // this.secondContext = this.secondCanvas.getContext("2d");

        // this.secondCanvas.width = this.bgWidth - 2 * this.sceneOffset;
        // this.secondCanvas.height = this.bgHeight - 2 * this.sceneOffset;

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
        const frustumSize = 20;


        this.bgWidth = this.bgElement.offsetWidth;
        this.bgHeight = window.innerHeight;

        this.camera.aspect = this.bgWidth / this.bgHeight;
        this.camera.updateProjectionMatrix();

        this.render.setSize(this.bgWidth, this.bgHeight);

        this.sceneOffset = Math.max(20, vmin(4)) + 12;

        // this.bgCanvas.width = this.bgWidth * 0.5;
        // this.bgCanvas.height = this.bgHeight * 0.5;

        // this.secondCanvas.width = this.bgWidth - 2 * this.sceneOffset;
        // this.secondCanvas.height = this.bgHeight - 2 * this.sceneOffset;

        this.camera.left = - 0.5 * frustumSize * this.camera.aspect / 2;
        this.camera.right = 0.5 * frustumSize * this.camera.aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = - frustumSize / 2;
        this.camera.updateProjectionMatrix();

    }

    _Render() {
        // this.render.autoClear = true;

        // this.render.setSize(this.bgWidth * 0.5, this.bgHeight * 0.5);
        // this.render.setViewport(0, 0, this.bgWidth * 0.5, this.bgHeight * 0.5);
        this.render.render(this.scene, this.camera);


        // this.bgContext.fillStyle = "#4c4b16";
        // this.bgContext.fillRect(0, 0, this.bgWidth, this.bgHeight);
        // this.bgContext.drawImage(this.render.domElement, 0, 0)

        // ################## //
        // #  Second Canvas # //
        // ################## //

        // this.render.setSize(this.bgWidth - (2 * this.sceneOffset), this.bgHeight - (2 * this.sceneOffset));
        // this.render.setViewport(-this.sceneOffset, -this.sceneOffset, this.bgWidth, this.bgHeight);
        // this.render.render(this.scene, this.camera);

        // this.secondContext.fillStyle = "#4c4b16";
        // this.secondContext.fillRect(0, 0, this.bgWidth, this.bgHeight);
        // this.secondContext.drawImage(this.render.domElement, 0, 0)

        // this.render.autoClear = false;
        // context.drawImage(renderer.domElement, 0, 0);

    }

    Animate() {
        if (window.scrollY <= this.bgHeight) {
            const delta = this.clock.getDelta();
            this.timeElapsed += delta;


            if (this.planeMesh) {
                this.planeMesh.material.uniforms.u_time.value = this.timeElapsed;
            }
            // this.camera.rotateZ(0.01);
            this.camera.position.setX((this.camera.position.x + 0.01) % 1);
            this.camera.position.setZ((this.camera.position.z + 0.01) % 1);
            // this.camera.translateZ(0.01);

            this._Render();
        }
    }

}

const BG_Hero_Scene = new RenderScene(
    document.getElementsByClassName("portfolio-hero-section")[0]
);
BG_Hero_Scene._Initialize();