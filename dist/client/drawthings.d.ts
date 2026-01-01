import type { DrawThingsConfig, Txt2ImgRequest, Img2ImgRequest, GenerationResponse } from "../types.js";
/**
 * Draw Things HTTP API Client
 * Communicates with the Draw Things app running on localhost
 */
export declare class DrawThingsClient {
    private baseUrl;
    private outputDir;
    constructor();
    /**
     * Check if the Draw Things API server is running
     */
    checkStatus(): Promise<{
        running: boolean;
        message: string;
    }>;
    /**
     * List available models
     */
    listModels(): Promise<unknown[]>;
    /**
     * Get the current Draw Things configuration
     */
    getConfig(): Promise<DrawThingsConfig>;
    /**
     * Generate an image from a text prompt (txt2img)
     */
    txt2img(request: Txt2ImgRequest): Promise<GenerationResponse>;
    /**
     * Transform an image using a prompt (img2img)
     */
    img2img(request: Img2ImgRequest): Promise<GenerationResponse>;
    /**
     * Read an image file and return as base64
     */
    readImageAsBase64(imagePath: string): Promise<string>;
    /**
     * Save a base64 image to disk
     */
    saveImage(base64Data: string, customPath?: string): Promise<string>;
}
//# sourceMappingURL=drawthings.d.ts.map