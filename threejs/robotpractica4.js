// // Práctica GPC #4
// 1. Movimiento del robot sobre el plano del suelo con las flechas del teclado.
// 2. Giro de la base sobre su eje vertical (Y): barra deslizante [-180º..180]
// 3. Giro del brazo sobre el eje Z de la pieza ‘eje’): barra deslizante [-45º..45º]
// 4. Giro del antebrazo sobre el eje Y de la pieza ‘rotula’): barra deslizante [-180º..180º]
// 5. Giro del antebrazo sobre el eje Z de la pieza ‘rotula’): barra deslizante [-90º..90]
// 6. Rotación de la pinza sobre el eje Z de la mano): barra deslizante [-40º..220º]
// 7. Apertura/Cierre de la pinza sobre el eje Z de la mano): barra deslizante [0..15]


// variables imprscindibles 
var renderer, scene, camera;
var aspectratio;
var keyboardmove;
var r = t = 60;
var l = b = -r;
var robot, base, antebrazo, pinzas,mano, pinzaIZQ, pinzaDER,disco;
var Speed = 0.1;
var updateFcts	= [];

init();
loadScene();
setupGui();
keyboardmove()
render();



function setCameras(ar){
    var origen = new THREE.Vector3(0,0,0);
    // // Perspectiva
    camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 700 );
	camera.position.set(0.5,300,300);
    camera.lookAt(new THREE.Vector3(0,60,0));

    cam = new THREE.OrthographicCamera(l,r,t,b,-300,300);
    planta = cam.clone();
    planta.position.set(0,280,0);
    planta.lookAt(origen);
    planta.up = new THREE.Vector3(0,0,-1);


    scene.add(planta);
    scene.add(camera);


    // camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 700 );
	// camera.position.set(0.5,300,300);
    // camera.lookAt(new THREE.Vector3(0,60,0));

    // cam = new THREE.OrthographicCamera(l,r,t,b,-300,300);
    // planta = cam.clone();
    // planta.position.set(0,200,0);
    // planta.lookAt(origen);
    // planta.up = new THREE.Vector3(0,0,-1);

    // scene.add(planta);
    // scene.add(camera);
}




function init(){
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    renderer.autoClear = false;
    document.getElementById("contenedor").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.noKeys = true;
    cameraControls.target.set( 0, 0, 0 );


    window.addEventListener('resize', updateAspectRatio );
    
}

