import { z } from "zod";
export const getConfigSchema = z.object({});
export const getConfigDescription = "Get the current Draw Things configuration including the loaded model and settings";
export async function getConfig(client) {
    try {
        const config = await client.getConfig();
        return [
            {
                type: "text",
                text: JSON.stringify(config, null, 2),
            },
        ];
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return [
            {
                type: "text",
                text: `Error getting config: ${message}. Make sure Draw Things is running with the API Server enabled.`,
            },
        ];
    }
}
//# sourceMappingURL=get-config.js.map