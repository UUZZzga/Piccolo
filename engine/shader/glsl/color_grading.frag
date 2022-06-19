#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    highp float onePxSize = 1.0 / _COLORS;

    highp float bs = floor(color.b * 256.0);
    highp float cccc = 256.0 / _COLORS;

    highp float ib1 = floor(bs / cccc) / _COLORS;
    highp float ib2 = min(ib1 + onePxSize, 1.0);

    highp vec2 uv1;
    highp vec2 uv2;

    uv1.x = color.r / _COLORS + ib1;
    uv1.y = color.g;

    uv2.x = color.r / _COLORS + ib2;
    uv2.y = color.g;

    highp vec4 color1 = texture(color_grading_lut_texture_sampler, uv1);
    highp vec4 color2 = texture(color_grading_lut_texture_sampler, uv2);

    color = mix(color1, color2, fract(color.b * cccc));

    out_color = color;
}
