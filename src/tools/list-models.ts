import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";

export const listModelsSchema = z.object({});

export const listModelsDescription =
  "List all available models in Draw Things that can be used for image generation";

export async function listModels(
  client: DrawThingsClient
): Promise<{ type: "text"; text: string }[]> {
  try {
    const models = await client.listModels();

    return [
      {
        type: "text",
        text: JSON.stringify(models, null, 2),
      },
    ];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      {
        type: "text",
        text: `Error listing models: ${message}. Make sure Draw Things is running with the API Server enabled.`,
      },
    ];
  }
}
