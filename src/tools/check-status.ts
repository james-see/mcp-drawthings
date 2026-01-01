import { z } from "zod";
import type { DrawThingsClient } from "../client/drawthings.js";

export const checkStatusSchema = z.object({});

export const checkStatusDescription =
  "Check if the Draw Things API server is running and accessible";

export async function checkStatus(
  client: DrawThingsClient
): Promise<{ type: "text"; text: string }[]> {
  const result = await client.checkStatus();

  return [
    {
      type: "text",
      text: JSON.stringify(result, null, 2),
    },
  ];
}
