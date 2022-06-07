#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
   //由于lut图是单行的，因此y坐标不仅表明了绿色G共分为了几阶，还表明了lut图共有_COLOR个方块
    highp float _COLORS      = float(lut_tex_size.y);
    //得到输入图像的color_rgb值(0-1区间)
    highp vec4 color       = subpassLoad(in_color).rgba;

    //从0-1区间映射到0-(_COLORS-1.0)区间，和lut坐标相对应，方便后来在lut图上找对应点
    highp float transform_R = color.r*(_COLORS-1.0);
    highp float transform_G = color.g*(_COLORS-1.0);
    highp float transform_B = color.b*(_COLORS-1.0);

    //因为B通道是随方格增大的，方格从左到右B值逐渐变大，因此可以选择只做B通道的插值，看B落在哪两个方格之间
    highp float floor_B = floor(transform_B);
    highp float high_B = floor(transform_B)+float(1);

    //根据一维lut图的特点，计算对应lut图上的u,v坐标，因为B做插值，所以要B在俩个格子的情况各算一遍，是谓(u_1,v_1),(u_2,v_2)
    highp float u_1 = (floor_B*(_COLORS)+transform_R)/float(lut_tex_size.x);
    highp float v_1 = transform_G/float(lut_tex_size.y);

    highp float u_2 = (high_B*(_COLORS)+transform_R)/float(lut_tex_size.x);
    highp float v_2 = transform_G/float(lut_tex_size.y);

    highp vec2 uv_1 = vec2(u_1,v_1);
    highp vec2 uv_2 = vec2(u_2,v_2);
    
    //使用texture函数进行纹理查找，得到变换后的颜色
    highp vec4 color_sampled_1 =  texture(color_grading_lut_texture_sampler, uv_1);
    highp vec4 color_sampled_2 =  texture(color_grading_lut_texture_sampler, uv_2);
    //对得到的颜色根据B进行插值，得到最终结果
    highp vec4 res_color = mix(color_sampled_1,color_sampled_2,fract(transform_B));
    //输出结果out_color，到下一个shader中
    out_color = res_color;
}
