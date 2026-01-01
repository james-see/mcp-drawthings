/**
 * Draw Things API Types
 */
export interface DrawThingsConfig {
    model?: string;
    sampler?: string;
    steps?: number;
    cfg_scale?: number;
    width?: number;
    height?: number;
    seed?: number;
    [key: string]: unknown;
}
export interface Txt2ImgRequest {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    cfg_scale?: number;
    seed?: number;
    sampler?: string;
    batch_size?: number;
}
export interface Img2ImgRequest {
    prompt: string;
    init_images: string[];
    negative_prompt?: string;
    denoising_strength?: number;
    steps?: number;
    cfg_scale?: number;
    seed?: number;
    sampler?: string;
    batch_size?: number;
}
export interface GenerationResponse {
    images: string[];
    parameters?: Record<string, unknown>;
    info?: string;
}
export interface GenerateImageParams {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    cfg_scale?: number;
    seed?: number;
    output_path?: string;
}
export interface TransformImageParams {
    prompt: string;
    image_path?: string;
    image_base64?: string;
    negative_prompt?: string;
    denoising_strength?: number;
    steps?: number;
    cfg_scale?: number;
    seed?: number;
    output_path?: string;
}
//# sourceMappingURL=types.d.ts.map