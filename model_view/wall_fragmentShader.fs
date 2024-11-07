precision mediump float;

varying vec2 v_uv;
varying mat4 v_modelViewMatrix;
varying mat4 v_projectionMatrix;

uniform float u_time;
uniform sampler2D u_depthTexture;

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

vec3 ray_march(in vec3 ro, in vec3 rd) {
    float ray_distance_traveled = 0.0;

    const int NUMBER_OF_STEPS = 16;
    const float MINIMUM_HIT_DISTANCE = 0.001;
    const float MAXIMUM_TRACE_DISTANCE = 1000.0;

    for(int i = 0; i < NUMBER_OF_STEPS; ++i) {
          // Calculate our current position along the ray
        vec3 current_position = ro + ray_distance_traveled * rd;

          // We wrote this function earlier in the tutorial -
          // assume that the sphere is centered at the origin
          // and has unit radius
        float distance_to_closest = distance_from_sphere(current_position, vec3(0.0), 1.0);

        if(distance_to_closest < MINIMUM_HIT_DISTANCE) // hit
        {
               // We hit something! Return red for now
            return vec3(1.0, 0.0, 0.0);
        }

        if(ray_distance_traveled > MAXIMUM_TRACE_DISTANCE) // miss
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
     // gl_FragColor = u_camera_projectionMatrix * vec4(1.0, 0.0, 0.0, 1.0);
     // gl_FragColor = fract(v_projectionMatrix * vec4(0.0, 0.0, 0.0, 1.0));
     // float depth = texture(u_depthTexture, v_uv).x;
float depth = gl_FragCoord.z;
gl_FragColor = vec4(depth, depth, depth, 1.0);
}