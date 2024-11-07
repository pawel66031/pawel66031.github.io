const Wall_VertexShader = `
varying vec4 vPos;
varying vec2 v_uv;

void main() {
     v_uv = uv;
     vPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
     gl_Position = vPos;
}
`;

const Wall_FragmentShader = `
precision mediump float;

varying vec4 vPos;
varying vec2 v_uv;

uniform float u_time;
uniform sampler2D u_depthTexture;
uniform vec2 u_resolution;

uniform mat4 cameraWorldMatrix;
uniform mat4 cameraProjectionMatrixInverse;

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}


vec3 ray_march(in vec3 ray_origin, in vec3 ray_direction){

     float ray_distance_traveled = 0.0;

     const int NUMBER_OF_STEPS = 32;
     const float MINIMUM_HIT_DISTANCE = 0.001;
     const float MAXIMUM_TRACE_DISTANCE = 1000.0;


     for (int i = 0; i < NUMBER_OF_STEPS; ++i)
     {
          // Calculate our current position along the ray
          vec3 current_position = ray_origin + ray_distance_traveled * ray_direction;


          float distance_to_closest = sdSphere(current_position - vec3(-9.0, 2.5, 2.0), 0.2);

          distance_to_closest = min(distance_to_closest, sdSphere(current_position - vec3(-3.0, -0.5, 4.0), 0.25));
          distance_to_closest = min(distance_to_closest, sdSphere(current_position - vec3(-9.0, 0.5, -1.0), 1.3));

          // distance_to_closest = fract(distance_to_closest);
          // float distance_to_closest = length(current_position) - (length(vec3(0.0, 1.5, -2.0) - 0.5));

          if (distance_to_closest < MINIMUM_HIT_DISTANCE) // hit
          {
               // We hit something! Return red for now
               // return vec3(1.0, 0.5, 0.0) * (ray_distance_traveled / 25.0);
               return vec3(1.0, 0.5, 0.0);
          }

          if (ray_distance_traveled > MAXIMUM_TRACE_DISTANCE) // miss
          {
               break;
          }

          // accumulate the distance traveled thus far
          ray_distance_traveled += distance_to_closest;
     }

     // If we get here, we didn't hit anything so just
     // return a background color (black)
     return vec3(0.0);
}

void main() {
     
     // Setup screen UV
     vec2 vCoords = vPos.xy;
     vCoords /= vPos.w;

     // Apply aspect ratio
     vCoords.x *= u_resolution.x / u_resolution.y;
     
     vCoords = vCoords * 0.5 + 0.5;

  	vec2 f_uv = vCoords;


     //Raycasting
     vec3 ro = cameraPosition;
     vec3 rd = (cameraProjectionMatrixInverse * vec4(f_uv*2.-1., 0, 1)).xyz;
     rd = (cameraWorldMatrix * vec4(rd, 0)).xyz;
     rd = normalize(rd);

     // vec3 rayResult =  ray_march(ro, rd);

     gl_FragColor = vec4(ray_march(ro, rd), 1.0);

}
`;

export { Wall_VertexShader, Wall_FragmentShader };