#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DrawThingsClient } from "./client/drawthings.js";
import {
  checkStatusSchema,
  checkStatusDescription,
  checkStatus,
} from "./tools/check-status.js";
import {
  getConfigSchema,
  getConfigDescription,
  getConfig,
} from "./tools/get-config.js";
import {
  listModelsSchema,
  listModelsDescription,
  listModels,
} from "./tools/list-models.js";
import {
  generateImageSchema,
  generateImageDescription,
  generateImage,
} from "./tools/generate-image.js";
import {
  transformImageSchema,
  transformImageDescription,
  transformImage,
} from "./tools/transform-image.js";

// Create the Draw Things client
const client = new DrawThingsClient();

// Create the MCP server
const server = new McpServer({
  name: "mcp-drawthings",
  version: "1.0.0",
});

// Register tools
server.tool(
  "check_status",
  checkStatusDescription,
  checkStatusSchema.shape,
  async () => {
    const result = await checkStatus(client);
    return { content: result };
  }
);

server.tool(
  "get_config",
  getConfigDescription,
  getConfigSchema.shape,
  async () => {
    const result = await getConfig(client);
    return { content: result };
  }
);

server.tool(
  "list_models",
  listModelsDescription,
  listModelsSchema.shape,
  async () => {
    const result = await listModels(client);
    return { content: result };
  }
);

server.tool(
  "generate_image",
  generateImageDescription,
  generateImageSchema.shape,
  async (params) => {
    const result = await generateImage(client, params);
    return { content: result };
  }
);

server.tool(
  "transform_image",
  transformImageDescription,
  transformImageSchema.shape,
  async (params) => {
    const result = await transformImage(client, params);
    return { content: result };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
