# mcp-drawthings

An MCP (Model Context Protocol) server for [Draw Things](https://drawthings.ai/) - enabling LLMs to generate images locally on Mac using Stable Diffusion and other AI models.

## Features

- **Text-to-Image Generation** - Generate images from text prompts using the currently loaded model in Draw Things
- **Image-to-Image Transformation** - Transform existing images using text prompts
- **Configuration Access** - Query the current Draw Things settings and loaded model
- **Local Processing** - All image generation runs locally on your Mac using Apple Silicon (M1/M2/M3/M4)

## Prerequisites

- macOS with Apple Silicon (M1/M2/M3/M4)
- [Draw Things](https://drawthings.ai/) app installed
- Node.js 18 or later

## Setup

### 1. Enable Draw Things API Server

1. Open Draw Things
2. Click the gear icon (⚙️) to open Settings
3. Enable **API Server** / **HTTP Server**
4. The server runs on port 7860 by default

Verify the server is running:

```bash
curl http://localhost:7860
```

### 2. Configure Your MCP Client

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "drawthings": {
      "command": "npx",
      "args": ["-y", "mcp-drawthings"]
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json` in your project or global config:

```json
{
  "mcpServers": {
    "drawthings": {
      "command": "npx",
      "args": ["-y", "mcp-drawthings"]
    }
  }
}
```

### 3. Restart Your MCP Client

Restart Claude Desktop or Cursor to load the new MCP server.

## Available Tools

### `check_status`

Check if the Draw Things API server is running and accessible.

### `get_config`

Get the current Draw Things configuration including the loaded model and settings.

### `generate_image`

Generate an image from a text prompt.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to generate |
| `negative_prompt` | string | No | Elements to exclude from the generated image |
| `width` | number | No | Image width in pixels (default: 512) |
| `height` | number | No | Image height in pixels (default: 512) |
| `steps` | number | No | Number of inference steps (default: 20) |
| `cfg_scale` | number | No | Guidance scale (default: 7.5) |
| `seed` | number | No | Random seed for reproducibility (-1 for random) |
| `output_path` | string | No | Custom file path to save the image |

**Example:**
```
Generate an image of a futuristic city at sunset with flying cars
```

### `transform_image`

Transform an existing image using a text prompt (img2img).

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the desired transformation |
| `image_path` | string | No* | Path to the source image file |
| `image_base64` | string | No* | Base64-encoded source image |
| `negative_prompt` | string | No | Elements to exclude |
| `denoising_strength` | number | No | Transformation strength 0.0-1.0 (default: 0.75) |
| `steps` | number | No | Number of inference steps (default: 20) |
| `cfg_scale` | number | No | Guidance scale (default: 7.5) |
| `seed` | number | No | Random seed (-1 for random) |
| `output_path` | string | No | Custom file path to save the result |

*Either `image_path` or `image_base64` must be provided.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DRAWTHINGS_HOST` | `localhost` | Draw Things API host |
| `DRAWTHINGS_PORT` | `7860` | Draw Things API port |
| `DRAWTHINGS_OUTPUT_DIR` | `~/Pictures/drawthings-mcp` | Directory for generated images |

## Architecture

```
┌─────────────────┐     stdio      ┌──────────────────┐     HTTP      ┌─────────────┐
│   MCP Client    │◄──────────────►│  mcp-drawthings  │◄────────────►│ Draw Things │
│ (Claude/Cursor) │   JSON-RPC     │                  │  localhost    │    App      │
└─────────────────┘                └──────────────────┘   :7860       └─────────────┘
                                           │
                                           ▼
                                   ┌──────────────┐
                                   │  File System │
                                   │   (images)   │
                                   └──────────────┘
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-drawthings
cd mcp-drawthings

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

## Troubleshooting

### "Cannot connect to Draw Things API"

1. Make sure Draw Things is running
2. Check that the API Server is enabled in Draw Things settings
3. Verify the server is accessible: `curl http://localhost:7860`
4. Check if a different port is configured in Draw Things

### Images not generating

1. Make sure a model is loaded in Draw Things
2. Check Draw Things for any error messages
3. Try generating an image directly in Draw Things first

### Permission errors saving images

Check that the output directory is writable. You can set a custom directory using the `DRAWTHINGS_OUTPUT_DIR` environment variable.

## License

MIT

## Related Projects

- [Draw Things](https://drawthings.ai/) - The AI image generation app for Mac/iOS
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for MCP
