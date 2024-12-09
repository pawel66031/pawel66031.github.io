#include "../sample/equirect.glsl"

#include "fakeCube.glsl"
#include "toShininess.glsl"

/*
contributors: Patricio Gonzalez Vivo
description: |
    Get enviroment map light comming from a normal direction and acording
    to some roughness/metallic value. If there is no SCENE_CUBEMAP texture it creates
    a fake cube
use: <vec3> envMap(<vec3> _normal, <float> _roughness [, <float> _metallic])
options:
    - SCENE_CUBEMAP: pointing to the cubemap texture
    - ENVMAP_MAX_MIP_LEVEL
    - ENVMAP_LOD_OFFSET
    - ENVMAP_FNC(NORMAL, ROUGHNESS, METALLIC)
license:
    - Copyright (c) 2021 Patricio Gonzalez Vivo under Prosperity License - https://prosperitylicense.com/versions/3.0.0
    - Copyright (c) 2021 Patricio Gonzalez Vivo under Patron License - https://lygia.xyz/license
*/

#ifndef SAMPLE_CUBE_FNC
#if __VERSION__ >= 300
#define SAMPLE_CUBE_FNC(CUBEMAP, NORM, LOD) textureLod(CUBEMAP, NORM, LOD)
#else
#define SAMPLE_CUBE_FNC(CUBEMAP, NORM, LOD) textureCube(CUBEMAP, NORM, LOD)
#endif
#endif

#if __VERSION__ < 430
#define ENVMAP_MAX_MIP_LEVEL 3.0
#endif

#ifndef ENVMAP_LOD_OFFSET
#define ENVMAP_LOD_OFFSET 0
#endif

#ifndef FNC_ENVMAP
#define FNC_ENVMAP
vec3 envMap(const in vec3 _normal, const in float _roughness, const in float _metallic) {

// ENVMAP overwrites cube sampling  
#if defined(ENVMAP_FNC) 
    return ENVMAP_FNC(_normal, _roughness, _metallic);

#elif defined(SCENE_EQUIRECT)
    return sampleEquirect(SCENE_EQUIRECT, _normal, 1.0 + 26.0 * _roughness).rgb;

// Cubemap sampling
#elif defined(SCENE_CUBEMAP) && !defined(ENVMAP_MAX_MIP_LEVEL)
    int lod = textureQueryLevels( SCENE_CUBEMAP ) - ENVMAP_LOD_OFFSET;
    return SAMPLE_CUBE_FNC( SCENE_CUBEMAP, _normal, lod * _roughness).rgb;

#elif defined(SCENE_CUBEMAP)
    float lod = ENVMAP_MAX_MIP_LEVEL;
    return SAMPLE_CUBE_FNC( SCENE_CUBEMAP, _normal, lod * _roughness ).rgb;

// Default
#else
    return fakeCube(_normal, toShininess(_roughness, _metallic));

#endif
}

vec3 envMap(const in vec3 _normal, const in float _roughness) {
    return envMap(_normal, _roughness, 1.0);
}

#ifdef STR_MATERIAL
vec3 envMap(const in Material _M) {
    return envMap(_M.R, _M.roughness, _M.metallic);
}
#endif
#endif