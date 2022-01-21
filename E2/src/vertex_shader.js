/************FORMA 2****************************/
var VSHADER_CODE = `

uniform float time;
uniform float angular_velocity;
uniform float amplitude;
uniform float lost_factor;
uniform int is_sphere;
`
var VSHADER_MAIN = `
  	vec3 newPosition = position;

	if(is_sphere == 0) {
		float from_origin = sqrt(position.x * position.x + position.z * position.z);

		float distance = amplitude * exp(-1.0 * lost_factor * from_origin * time) * cos(angular_velocity * (time - (from_origin / 10.0)));	
		newPosition.y = position.y + distance;
	}

	else {
		newPosition.y = position.y - 10.0 * time; 
	}



	mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
`;

/************FORMA 1****************************/
/*var VSHADER_SOURCE = `

varying vec3 vViewPosition;
varying vec3 vNormal;
uniform float time;
uniform float angular_velocity;
uniform float amplitude;
uniform float lost_factor;

uniform int is_sphere;

void main()
{
  	vec3 newPosition = position;

	if(is_sphere == 0) {
		float from_origin = sqrt(position.x * position.x + position.z * position.z);

		float distance = amplitude * exp(-1.0 * lost_factor * from_origin * time) * cos(angular_velocity * (time - (from_origin / 10.0)));	
		newPosition.y = position.y + distance;
	}

	else {
		newPosition.y = position.y - 10.0 * time; 
	}



	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
	vViewPosition = mvPosition.xyz;
	gl_Position = projectionMatrix * mvPosition;
	vNormal = normalMatrix * normal; 
}
`;
*/