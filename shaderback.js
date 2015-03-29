/***************************************************************************
 * shaderback.js
 * Shader-generated backgrounds for the web
 * http://www.flypig.co.uk/shaderback
 * 
 * David Llewellyn-Jones <david@flypig.co.uk>
 * Version 0.03
 * 29th March 2015
 * 
 * Copyright (c) 2015 David Llewellyn-Jones
 * Released under the MIT license
 * 
***************************************************************************/

/***************************************************************************
 * To use, just add the following uncommented code to your HTML header
 * 
 *   <script type="text/javascript" src="shaderback.js"></script>
 *   <script type="text/javascript">
 *   window.onload = shaderback.loadURL("shader.txt"));
 *   </script>
 * 
 * Where shader.txt is the URL of your fragment shader
 * 
 * You can also use loaddiv and loadtext rather than loadURL if your shader
 * code is contained inside a script element or text variable respectively.
 * 
***************************************************************************/

var shaderback = (function () {
  "use strict";

  var canvas;
  var gl;
  var shaderProgram;
  var squareVertexPositionBuffer;
  var squareVertexTextureCoordBuffer;
  var pixelScale = 2.0;
  var running = false;

  var vsCode = "\n"
    + "  precision mediump float;\n"
    + "\n"
    + "  attribute vec3 aVertexPosition;\n"
    + "  attribute vec2 aTextureCoord;\n"
    + "\n"
    + "  uniform vec3 iResolution;\n"
    + "  varying vec2 fragCoord;\n"
    + "\n"
    + "  void main(void) {\n"
    + "    fragCoord = aTextureCoord * iResolution.xy;\n"
    + "    gl_Position = vec4(aVertexPosition, 1.0);\n"
    + "  }\n"
    + "\n";
  var fsCode;

  function resize() {
    var width = canvas.clientWidth / pixelScale;
    var height = canvas.clientHeight / pixelScale;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.height = window.innerHeight + "px";
    }
  }

  function ready() {
    var div = document.createElement('div');
    div.innerHTML = '<canvas class="shaderback" id="shaderback" width="500px" height="500px" style="width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: -1;"></canvas>';
    var elements = div.childNodes[0];
    document.getElementsByTagName('body')[0].appendChild(elements);
    canvas = document.getElementById("shaderback");
    window.onresize = resize;
  }

  function initGL(canvas) {
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (ignore) {
      // Fail silently
    }
  }

  // Type should be either gl.FRAGMENT_SHADER or gl.VERTEX_SHADER
  function compileShader(str, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  function initShaders() {
    var fragmentShader = compileShader(fsCode, gl.FRAGMENT_SHADER);
    var vertexShader = compileShader(vsCode, gl.VERTEX_SHADER);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.iGlobalTime = gl.getUniformLocation(shaderProgram, "iGlobalTime");
    shaderProgram.iResolution = gl.getUniformLocation(shaderProgram, "iResolution");
  }

  function initBuffers() {
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [
      1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
      1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;

    squareVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
    var textureCoords = [
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    squareVertexTextureCoordBuffer.itemSize = 2;
    squareVertexTextureCoordBuffer.numItems = 4;
  }

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function drawScene() {
    var timeNow = new Date().valueOf() / 1000.0;
    requestAnimFrame(drawScene);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(shaderProgram.iGlobalTime, timeNow % 18000);

    gl.uniform3f(shaderProgram.iResolution, canvas.clientWidth, canvas.clientHeight, 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
  }

  function start() {
    if (!running) {
      running = true;
      ready();
      resize();
      initGL(canvas);
      initShaders();
      initBuffers();
      drawScene();
    }
    else {
      initShaders();
    }
  }

  function getShaderScript(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType === 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }
    return str;
  }

  function loadURL(url) {
    if (url) {
      var client = new XMLHttpRequest();
      client.open('GET', url);
      client.overrideMimeType("text/plain; charset=x-user-defined");
      client.onloadend = function () {
        fsCode = client.responseText;
        start();
      };
      client.send();
    }
  }

  function loaddiv(id) {
    fsCode = getShaderScript(id);
    start();
  }

  function loadtext(text) {
    fsCode = text;
    start();
  }

  return {
    loadURL : loadURL,
    loaddiv : loaddiv,
    loadtext : loadtext
  };
}());

