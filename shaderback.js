var canvas;
var loaded = false;
var gl;
var shaderProgram;
var squareVertexPositionBuffer;
var squareVertexTextureCoordBuffer;
var pixelScale = 2.0;

var vsCode = ""
	+ "	attribute vec3 aVertexPosition;"
	+ "	attribute vec2 aTextureCoord;"
	+ ""
	+ "	varying vec2 vTextureCoord;"
	+ ""
	+ "	void main(void) {"
	+ "		vTextureCoord = aTextureCoord;"
	+ "		gl_Position = vec4(aVertexPosition, 1.0);"
	+ "	}"
	+ "";
var fsCode;
var running = false;

function shaderback_loadURL(url) {
	var client = new XMLHttpRequest();
	client.open('GET', url);
	client.overrideMimeType("text/plain; charset=x-user-defined");
	client.onloadend = function() {
		fsCode = client.responseText;
		start();
	}
	client.send();
}

function shaderback_loaddiv(id) {
	fsCode = getShaderScript(gl, id);
	start();
}

function shaderback_loadtext(text) {
	fsCode = text;
	start();
}

function ready() {
	var div = document.createElement('div');
	div.innerHTML = '<canvas class="shaderback" id="shaderback" width="500px" height="500px" style="width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: -1;"></canvas>';
	var elements = div.childNodes[0];
	document.getElementsByTagName('body')[0].appendChild(elements);
	canvas = document.getElementById("shaderback");
	window.onresize = resize;
};

function resize () {
	var width = canvas.clientWidth / pixelScale;
	var height = canvas.clientHeight / pixelScale;
	if (canvas.width != width || canvas.height != height) {
		canvas.width = width;
		canvas.height = height;
		canvas.style.height = window.innerHeight + "px";
	}
}

function start () {
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

window.requestAnimFrame = (function() {
return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
		window.setTimeout(callback, 1000/60);
	};
})();

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
		// Fail silently
	}
}

function getShaderScript(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	return str;
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

	shaderProgram.timeUniform = gl.getUniformLocation(shaderProgram, "time");
	shaderProgram.widthUniform = gl.getUniformLocation(shaderProgram, "width");
	shaderProgram.heightUniform = gl.getUniformLocation(shaderProgram, "height");
}

function initBuffers() {
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	vertices = [
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

function drawScene() {
	var timeNow = new Date().valueOf();
	requestAnimFrame(drawScene);

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.uniform1f(shaderProgram.timeUniform, timeNow % 36000000);
	gl.uniform1f(shaderProgram.widthUniform, canvas.clientWidth);
	gl.uniform1f(shaderProgram.heightUniform, canvas.clientHeight);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