function loadScene(){
    robot = new THREE.Object3D();

    var geometry = new THREE.PlaneGeometry( 1000,1000, 100,100 );
    var material = new THREE.MeshBasicMaterial({color:'red',wireframe:true});

    var plane = new THREE.Mesh( geometry, material );
    plane.lookAt(new THREE.Vector3(0, 10, 1));
    plane.rotation.x = -Math.PI/2;

    var Cilindrogeometry = new THREE.CylinderGeometry( 50,50, 15,100 );
    var Cilindromaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var base = new THREE.Mesh( Cilindrogeometry, Cilindromaterial );


    scene.add(plane);

    
    // scene.add(base);

    // Brazo del robot
    brazo = new THREE.Object3D();

    var ejegeometry = new THREE.CylinderGeometry( 20,20, 18,100 );
    var ejematerial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var eje = new THREE.Mesh( ejegeometry, ejematerial );

    var esparragogeometry = new THREE.BoxGeometry( 18,120,12 ,100);
    var esparragomaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var esparrago = new THREE.Mesh( esparragogeometry, esparragomaterial );
    esparrago.position.y = 48
    
    var esferageometry = new THREE.SphereGeometry(20 , 32,32 );
    var esferamaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var esfera = new THREE.Mesh( esferageometry, esferamaterial );
    esfera.position.y = 110
    

    

    antebrazo = new THREE.Object3D();

    var discogeometry = new THREE.CylinderGeometry( 22,22, 6,100 );
    var discomaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    disco = new THREE.Mesh( discogeometry, discomaterial );
    disco.position.y = 110

    nervios = new THREE.Object3D();
    var nerviosgeometry1 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry2 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry3 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry4 = new THREE.BoxGeometry( 4,80,4 ,100);


    var nerviosmaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var nerviosgeometry1 = new THREE.Mesh( nerviosgeometry1, nerviosmaterial );
    var nerviosgeometry2 = new THREE.Mesh( nerviosgeometry2, nerviosmaterial );
    var nerviosgeometry3 = new THREE.Mesh( nerviosgeometry3, nerviosmaterial );
    var nerviosgeometry4 = new THREE.Mesh( nerviosgeometry4, nerviosmaterial );
    nervios.position.y=50
    nerviosgeometry1.position.x = -10 //abajo izquierda
    nerviosgeometry1.position.z = 10

    nerviosgeometry2.position.x = -10
    nerviosgeometry2.position.x = -10
    
    nerviosgeometry3.position.x = 10
    
    nerviosgeometry4.position.x = 10
    nerviosgeometry4.position.z = 10
    nervios.add(nerviosgeometry1);
    nervios.add(nerviosgeometry2);
    nervios.add(nerviosgeometry3);
    nervios.add(nerviosgeometry4);
    var manogeometry = new THREE.CylinderGeometry( 15,15, 40,100 );
    var manomaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    mano = new THREE.Mesh( manogeometry, manomaterial );
    mano.position.y = 100
    mano.lookAt(new THREE.Vector3(1,0,0))

    
    
    
    // scene.add(antebrazo)

    //pinzas izquierda y derecha
    var geom = new THREE.Geometry();
    geom.vertices.push(
        //Primera Parte
        new THREE.Vector3(0,0,0), //0
        new THREE.Vector3(19,0,0), //1
        new THREE.Vector3(19,20,0), //2
        new THREE.Vector3(0,20,0), //3

        new THREE.Vector3(0,0,4),  //4
        new THREE.Vector3(19,0,4),//5
        new THREE.Vector3(19,20,4), //6
        new THREE.Vector3(0,20,4), //7
        //Segunda Parte
        new THREE.Vector3(19,0,0),  //8
        new THREE.Vector3(38,3,0),//9
        new THREE.Vector3(38,17,0), //10
        new THREE.Vector3(19,20,0), //11

        new THREE.Vector3(19,0,4),  //12
        new THREE.Vector3(38,3,2),//13
        new THREE.Vector3(38,17,2), //14
        new THREE.Vector3(19,20,4) //15


    )
    geom.faces.push(
        //cara delante
        new THREE.Face3(3,0,1),
        new THREE.Face3(3,1,2),
        //cara detrás
        new THREE.Face3(7,4,5),
        new THREE.Face3(7,5,6),
        //lado frente
        new THREE.Face3(2,5,6),
        new THREE.Face3(2,1,5),
        //lado atrás
        new THREE.Face3(3,4,7),
        new THREE.Face3(3,0,4),
        //lado arriba
        new THREE.Face3(3,6,7),
        new THREE.Face3(3,2,6),
        //lado abajo
        new THREE.Face3(0,5,4),
        new THREE.Face3(0,1,5),

        //Segunda Parte
        new THREE.Face3(11,9,10),
        new THREE.Face3(11,8,9),

        new THREE.Face3(15,12,13),
        new THREE.Face3(15,13,14),

        //lado enfrente
        new THREE.Face3(10,9,13),
        new THREE.Face3(10,13,14),
        //lado arriba
        new THREE.Face3(15,14,10),
        new THREE.Face3(15,10,11),

        //lado abajo
        new THREE.Face3(8,9,13),
        new THREE.Face3(8,13,12)
    );
    
    var material = new THREE.MeshBasicMaterial({color:'red',wireframe:true});
    pinzaIZQ = new THREE.Mesh(geom, material);
    pinzaDER = new THREE.Mesh(geom, material);
    // pinzaIZQ.position.z = 20
    // pinzaIZQ.rotation.y = 90 * Math.PI/180
    // pinzas = new THREE.Object3D();
    // pinzas.add(pinzaIZQ)
    // pinzas.add(pinzaDER)
    pinzaIZQ.position.x = 10
    pinzaDER.position.x = 10
    // pinzaIZQ.position.y = -10
    // pinzaDER.position.y = 10
    pinzaIZQ.position.z = 10
    pinzaDER.position.z = 10
    pinzaIZQ.rotation.z = 90 * Math.PI/180
    pinzaDER.rotation.z = 90 * Math.PI/180
    pinzaIZQ.rotation.x = 90 * Math.PI/180
    pinzaDER.rotation.x = 90 * Math.PI/180
    

    robot.add(base);
    brazo.add(eje);
    brazo.add(esparrago);
    brazo.add(esfera);
    robot.add(brazo)

    disco.add(nervios)
    disco.add(mano)

    antebrazo.add(disco)
    brazo.add(antebrazo)
    mano.add(pinzaIZQ)
    mano.add(pinzaDER)

    scene.add(robot)
    
}

