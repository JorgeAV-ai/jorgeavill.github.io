//shader de vertices
var VSHADER_SOURCE = 
"precision mediump float;                                       \n" +

"attribute vec4 posicion;                                       \n" +
"varying vec4 color;                                            \n" +

"void main() {                                                  \n" +
" gl_Position = posicion;                                       \n" +
" float i = sqrt(pow(posicion[0], 2.0)+pow(posicion[1], 2.0));  \n" +
" color = vec4(1.0-i, 1.0-i, 1.0-i, 1.0);                       \n" +
" gl_PointSize = 10.0;                                          \n" +
"}                                                              \n"

var FSHADER_SOURCE = 
"precision mediump float; \n" +

"varying vec4 color;      \n" +

"void main() {            \n" +
" gl_FragColor = color;   \n" +
"}                        \n"

function main() {
  var canvas = document.getElementById("canvas")
  if(!canvas) {
    console.log("Fallo al cargar el canvas")
    return
  }

  var gl = getWebGLContext(canvas)
  if(!gl) {
    console.log("Fallo al cargar el contexto")
    return
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Fallo al cargar los shaders")
    return
  }

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  var coords = gl.getAttribLocation(gl.program, "posicion")

  canvas.onmousedown = e => { click(e, gl, canvas, coords) }
}

var clicks = []

function click(e, gl, canvas, coords) {
  var x = e.clientX
  var y = e.clientY
  var rect = canvas.getBoundingClientRect()

  x = ((x-rect.left) - canvas.width/2) * 2/canvas.width
  y = (canvas.height/2 - (y-rect.top)) * 2/canvas.height

  clicks.push(x)
  clicks.push(y)
  clicks.push(0) //?

  var puntos = new Float32Array(clicks)
  gl.clear(gl.COLOR_BUFFER_BIT)

  var buffer = gl.createBuffer() //Creo buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer) //Bindeo el tipo de buffer
  gl.bufferData(gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW) //Asocio los puntos con el Buffer
  gl.vertexAttribPointer(coords, 3.0, gl.FLOAT, false, 0.0, 0.0) //?
  gl.enableVertexAttribArray(coords)
  gl.drawArrays(gl.POINTS, 0.0, puntos.length/3) //Dibujo un punto en la posicion X,y
  gl.drawArrays(gl.LINE_STRIP, 0.0, puntos.length/3) //Dibujo un punto en la posicion X,y (un line_strip)
}