precision highp float;

#define M_PI 3.1415926535897932384626433832795
varying vec2 fragCoord;
uniform float iGlobalTime;
uniform vec3 iResolution;

// (((((x - xc1)**2) + ((y - yc1)**2) - (r1**2)) * (((x - xc2)**2) + ((y - yc2)**2) - (r2**2)))) < (s / 1000)

void main(void) {
	const float stickiness = 0.001;
	const float r1 = 0.15;
	const float r2 = 0.15;
	const float r3 = 0.15;
	vec2 ratio = vec2(iResolution.x, iResolution.y) / iResolution.x;
	vec2 pos1 = vec2((1.0 + sin(iGlobalTime / 9.000)) / 2.0, (1.0 + sin(iGlobalTime / 7.1000)) / 2.0) * ratio;
	vec2 pos2 = vec2((1.0 + sin(iGlobalTime / 8.900)) / 2.0, (1.0 + sin(iGlobalTime / 10.400)) / 2.0) * ratio;
	vec2 pos3 = vec2((1.0 + sin(iGlobalTime / 9.650)) / 2.0, (1.0 + sin(iGlobalTime / 91.500)) / 2.0) * ratio;
	vec2 pos = fragCoord * ratio / iResolution.xy;

	float d1 = pow((pos.x - pos1.x), 2.0) + pow((pos.y - pos1.y), 2.0) - pow(r1, 2.0);
	float d2 = pow((pos.x - pos2.x), 2.0) + pow((pos.y - pos2.y), 2.0) - pow(r2, 2.0);
	float d3 = pow((pos.x - pos3.x), 2.0) + pow((pos.y - pos3.y), 2.0) - pow(r3, 2.0);

	float distance = d1 * d2 * d3;
	vec4 colour = vec4(0.8, 0.8, 0.8, 1.0);
	
	if (distance < stickiness) {
		colour = vec4(1.0, 0.6, 0.6, 1.0);
	}

	gl_FragColor = colour;
}