function setupGui(){
    
    effectController = {
		GiroBa: 0,
        GiroBr: 0,
        GiroAY: 0,
        GiroAZ: 0,
        GiroP: 0,
        SepPinza: 0,
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control Robot");
	h.add(effectController, "GiroBa", -180, 180, 0.5).name("Giro Base");
	h.add(effectController, "GiroBr", -45, 45, 0.5).name("Giro Brazo");
	h.add(effectController, "GiroAY", -180, 180, 0.5).name("Giro Antebrazo Y");
    h.add(effectController, "GiroAZ", -90, 90, 0.5).name("Giro Antebrazo Z");
    h.add(effectController, "GiroP", -40, 220, 0.5).name("Giro Pinza");
    h.add(effectController, "SepPinza", 0, 15, 0.5).name("Separación Pinza");
}

function keyboardmove(){
    var keyboard	= new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    updateFcts.push(function(delta, now){
		if( keyboard.pressed('left') ){
            // planta.position.x -= Speed; 
			robot.position.x -= Speed;			
		}else if( keyboard.pressed('right') ){
            robot.position.x += Speed;
            // planta.position.x += Speed;
		}
		if( keyboard.pressed('down') ){
            robot.position.z += Speed;
            // planta.position.z += Speed;		
		}else if( keyboard.pressed('up') ){
            robot.position.z -= Speed;
            // planta.position.z -= Speed;		
		}
    })
    
    updateFcts.push(function(){
        renderer.domElement.setAttribute("tabIndex", "0");
        renderer.domElement.focus();
		renderer.render( scene, camera );		
	})
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  if(aspectratio>1){
    planta.left = l * aspectratio;
    planta.right = r * aspectratio;
    planta.top = t;
    planta.bottom = b;
    }
    else{
        planta.left = l;
        planta.right = r;
        planta.top = t/aspectratio;
        planta.bottom = b/aspectratio;    
    }

  camera.updateProjectionMatrix();
  planta.updateProjectionMatrix();
}


function update() {
    robot.rotation.y = (Math.PI*effectController.GiroBa) / 180.0;
    brazo.rotation.z = (Math.PI*effectController.GiroBr) / 180.0;
    antebrazo.rotation.y = (Math.PI*effectController.GiroAY) / 180.0;
    disco.rotation.z = (Math.PI*effectController.GiroAZ) / 180.0;
    mano.rotation.x = (Math.PI*-effectController.GiroP) / 180.0;
    pinzaIZQ.position.y = 12 + effectController.SepPinza/2;
    pinzaDER.position.y = -9 +-(effectController.SepPinza/2);
    updateFcts.forEach(function(updateFn){
        updateFn(100,100)
    })
    
}


function render() {
    requestAnimationFrame(render);
    update();
    renderer.clear();
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);
    renderer.clearDepth();
    if(window.innerHeight > window.innerWidth){
        var dim = window.innerWidth/4

    }else{
        var dim = window.innerHeight/4
    }
    renderer.setViewport(0,0,dim,dim);
    renderer.render(scene,planta);    
}
