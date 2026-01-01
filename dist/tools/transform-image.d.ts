import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";
export declare const transformImageSchema: z.ZodObject<{
    prompt: z.ZodString;
    image_path: z.ZodOptional<z.ZodString>;
    image_base64: z.ZodOptional<z.ZodString>;
    negative_prompt: z.ZodOptional<z.ZodString>;
    denoising_strength: z.ZodOptional<z.ZodNumber>;
    steps: z.ZodOptional<z.ZodNumber>;
    cfg_scale: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    output_path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    steps?: number | undefined;
    cfg_scale?: number | undefined;
    seed?: number | undefined;
    negative_prompt?: string | undefined;
    output_path?: string | undefined;
    image_path?: string | undefined;
    image_base64?: string | undefined;
    denoising_strength?: number | undefined;
}, {
    prompt: string;
    steps?: number | undefined;
    cfg_scale?: number | undefined;
    seed?: number | undefined;
    negative_prompt?: string | undefined;
    output_path?: string | undefined;
    image_path?: string | undefined;
    image_base64?: string | undefined;
    denoising_strength?: number | undefined;
}>;
export declare const transformImageDescription = "Transform an existing image using a text prompt (img2img). Either image_path or image_base64 must be provided.";
export declare function transformImage(client: DrawThingsClient, params: z.infer<typeof transformImageSchema>): Promise<{
    type: "text";
    text: string;
}[]>;
//# sourceMappingURL=transform-image.d.ts.map