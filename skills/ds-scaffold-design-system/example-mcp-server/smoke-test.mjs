import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "node", args: ["server.mjs"] });
const client = new Client({ name: "smoke-test", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
console.log("tools:", tools.tools.map((t) => t.name).join(", "));

const rules = await client.callTool({ name: "get_rules", arguments: {} });
console.log("get_rules ok:", JSON.parse(rules.content[0].text).rules.length, "rules");

const search = await client.callTool({ name: "search_components", arguments: { query: "loader" } });
console.log("search_components('loader') (no includeInternal):", search.content[0].text.trim() === "[]" ? "[] as expected" : search.content[0].text);

const search2 = await client.callTool({ name: "search_components", arguments: { query: "loader", includeInternal: true } });
console.log("search_components('loader', includeInternal): found", JSON.parse(search2.content[0].text).length);

const coverage = await client.callTool({ name: "check_coverage", arguments: { name: "donut chart" } });
console.log("check_coverage('donut chart'):", coverage.content[0].text.trim());

const changelog = await client.callTool({ name: "get_changelog", arguments: { since: "1.2.0" } });
console.log("get_changelog(since 1.2.0) entries:", JSON.parse(changelog.content[0].text).length);

await client.close();
console.log("SMOKE TEST PASSED");
