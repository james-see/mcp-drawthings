import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";
export declare const checkStatusSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const checkStatusDescription = "Check if the Draw Things API server is running and accessible";
export declare function checkStatus(client: DrawThingsClient): Promise<{
    type: "text";
    text: string;
}[]>;
//# sourceMappingURL=check-status.d.ts.map