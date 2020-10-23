// // Práctica GPC #5
//  Texturas e Iluminación. 

// variables imprscindibles 
var renderer, scene, camera;
var aspectratio;
var keyboardmove;
var r = t = 60;
var l = b = -r;
var robot, base, antebrazo, pinzas,mano, pinzaIZQ, pinzaDER,disco;
var Speed = 0.1;
var updateFcts	= [];
var path = "images/";


init();
loadScene();
setupGui();
keyboardmove()
render();



function setCameras(ar){
    var origen = new THREE.Vector3(0,0,0);
    // Perspectiva
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
}



function init(){
    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    document.getElementById("contenedor").appendChild(renderer.domElement);
    
    // ------------Scene------------ 
    scene = new THREE.Scene();


    //------------Cameras------------
    aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);
    //-------------Control Camera-----------
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.noKeys = true;
    cameraControls.target.set( 0, 0, 0 );

    //----------Lights------------
	var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.2);
	scene.add( luzAmbiente );

	var luzPuntual = new THREE.PointLight(0xFFFFFF,0.5);
	luzPuntual.position.set( -10, 60, -10 );
	scene.add( luzPuntual );

	var luzFocal = new THREE.SpotLight(0xFFFFFF,0.5);
	luzFocal.position.set( 10,400,10 );
	luzFocal.target.position.set(0,0,0);
	luzFocal.angle = Math.PI/5;
    luzFocal.penumbra = 0.2;
    luzFocal.shadow.camera.far = 4000;
	luzFocal.castShadow = true;
	scene.add(luzFocal);

    // ------------EventsHandler---------------
    window.addEventListener('resize', updateAspectRatio );
    
}

