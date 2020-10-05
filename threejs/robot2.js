// Práctica 2 - GPC 
// suelo 1000x 1000
// Robot Compuesto por: base, brazo, antebrazo, pinza

// // Práctica GPC #3 cámara arriba a la izquierda
// // Dibujar formas basicas con animacion


// variables imprscindibles 
var renderer, scene, camera;
var r = t = 4;
var l = b = -r;
var esferacubo, angulo = 0;
var esfera, cubo
init();
loadScene();
render();



function setCameras(ar){
    var origen = new THREE.Vector3(0,0,0);
    // Perspectiva
    camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 700 );
	camera.position.set(0.5,200,300);
    camera.lookAt(new THREE.Vector3(0,0,-50));

    planta = camera.clone();
    planta.position.set(0,280,0);
    planta.lookAt(origen);
    planta.up = new THREE.Vector3(0,0,-1);


    scene.add(planta);
    scene.add(camera);
}




function init(){

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    renderer.autoClear = false;
    document.getElementById("contenedor").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.noKeys = true;
    cameraControls.target.set( 0, 0, 0 );

    window.addEventListener('resize', updateAspectRatio );    
    
}

function loadScene(){
    var geometry = new THREE.PlaneGeometry( 1000,1000, 100,100 );
    var material = new THREE.MeshBasicMaterial({color:'red',wireframe:true});
    var plane = new THREE.Mesh( geometry, material );
    plane.lookAt(new THREE.Vector3(0, 10, 1));
  
    var Cilindrogeometry = new THREE.CylinderGeometry( 50,50, 15,100 );
    var Cilindromaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var base = new THREE.Mesh( Cilindrogeometry, Cilindromaterial );


    scene.add(plane);
    scene.add(base);

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
    

    brazo.add(eje);
    brazo.add(esparrago);
    brazo.add(esfera);
    scene.add(brazo);
    //antebrazo del robot

    antebrazo = new THREE.Object3D();

    var discogeometry = new THREE.CylinderGeometry( 22,22, 6,100 );
    var discomaterial = new THREE.MeshBasicMaterial( {color:'red',wireframe:true} );
    var disco = new THREE.Mesh( discogeometry, discomaterial );
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
    nervios.position.y=150
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
    var mano = new THREE.Mesh( manogeometry, manomaterial );
    mano.position.y = 190
    mano.lookAt(new THREE.Vector3(1,0,0))


    antebrazo.add(disco)
    antebrazo.add(nervios)
    antebrazo.add(mano)
    scene.add(antebrazo)

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
    var pinzaIZQ = new THREE.Mesh(geom, material);
    var pinzaDER = new THREE.Mesh(geom, material);
    pinzaIZQ.position.z = 20
    // pinzaIZQ.rotation.y = 90 * Math.PI/180
    pinzas = new THREE.Object3D();
    pinzas.add(pinzaIZQ)
    pinzas.add(pinzaDER)
    
    pinzas.position.y = 180
    pinzas.position.x = -10
    pinzas.rotation.y = 90 * Math.PI/180
    scene.add(new THREE.AxisHelper(3))
    scene.add(pinzas)
    
}
function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  if(ar>1){
    planta.left = l * ar;
    planta.right = r * ar;
    planta.top = t;
    planta.bottom = b;
    }
    else{
        planta.left = l;
        planta.right = r;
        planta.top = t/ar;
        planta.bottom = b/ar;    
    }

  camera.updateProjectionMatrix();
  planta.updateProjectionMatrix();
}


function update() {
}


function render() {
    //dibujar cada frame
    requestAnimationFrame(render);
    update();
    renderer.clear();
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);
    var dim = window.innerHeight/4
    renderer.setViewport(0,0,dim,dim);
    renderer.render(scene,planta);
    
}
