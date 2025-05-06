import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define the MCP agent
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "MB Crosier's Personal MCP",
		version: "1.0.0",
	});

	async init() {
		
		// --- MB Crosier Personal Tools ---

		// Returns a comprehensive bio detailing MB's current role at Harvard, her newsletter MCP in Context, past experiences, and personal interests
		this.server.tool(
			"get_bio",
			"Returns a bio of MB Crosier.",
			async () => ({
				content: [{
					type: "text",
					text: "MB (\"Mary Boyd\") Crosier is currently a student currently a student in Harvard's MS/MBA: Engineering Sciences program. MB also writes a Substack newsletter called MCP in Context (https://www.mcpincontext.com) about all things related to the Model Context Protocol. Previously, she worked at marketing and operations roles at Stytch (a Series B developer tools startup), as a management consultant focused on tech due diligences at Bain & Co, and was a strategy intern at Codecademy, focused on curriculum development and community building. Before that, she studied Systems and Information Engineering at UVA, as a  Jefferson Scholar. Outside of work, MB enjoys running, doing crosswords, traveling, and scuba diving. She also loves learning about local history, and has been a volunteer historical tour guide at the University of Virginia, on Boston's Freedom Trail, and at New York's Merchant House Museum. To learn more about MB, visit her personal website at https://www.mbcrosier.com."
				}],
			})
		);

		// Provides MB's primary email contact information for professional inquiries
		this.server.tool(
			"get_contact_info",
			"Provides MB Crosier's primary email address",
			async () => ({
				content: [{
					type: "text",
					text: "mbcrosier@gmail.com"
				}],
			})
		);

		// Returns links to MB's professional and social media presence across LinkedIn, GitHub, and Instagram
		this.server.tool(
			"get_social_links",
			"Returns links to MB Crosier's social accounts.",
			async () => ({
				content: [{
					type: "text",
					text: "LinkedIn: https://linkedin.com/in/maryboydcrosier\nGitHub: https://github.com/mbcrosier\nInstagram: https://instagram.com/maryboydc"
				}],
			})
		);
	}
}

// Helper function to render the landing page
function renderLandingPage() {
	return new Response(
		`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>MB Crosier's Personal MCP Server</title>
			<style>
				body { font-family: system-ui, sans-serif; margin: 2rem; background: #f9f9fb; color: #222; }
				h1 { color: #2d3a4a; }
				ul { line-height: 1.7; }
				code { background: #eee; padding: 2px 4px; border-radius: 3px; }
				footer { margin-top: 2rem; color: #888; font-size: 0.95em; }
			</style>
		</head>
		<body>
			<h1>MB Crosier's Personal MCP Server</h1>
			<p>This MCP server has been customized for <a href="https://www.mbcrosier.com" target="_blank">MB Crosier</a> and exposes the following tools:</p>
			<ul>
				<li><b>get_bio</b>: Returns a short biography of MB.</li>
				<li><b>get_contact_info</b>: Returns MB Crosier's email info.</li>
				<li><b>get_social_links</b>: Returns MB Crosier's LinkedIn, GitHub, and Instagram links.</li>
			</ul>
			<hr />
			<h2>Try out this MCP Server using Cloudflare's AI Playground</h2>
			<ol>
				<li>Go to <a href="https://playground.ai.cloudflare.com/" target="_blank">Cloudflare AI Playground</a></li>
				<li>Enter this MCP Server's deployed URL: <code>mbcrosier-mcp-server.mbcrosier.workers.dev/sse</code></li>
				<li>You can now use MB's MCP server directly from the playground!</li>
			</ol>
			<h2>Connect this MCP Server to Claude Desktop</h2>
			<p>To connect to this MCP server from Claude Desktop, follow <a href="https://modelcontextprotocol.io/quickstart/user" target="_blank">Anthropic's Quickstart</a> and within Claude Desktop go to <b>Settings &gt; Developer &gt; Edit Config</b>. Use this config:</p>
			<pre style="background:#eee;padding:1em;border-radius:5px;overflow-x:auto;"><code>{
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
</code></pre>
			<footer>
				&copy; ${new Date().getFullYear()} MB Crosier &mdash; <a href="https://www.mbcrosier.com" target="_blank">mbcrosier.com</a>
			</footer>
		</body>
		</html>`,
		{ headers: { "content-type": "text/html" } }
	);
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			const accept = request.headers.get("accept") || "";
			if (!accept.includes("text/event-stream")) {
				return renderLandingPage();
			}
			// Otherwise, serve the SSE endpoint for MCP clients
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		if (url.pathname === "/") {
			return renderLandingPage();
		}

		return new Response("Not found", { status: 404 });
	},
};
