#!/usr/bin/env node

// Simple test script to verify the MCP server
const { spawn } = require("child_process")

console.log("Testing OpenAPI MCP Server...")

const server = spawn("node", ["dist/openapi-mcp-server.js"], {
  stdio: ["pipe", "pipe", "pipe"],
})

// Test message to list tools
const testMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {},
}

server.stdin.write(JSON.stringify(testMessage) + "\n")

server.stdout.on("data", (data) => {
  console.log("Server response:", data.toString())
  server.kill()
})

server.stderr.on("data", (data) => {
  console.error("Server error:", data.toString())
})

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`)
})
