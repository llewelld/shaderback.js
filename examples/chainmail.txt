precision highp float;

#define M_PI 3.1415926535897932384626433832795
varying vec2 fragCoord;
uniform float iGlobalTime;
uniform vec3 iResolution;

// (((((x - xc1)**2) + ((y - yc1)**2) - (r1**2)) * (((x - xc2)**2) + ((y - yc2)**2) - (r2**2)))) < (s / 1000)

void main(void) {
	vec2 ratio = vec2(iResolution.x, iResolution.y) / iResolution.x;
	vec2 pos = fragCoord * ratio / iResolution.xy;
	float scale = (2.0 + sin(iGlobalTime / 5.0)) / 5.0;
	pos += vec2(sin(iGlobalTime / 2.5), sin(iGlobalTime / 2.65)) * 0.1;

	float radius1 = distance(vec2(mod(pos.x + 0.1 * sin(iGlobalTime / 2.0), 0.2 * scale), mod(pos.y + 0.1 * cos(iGlobalTime / 2.0), 0.2 * scale)), vec2(0.1 * scale, 0.1 * scale));
	float radius2 = distance(vec2(mod(0.1 + pos.x + 0.1 * sin(iGlobalTime / 3.1), 0.2 * scale), mod(0.1 + pos.y + 0.1 * cos(iGlobalTime / 3.1), 0.2 * scale)), vec2(0.1 * scale, 0.1 * scale));
	float radius3 = distance(vec2(mod(0.1 + pos.x + 0.1 * sin(-iGlobalTime / 2.8), 0.2 * scale), mod(0.1 + pos.y + 0.1 * cos(-iGlobalTime / 2.8), 0.2 * scale)), vec2(0.1 * scale, 0.1 * scale));
	float red = 0.0;
	float green = 0.0;
	float blue = 0.0;
	if ((radius1 < 0.09 * scale) && (radius1 > 0.06 * scale)) {
		green = 1.0;
	}
	if ((radius2 < 0.09 * scale) && (radius2 > 0.06 * scale)) {
		red = 1.0;
	}
	if ((radius3 < 0.09 * scale) && (radius3 > 0.06 * scale)) {
		blue = 1.0;
	}
	



	vec4 colour = vec4(red, green, blue, 1.0);
	

	gl_FragColor = colour;
}

