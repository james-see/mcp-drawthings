import { z } from "zod";
export const generateImageSchema = z.object({
    prompt: z.string().describe("Text description of the image to generate"),
    negative_prompt: z
        .string()
        .optional()
        .describe("Elements to exclude from the generated image"),
    width: z
        .number()
        .int()
        .min(64)
        .max(2048)
        .optional()
        .describe("Width of the generated image in pixels (default: 512)"),
    height: z
        .number()
        .int()
        .min(64)
        .max(2048)
        .optional()
        .describe("Height of the generated image in pixels (default: 512)"),
    steps: z
        .number()
        .int()
        .min(1)
        .max(150)
        .optional()
        .describe("Number of inference steps (default: 20)"),
    cfg_scale: z
        .number()
        .min(1)
        .max(30)
        .optional()
        .describe("Classifier-free guidance scale (default: 7.5)"),
    seed: z
        .number()
        .int()
        .optional()
        .describe("Random seed for reproducibility (-1 for random)"),
    output_path: z
        .string()
        .optional()
        .describe("Custom file path to save the generated image"),
});
export const generateImageDescription = "Generate an image from a text prompt using the Draw Things app. The image will be saved to disk and the file path returned.";
export async function generateImage(client, params) {
    try {
        // Check if server is running first
        const status = await client.checkStatus();
        if (!status.running) {
            return [
                {
                    type: "text",
                    text: `Error: ${status.message}`,
                },
            ];
        }
        // Generate the image
        const response = await client.txt2img({
            prompt: params.prompt,
            negative_prompt: params.negative_prompt,
            width: params.width,
            height: params.height,
            steps: params.steps,
            cfg_scale: params.cfg_scale,
            seed: params.seed,
        });
        if (!response.images || response.images.length === 0) {
            return [
                {
                    type: "text",
                    text: "Error: No images were generated",
                },
            ];
        }
        // Save the image(s)
        const savedPaths = [];
        for (let i = 0; i < response.images.length; i++) {
            const outputPath = params.output_path && response.images.length === 1
                ? params.output_path
                : undefined;
            const path = await client.saveImage(response.images[i], outputPath);
            savedPaths.push(path);
        }
        return [
            {
                type: "text",
                text: JSON.stringify({
                    success: true,
                    message: `Generated ${savedPaths.length} image(s)`,
                    files: savedPaths,
                    prompt: params.prompt,
                    parameters: {
                        width: params.width || 512,
                        height: params.height || 512,
                        steps: params.steps || 20,
                        cfg_scale: params.cfg_scale || 7.5,
                        seed: params.seed ?? -1,
                    },
                }, null, 2),
            },
        ];
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return [
            {
                type: "text",
                text: `Error generating image: ${message}`,
            },
        ];
    }
}
//# sourceMappingURL=generate-image.js.map