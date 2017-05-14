# shaderback.js
Shader-generated backgrounds for the Web.

Shaderback.js is a really simple javascript library that allows animated backgrounds to be added to HTML5 Web pages. The backgrounds are generated using shaders, and should work on any WebGL compatible device with a suitably powerful GPU.

## Examples

You can see some examples of Shaderback.js usage here:

1. My website with a simple background: [http://www.flypig.co.uk](http://www.flypig.co.uk)
1. impress.js [presentation slides](http://www.flypig.co.uk/shaders/presentation/)
1. Shaderback.js [testing page](http://www.flypig.co.uk/shaders/test.html).

The code for these is in the examples folder.

## Usage

Simply add the following code inside the header of the webpage you want the background on.

```JavaScript
<script type="text/javascript" src="shaderback.js"></script>
<script type="text/javascript">
window.onload = shaderback.loadURL("shader.txt");
</script>
```
Where `shader.txt` is the URL of the fragment shader file on your webserver.

Alternatively, you can include the shader code in a script element on your page, and tell shaderback.js to use this instead by passing the ID of the script:

```JavaScript
<script id="shader-id" type="x-shader/x-fragment">
	precision highp float;

	varying vec2 fragCoord;
	uniform float iGlobalTime;
	uniform vec3 iResolution;

	void main(void) {
		// The actual shader code goes here
		// See the example folder for some examples 
		float line = (iResolution.x * (0.5 - fragCoord.x)) * sin(0.8 + (iGlobalTime / 30000.0));
		line -= (iResolution.y * (0.5 - fragCoord.y)) * cos(0.8 + (iGlobalTime / 30000.0));
		float cycle = (1.0 + sin(line)) / 2.0;

		vec4 colour = (cycle * vec4(0.6, 0.6, 0.6, 1.0)) + ((1.0 - cycle) * vec4(0.9, 0.9, 0.9, 1.0));
		gl_FragColor = colour;
	}
</script>

<script type="text/javascript" src="shaderback.js"></script>
<script type="text/javascript">
window.onload = shaderback.loaddiv("shader-id");
</script>
```
In this second case `shader-id` is the element ID of the script tag containing the fragment shader code.

Finally, if you have your shader code stored as a string, you can use:

```JavaScript
<script type="text/javascript" src="shaderback.js"></script>
<script type="text/javascript">
window.onload = shaderback.loadtext(text);
</script>
```
Where `text` is a string containing the fragment shader code.

## Shader Inputs/Outputs

When creating a fragment shader for use with shaderback.js, you need to include three variables to accept state values, as detailed below. The output colour of the current fragment is returned in `gl_FragColor` as usual.

These values are compatible with [Shadertoy](https://www.shadertoy.com/), although at present we don't support all of the [Shadertoy](https://www.shadertoy.com/) inputs (e.g. no channels, mouse position, etc.).

### Inputs

`uniform highp float iGlobalTime`

Current time in seconds since midnight January 1, 1970 (GMT), modulo 18000. The use of world time allows synchronisation across separate instances. The modulo is to avoid float overflow/innacuracy errors and essentially means the time will loop back to zero every 5 hours.

`uniform vec3 iResolution`

Viewport resolution, with x, y being width and height respectively, and z being the pixel aspect ratio (currently always 1). Note that the height and width will be half the pixel resolution of the current visible body area of the page (since the resultion is set to half this for performance reasons).

`varying vec2 fragCoord`

Coordinate of the current fragment to be rendered. The x and y values will be in the range [0, iResolution.x) and [0, iResolution.y) respectively. If you want to convert them to texture uv coordinates in the range [0, 1), simply dividte by iResolution.xy.

`uniform vec2 iScroll`

Viewport scroll, with x, y being the horizontal and vertical scroll respectively. These are normalised values between 0 and 1, which can be scaled up by iResolution to give pixel values. This variable can be useful if, for example, you want the shader to scroll with the window, since the default behaviour is for it to be fixed.

### Outputs

`gl_FragColor`

Use this to output the colour of the current fragment. The alpha channel is used to blend with the background of thee page. All colour values are in the range [0, 1], including alpha.

## Error Handling

By default shaderback.js will skip any errors (whether from WebGL, Javascript or the shader code) and silently deactivate itself. This is important for production sites, since not all browsers or machines will support GPU rendering. End users shouldn't be presented with errors, and sites should cleanly degrade if the capabilities aren't supported.

However, during development it can be helpful to receive error notifications. To this end, you can turn on error messages with the `setDebug(active)` method. Ensure you call it before attempting to load your shader, as follows:

```JavaScript
shaderback.setDebug(true);
window.onload = shaderback.loadURL("shader.txt");
```

## Compatibility

It's been tested on the following browsers, and seems to work fine on all of them:

1. Firefox 36.01 under Linux and Windows
1. Chrome 41.something on Windows
1. Chromium 41.something on Linux
1. IE 11 on Windows
1. Jolla Sailfish browser 1.0 (Mozilla based) 
1. Android 4.4.2 Chrome 40.something

However, it's only been tested in pretty limited circumstances (only on a few Web pages), so don't expect too much of it.

## Licence

Shaderback.js is released under an MIT License. See the LICENSE file for the full details.

## Contact and Links

More information will eventually be added to: http://www.flypig.co.uk/?to=shaderback

The source code can be obtained from GitHub: https://github.com/llewelld/shaderback.js

I can be contacted via one of the following.

 * Website: http://www.flypig.co.uk
 * Email: david@flypig.co.uk

