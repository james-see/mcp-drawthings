import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";
export declare const listModelsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const listModelsDescription = "List all available models in Draw Things that can be used for image generation";
export declare function listModels(client: DrawThingsClient): Promise<{
    type: "text";
    text: string;
}[]>;
//# sourceMappingURL=list-models.d.ts.map