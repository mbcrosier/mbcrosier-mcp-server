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

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
