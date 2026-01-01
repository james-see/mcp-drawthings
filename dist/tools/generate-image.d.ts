import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";
export declare const generateImageSchema: z.ZodObject<{
    prompt: z.ZodString;
    negative_prompt: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    steps: z.ZodOptional<z.ZodNumber>;
    cfg_scale: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    model: z.ZodOptional<z.ZodString>;
    output_path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    model?: string | undefined;
    steps?: number | undefined;
    cfg_scale?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    seed?: number | undefined;
    negative_prompt?: string | undefined;
    output_path?: string | undefined;
}, {
    prompt: string;
    model?: string | undefined;
    steps?: number | undefined;
    cfg_scale?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    seed?: number | undefined;
    negative_prompt?: string | undefined;
    output_path?: string | undefined;
}>;
export declare const generateImageDescription = "Generate an image from a text prompt using the Draw Things app. The image will be saved to disk and the file path returned.";
export declare function generateImage(client: DrawThingsClient, params: z.infer<typeof generateImageSchema>): Promise<{
    type: "text";
    text: string;
}[]>;
//# sourceMappingURL=generate-image.d.ts.map