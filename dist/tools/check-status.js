import { z } from "zod";
export const checkStatusSchema = z.object({});
export const checkStatusDescription = "Check if the Draw Things API server is running and accessible";
export async function checkStatus(client) {
    const result = await client.checkStatus();
    return [
        {
            type: "text",
            text: JSON.stringify(result, null, 2),
        },
    ];
}
//# sourceMappingURL=check-status.js.map