import { readFile, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type {
  DrawThingsConfig,
  Txt2ImgRequest,
  Img2ImgRequest,
  GenerationResponse,
} from "../types.js";

/**
 * Draw Things HTTP API Client
 * Communicates with the Draw Things app running on localhost
 */
export class DrawThingsClient {
  private baseUrl: string;
  private outputDir: string;

  constructor() {
    const host = process.env.DRAWTHINGS_HOST || "localhost";
    const port = process.env.DRAWTHINGS_PORT || "7860";
    this.baseUrl = `http://${host}:${port}`;
    this.outputDir =
      process.env.DRAWTHINGS_OUTPUT_DIR ||
      join(homedir(), "Pictures", "drawthings-mcp");
  }

  /**
   * Check if the Draw Things API server is running
   */
  async checkStatus(): Promise<{ running: boolean; message: string }> {
    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        return {
          running: true,
          message: `Draw Things API server is running at ${this.baseUrl}`,
        };
      }
      return {
        running: false,
        message: `Draw Things API server returned status ${response.status}`,
      };
    } catch (error) {
      return {
        running: false,
        message: `Cannot connect to Draw Things API at ${this.baseUrl}. Make sure Draw Things is running and the API Server is enabled in settings.`,
      };
    }
  }

  /**
   * Get the current Draw Things configuration
   */
  async getConfig(): Promise<DrawThingsConfig> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to get config: ${response.status} ${response.statusText}`
      );
    }
    return (await response.json()) as DrawThingsConfig;
  }

  /**
   * Generate an image from a text prompt (txt2img)
   */
  async txt2img(request: Txt2ImgRequest): Promise<GenerationResponse> {
    const response = await fetch(`${this.baseUrl}/sdapi/v1/txt2img`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negative_prompt || "",
        width: request.width || 512,
        height: request.height || 512,
        steps: request.steps || 20,
        cfg_scale: request.cfg_scale || 7.5,
        seed: request.seed ?? -1,
        sampler: request.sampler,
        batch_size: request.batch_size || 1,
        ...(request.model && { model: request.model }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `txt2img failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return (await response.json()) as GenerationResponse;
  }

  /**
   * Transform an image using a prompt (img2img)
   */
  async img2img(request: Img2ImgRequest): Promise<GenerationResponse> {
    const response = await fetch(`${this.baseUrl}/sdapi/v1/img2img`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: request.prompt,
        init_images: request.init_images,
        negative_prompt: request.negative_prompt || "",
        denoising_strength: request.denoising_strength ?? 0.75,
        steps: request.steps || 20,
        cfg_scale: request.cfg_scale || 7.5,
        seed: request.seed ?? -1,
        sampler: request.sampler,
        batch_size: request.batch_size || 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `img2img failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return (await response.json()) as GenerationResponse;
  }

  /**
   * Read an image file and return as base64
   */
  async readImageAsBase64(imagePath: string): Promise<string> {
    const absolutePath = imagePath.startsWith("~")
      ? join(homedir(), imagePath.slice(1))
      : imagePath;

    const buffer = await readFile(absolutePath);
    return buffer.toString("base64");
  }

  /**
   * Save a base64 image to disk
   */
  async saveImage(
    base64Data: string,
    customPath?: string
  ): Promise<string> {
    const outputDir = customPath
      ? join(customPath, "..")
      : this.outputDir;

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    const filename =
      customPath ||
      join(this.outputDir, `image_${Date.now()}.png`);

    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    await writeFile(filename, buffer);
    return filename;
  }
}
