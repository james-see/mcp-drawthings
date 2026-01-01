import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";
export declare const getConfigSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const getConfigDescription = "Get the current Draw Things configuration including the loaded model and settings";
export declare function getConfig(client: DrawThingsClient): Promise<{
    type: "text";
    text: string;
}[]>;
//# sourceMappingURL=get-config.d.ts.map