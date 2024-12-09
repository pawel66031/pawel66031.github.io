#include "../math/saturate.glsl"
#include "../color/tonemap.glsl"

#include "material.glsl"
#include "envMap.glsl"
#include "fresnelReflection.glsl"
#include "sphericalHarmonics.glsl"
#include "light/new.glsl"
#include "light/resolve.glsl"

#include "reflection.glsl"
#include "common/specularAO.glsl"
#include "common/envBRDFApprox.glsl"

// #if defined(RAYMARCH_AO)
// #include "raymarch/ao.glsl"
// #endif

/*
contributors: Patricio Gonzalez Vivo
description: Simple PBR shading model
use: <vec4> pbr( <Material> _material )
options:
    - DIFFUSE_FNC: diffuseOrenNayar, diffuseBurley, diffuseLambert (default)
    - SPECULAR_FNC: specularGaussian, specularBeckmann, specularCookTorrance (default), specularPhongRoughness, specularBlinnPhongRoughnes (default on mobile)
    - LIGHT_POSITION: in GlslViewer is u_light
    - LIGHT_COLOR in GlslViewer is u_lightColor
    - CAMERA_POSITION: in GlslViewer is u_camera
    - RAYMARCH_AO: enabled raymarched ambient occlusion
examples:
    - /shaders/lighting_raymarching_pbr.frag
license:
    - Copyright (c) 2021 Patricio Gonzalez Vivo under Prosperity License - https://prosperitylicense.com/versions/3.0.0
    - Copyright (c) 2021 Patricio Gonzalez Vivo under Patron License - https://lygia.xyz/license
*/

#ifndef CAMERA_POSITION
#define CAMERA_POSITION vec3(0.0, 0.0, -10.0)
#endif

#ifndef IBL_LUMINANCE
#define IBL_LUMINANCE   1.0
#endif

#ifndef FNC_PBR
#define FNC_PBR

vec4 pbr(const in Material _mat) {
    // Calculate Color
    vec3    diffuseColor = _mat.albedo.rgb * (vec3(1.0) - _mat.f0) * (1.0 - _mat.metallic);
    vec3    specularColor = mix(_mat.f0, _mat.albedo.rgb, _mat.metallic);

    // Cached
    Material M  = _mat;
    if (M.V.x == 0.0 && M.V.y == 0.0 && M.V.z == 0.0) {
        M.V         = normalize(CAMERA_POSITION - M.position);  // View
    }
    M.NoV       = dot(M.normal, M.V);                       // Normal . View
    M.R         = reflection(M.V, M.normal, M.roughness);   // Reflection

    // Ambient Occlusion
    // ------------------------
    float ao = 1.0;

    #if defined(FNC_RAYMARCH_AO)
    ao = raymarchAO(M.position, M.normal);
    #endif

// #if defined(FNC_SSAO) && defined(SCENE_DEPTH) && defined(RESOLUTION) && defined(CAMERA_NEAR_CLIP) && defined(CAMERA_FAR_CLIP)
//     vec2 pixel = 1.0/RESOLUTION;
//     ao = ssao(SCENE_DEPTH, gl_FragCoord.xy*pixel, pixel, 1.);
// #endif 

    // Global Ilumination ( Image Based Lighting )
    // ------------------------
    vec3 E = envBRDFApprox(specularColor, M);
    float diffuseAO = min(M.ambientOcclusion, ao);

    vec3 Fr = vec3(0.0, 0.0, 0.0);
    Fr  = envMap(M) * E;
    #if !defined(PLATFORM_RPI)
    Fr  += fresnelReflection(M);
    #endif
    Fr  *= specularAO(M, diffuseAO);

    vec3 Fd = diffuseColor;
    #if defined(SCENE_SH_ARRAY)
    Fd  *= tonemap( sphericalHarmonics(M.normal) );
    #else
    Fd *= envMap(M.normal, 1.0);
    #endif
    Fd  *= diffuseAO;
    Fd  *= (1.0 - E);

    // Local Ilumination
    // ------------------------
    vec3 lightDiffuse = vec3(0.0, 0.0, 0.0);
    vec3 lightSpecular = vec3(0.0, 0.0, 0.0);
    
    {
        #if defined(LIGHT_DIRECTION)
        LightDirectional L = LightDirectionalNew();
        lightResolve(diffuseColor, specularColor, M, L, lightDiffuse, lightSpecular);
        #elif defined(LIGHT_POSITION)
        LightPoint L = LightPointNew();
        lightResolve(diffuseColor, specularColor, M, L, lightDiffuse, lightSpecular);
        #endif

        #if defined(LIGHT_POINTS) && defined(LIGHT_POINTS_TOTAL)
        for (int i = 0; i < LIGHT_POINTS_TOTAL; i++) {
            LightPoint L = LIGHT_POINTS[i];
            lightResolve(diffuseColor, specularColor, M, L, lightDiffuse, lightSpecular);
        }
        #endif
    }

    
    // Final Sum
    // ------------------------
    vec4 color  = vec4(0.0, 0.0, 0.0, 1.0);

    // Diffuse
    color.rgb  += Fd * IBL_LUMINANCE;
    color.rgb  += lightDiffuse;

    // Specular
    color.rgb  += Fr * IBL_LUMINANCE;
    color.rgb  += lightSpecular;    
    color.rgb  *= M.ambientOcclusion;
    color.rgb  += M.emissive;
    color.a     = M.albedo.a;

    return color;
}
#endif