function loadScene(){


    // ------------Textures-------------
    var paredes = [ path+'posx.jpg',path+'negx.jpg',
        path+'posy.jpg',path+'negy.jpg',
        path+'posz.jpg',path+'negz.jpg'
    ];

    var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
    mapaEntorno.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;

    var matparedes = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		dephtWrite: false,
		side: THREE.BackSide
	});

    esferamaterial = new THREE.MeshPhongMaterial({color:'white', specular:'white', shininess: 50, envMap:mapaEntorno });

    // ----------Habitación---------------
	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(1000,1000,1000),matparedes);
	scene.add(habitacion);


    //------------INICIALIZACIÓN ROBOT------------------
    robot = new THREE.Object3D();

    //---------PLANO--------
    var geometry = new THREE.PlaneGeometry( 1000,1000, 100,100 );
    var texturaplano = new THREE.TextureLoader().load(path+'pisometalico_1024.jpg');
    texturaplano.magFilter = THREE.LinearFilter;
	texturaplano.minFilter = THREE.LinearFilter;
	texturaplano.repeat.set(3,2);
	texturaplano.wrapS = texturaplano.wrapT = THREE.MirroredRepeatWrapping;
    var materialplano = new THREE.MeshLambertMaterial({ map:texturaplano});
    var plane = new THREE.Mesh( geometry, materialplano );
    plane.lookAt(new THREE.Vector3(0, 10, 1));
    plane.rotation.x = -Math.PI/2;
    plane.receiveShadow=true;

    //---------BASE--------------
    var texturacilindro = new THREE.TextureLoader().load(path+'metal_128x128.jpg');
    var materialCilindroLamb = new THREE.MeshLambertMaterial({ map:texturacilindro});
    var Cilindrogeometry = new THREE.CylinderGeometry( 50,50, 15,100 );
    var base = new THREE.Mesh( Cilindrogeometry, materialCilindroLamb );
    base.castShadow=true;
    base.receiveShadow=true;


    //-------BRAZO---------
    brazo = new THREE.Object3D();
    
        //-----------EJE--------
    var ejegeometry = new THREE.CylinderGeometry( 20,20, 18,100 );
    var eje = new THREE.Mesh( ejegeometry, materialCilindroLamb );
    eje.rotation.z = 90*Math.PI /180;
    eje.rotation.y = 90*Math.PI /180;
    eje.receiveShadow = true;
    eje.castShadow = true;

        //------------ESPÁRRAGO---------
    var esparragogeometry = new THREE.BoxGeometry( 18,120,12 ,100);
    var esparrago = new THREE.Mesh( esparragogeometry, materialCilindroLamb );
    esparrago.position.y = 48
    esparrago.receiveShadow = true;
    esparrago.castShadow = true;

        //-------------RÓTULA----------
    var esferageometry = new THREE.SphereGeometry(20 , 32,32 )
    var esfera = new THREE.Mesh( esferageometry, esferamaterial );
    esfera.position.y = 110
    esfera.receiveShadow = true;
    esfera.castShadow = true;

    
    //---------ANTEBRAZO-----------
    antebrazo = new THREE.Object3D();

        //---------Disco-------------
    var discogeometry = new THREE.CylinderGeometry( 22,22, 6,100 );
    var texturamadera = new THREE.TextureLoader().load(path+'wood512.jpg');
    var discomaterial = new THREE.MeshLambertMaterial({map:texturamadera} );
    disco = new THREE.Mesh( discogeometry, discomaterial );
    disco.position.y = 110
    disco.castShadow = true;
    disco.receiveShadow = true;
    
                                                        

        //--------Nervios---------
    nervios = new THREE.Object3D();
    var nerviosgeometry1 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry2 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry3 = new THREE.BoxGeometry( 4,80,4 ,100);
    var nerviosgeometry4 = new THREE.BoxGeometry( 4,80,4 ,100);
    

    var nerviosmaterial = new THREE.MeshLambertMaterial({map:texturamadera} );
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
    nerviosgeometry1.castShadow = true;
    nerviosgeometry2.castShadow = true;
    nerviosgeometry3.castShadow = true;
    nerviosgeometry4.castShadow = true;
    nerviosgeometry1.receiveShadow = true;
    nerviosgeometry2.receiveShadow = true;
    nerviosgeometry3.receiveShadow = true;
    nerviosgeometry4.receiveShadow = true;


    nervios.add(nerviosgeometry1);
    nervios.add(nerviosgeometry2);
    nervios.add(nerviosgeometry3);
    nervios.add(nerviosgeometry4);
    
    //--------------MANO---------
    var manogeometry = new THREE.CylinderGeometry( 15,15, 40,100 );
    var manomaterial = new THREE.MeshLambertMaterial({map:texturamadera} );
    mano = new THREE.Mesh( manogeometry, manomaterial );
    mano.position.y = 100
    mano.castShadow = true;
    mano.receiveShadow = true;
    mano.lookAt(new THREE.Vector3(1,0,0))

    
    //------------PINZAS----------
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
    geom.computeFaceNormals()
    var matPinza = new THREE.MeshLambertMaterial({
        color:0xA9A9A9,
        wireframe:false,
        side: THREE.DoubleSide
});
    pinzaIZQ = new THREE.Mesh(geom, matPinza);
    pinzaDER = new THREE.Mesh(geom, matPinza);
    pinzaIZQ.position.x = 10
    pinzaDER.position.x = 10
    pinzaIZQ.position.z = 10
    pinzaDER.position.z = 10
    pinzaIZQ.rotation.z = 90 * Math.PI/180
    pinzaDER.rotation.z = 90 * Math.PI/180
    pinzaIZQ.rotation.x = 90 * Math.PI/180
    pinzaDER.rotation.x = 90 * Math.PI/180
    pinzaDER.castShadow=true;
    pinzaIZQ.castShadow=true;
    pinzaDER.receiveShadow=true;
    pinzaIZQ.receiveShadow=true;
    

    //------JUNTAR_PIEZAS---------
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

    scene.add(plane);
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
            planta.position.x -= Speed; 
			robot.position.x -= Speed;			
		}else if( keyboard.pressed('right') ){
            robot.position.x += Speed;
            planta.position.x += Speed;
		}
		if( keyboard.pressed('down') ){
            robot.position.z += Speed;
            planta.position.z += Speed;		
		}else if( keyboard.pressed('up') ){
            robot.position.z -= Speed;
            planta.position.z -= Speed;		
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
