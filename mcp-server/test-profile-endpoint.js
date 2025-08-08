#!/usr/bin/env node

// Test script to query /api/profile endpoint information
const { spawn } = require("child_process")

console.log("Testing OpenAPI MCP Server for /api/profile endpoint...")

const server = spawn("node", ["dist/openapi-mcp-server.js"], {
  stdio: ["pipe", "pipe", "pipe"],
})

let responses = []

server.stdout.on("data", (data) => {
  const response = data.toString().trim()
  if (response) {
    responses.push(response)
    console.log("Response:", response)
  }
})

server.stderr.on("data", (data) => {
  console.error("Server error:", data.toString())
})

// Step 1: Fetch the OpenAPI spec
console.log("\n1. Fetching OpenAPI specification...")
const fetchSpecMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "fetch_openapi_spec",
    arguments: {},
  },
}

server.stdin.write(JSON.stringify(fetchSpecMessage) + "\n")

// Step 2: Query for profile-related endpoints
setTimeout(() => {
  console.log("\n2. Querying for profile-related endpoints...")
  const queryMessage = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "query_endpoints",
      arguments: {
        search: "profile",
      },
    },
  }
  server.stdin.write(JSON.stringify(queryMessage) + "\n")
}, 1000)

// Step 3: Get specific details for /api/profile endpoint
setTimeout(() => {
  console.log("\n3. Getting details for /api/profile endpoint...")
  const detailsMessage = {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "get_endpoint_details",
      arguments: {
        path: "/api/profile",
        method: "GET",
      },
    },
  }
  server.stdin.write(JSON.stringify(detailsMessage) + "\n")
}, 2000)

// Step 4: Also try POST method for /api/profile
setTimeout(() => {
  console.log("\n4. Getting details for POST /api/profile endpoint...")
  const postDetailsMessage = {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "get_endpoint_details",
      arguments: {
        path: "/api/profile",
        method: "POST",
      },
    },
  }
  server.stdin.write(JSON.stringify(postDetailsMessage) + "\n")
}, 3000)

// Step 5: List schemas to see if there are profile-related schemas
setTimeout(() => {
  console.log("\n5. Listing schemas for profile-related models...")
  const schemasMessage = {
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: {
      name: "list_schemas",
      arguments: {
        search: "profile",
      },
    },
  }
  server.stdin.write(JSON.stringify(schemasMessage) + "\n")
}, 4000)

// Cleanup after all tests
setTimeout(() => {
  console.log("\n6. Test completed. Shutting down server...")
  server.kill()
}, 5000)

server.on("close", (code) => {
  console.log(`\nServer process exited with code ${code}`)
  console.log("\n=== Test Summary ===")
  console.log("Total responses received:", responses.length)
})
