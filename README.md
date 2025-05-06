# MB Crosier's Personal MCP Server

This MCP server has been customized for [MB Crosier](https://www.mbcrosier.com) and now includes three personal tools:

## Tools

- **get_bio**: Returns a short biography of MB.
- **get_contact_info**: Returns MB Crosier's email info
- **get_social_links**: Returns MB Crosier's LinkedIn, GitHub, and Instagram links

---

## Try out this MCP Server using Cloudflare's AI Playground

1. Go to https://playground.ai.cloudflare.com/
2. Enter this MCP Server's deployed URL (`mbcrosier-mcp-server.mbcrosier.workers.dev/sse`)
3. You can now use MB's MCP server directly from the playground!


## Connect this MCP Server to Claude Desktop

To connect to this MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mbcrosier-mcp-server.mbcrosier.workers.dev/sse" 
      ]
    }
  }
}
```

Restart Claude and you should see the new tools become available. 