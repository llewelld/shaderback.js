precision highp float;

#define M_PI 3.1415926535897932384626433832795
varying vec2 fragCoord;
uniform float iGlobalTime;
uniform vec3 iResolution;

// (((((x - xc1)**2) + ((y - yc1)**2) - (r1**2)) * (((x - xc2)**2) + ((y - yc2)**2) - (r2**2)))) < (s / 1000)

void main(void) {
	vec2 ratio = vec2(iResolution.x, iResolution.y) / iResolution.x;
	vec2 pos = fragCoord * ratio / iResolution.xy;
	float scale = (3.0 + sin(iGlobalTime / 25.0)) / 5.0;
	pos += vec2(sin(iGlobalTime / 3.5), sin(iGlobalTime / 3.65)) * 0.1;
	vec2 centre = vec2(0.1 * scale, 0.1 * scale);

	float radius1 = distance(vec2(mod(sin(sin((0.5 * M_PI * pos.y) + iGlobalTime / 3.8) + pos.x * M_PI), 0.2 * scale),
		mod(sin(cos((0.5 * M_PI * pos.x) + iGlobalTime / 4.1) + pos.y * M_PI), 0.2 * scale)), centre);

	float angle1 = atan (pos.x - 0.5, pos.y - 0.5);

	float angle2 = atan (mod(sin(sin((0.5 * M_PI * pos.y) + iGlobalTime / 3.8) + pos.x * M_PI), 0.2 * scale) - centre.x, 
		mod(sin(cos((0.5 * M_PI * pos.x) + iGlobalTime / 4.1) + pos.y * M_PI), 0.2 * scale) - centre.y);

	float red = 0.0;
	float green = 0.0;
	float blue = 0.0;
	if ((radius1 < 0.09 * scale) && (radius1 > 0.06 * scale)) {
		red = 1.0 - (sin ((iGlobalTime / 3.3) + angle2 * 3.0) + 1.0) / 3.0;
		green = (sin ((iGlobalTime / 3.2) + angle2 * 3.0) + 1.0) / 2.0;
		blue = (sin ((iGlobalTime / 3.2) + angle1 * 3.0) + 1.0) / 2.0;
	}
	else {
		red = 1.0;
		green = 1.0;
		blue = 0.5;

		vec2 shadow = vec2(+0.005, -0.005);
		float radius1 = distance(vec2(mod(sin(sin((0.5 * M_PI * (pos.y - shadow.y)) + iGlobalTime / 3.8) + (pos.x - shadow.x) * M_PI), 0.2 * scale),
		mod(sin(cos((0.5 * M_PI * (pos.x - shadow.x)) + iGlobalTime / 4.1) + (pos.y - shadow.y) * M_PI), 0.2 * scale)), centre);

		if ((radius1 < 0.09 * scale) && (radius1 > 0.06 * scale)) {
			float darkness = cos(M_PI * (((radius1 / scale) - 0.075) / 0.03));
			red = 1.0 - 0.5 * darkness;
			green = 1.0 - 0.5 * darkness;
			blue = 0.5 - 0.5 * darkness;
		}

	}

	vec4 colour = vec4(red, green, blue, 1.0);

	gl_FragColor = colour;
}

