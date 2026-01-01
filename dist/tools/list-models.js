import { z } from "zod";
export const listModelsSchema = z.object({});
export const listModelsDescription = "List all available models in Draw Things that can be used for image generation";
export async function listModels(client) {
    try {
        const models = await client.listModels();
        return [
            {
                type: "text",
                text: JSON.stringify(models, null, 2),
            },
        ];
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return [
            {
                type: "text",
                text: `Error listing models: ${message}. Make sure Draw Things is running with the API Server enabled.`,
            },
        ];
    }
}
//# sourceMappingURL=list-models.js.map