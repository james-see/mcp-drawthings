import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";

export const transformImageSchema = z.object({
  prompt: z
    .string()
    .describe("Text description of the desired transformation"),
  image_path: z
    .string()
    .optional()
    .describe("Path to the source image file to transform"),
  image_base64: z
    .string()
    .optional()
    .describe("Base64-encoded source image (alternative to image_path)"),
  negative_prompt: z
    .string()
    .optional()
    .describe("Elements to exclude from the transformed image"),
  denoising_strength: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe(
      "Strength of the transformation (0.0-1.0, default: 0.75). Lower values keep more of the original image."
    ),
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
    .describe("Custom file path to save the transformed image"),
});

export const transformImageDescription =
  "Transform an existing image using a text prompt (img2img). Either image_path or image_base64 must be provided.";

export async function transformImage(
  client: DrawThingsClient,
  params: z.infer<typeof transformImageSchema>
): Promise<{ type: "text"; text: string }[]> {
  try {
    // Validate input
    if (!params.image_path && !params.image_base64) {
      return [
        {
          type: "text",
          text: "Error: Either image_path or image_base64 must be provided",
        },
      ];
    }

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

    // Get base64 image data
    let imageBase64 = params.image_base64;
    if (params.image_path && !imageBase64) {
      try {
        imageBase64 = await client.readImageAsBase64(params.image_path);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return [
          {
            type: "text",
            text: `Error reading image file: ${message}`,
          },
        ];
      }
    }

    // Transform the image
    const response = await client.img2img({
      prompt: params.prompt,
      init_images: [imageBase64!],
      negative_prompt: params.negative_prompt,
      denoising_strength: params.denoising_strength,
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
    const savedPaths: string[] = [];
    for (let i = 0; i < response.images.length; i++) {
      const outputPath =
        params.output_path && response.images.length === 1
          ? params.output_path
          : undefined;
      const path = await client.saveImage(response.images[i], outputPath);
      savedPaths.push(path);
    }

    return [
      {
        type: "text",
        text: JSON.stringify(
          {
            success: true,
            message: `Transformed image, generated ${savedPaths.length} result(s)`,
            files: savedPaths,
            prompt: params.prompt,
            source: params.image_path || "(base64 input)",
            parameters: {
              denoising_strength: params.denoising_strength ?? 0.75,
              steps: params.steps || 20,
              cfg_scale: params.cfg_scale || 7.5,
              seed: params.seed ?? -1,
            },
          },
          null,
          2
        ),
      },
    ];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      {
        type: "text",
        text: `Error transforming image: ${message}`,
      },
    ];
  }
}
