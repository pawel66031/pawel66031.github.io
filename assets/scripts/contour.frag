precision mediump float;

varying vec4 vPos;

#include "shaders/lygia-1.2.3/generative/noised.glsl";

void main(){
    gl_FragColor = vec4(0.75, 0.5, 1.0, 1.0);
}