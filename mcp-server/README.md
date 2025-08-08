# OpenAPI MCP Server

A Model Context Protocol (MCP) server that allows you to query OpenAPI specifications from your API server.

## Features

- **Fetch OpenAPI Spec**: Load the OpenAPI specification from your API server
- **Query Endpoints**: Search and filter endpoints by path, method, tags, or text
- **Get Endpoint Details**: Get detailed information about specific endpoints
- **List Schemas**: Browse available schemas, parameters, and responses
- **Get Schema Details**: Get detailed information about specific schemas

## Setup

1. **Install dependencies**:

   ```bash
   cd mcp-server
   npm install
   ```

2. **Build the server**:

   ```bash
   npm run build
   ```

3. **Run the server**:
   ```bash
   npm start
   ```

## Development

To run in development mode with hot reloading:

```bash
npm run dev
```

## Available Tools

### `fetch_openapi_spec`

Fetches the OpenAPI specification from `http://localhost/openapi.json`.

**Parameters:**

- `force_refresh` (boolean, optional): Force refresh the cached spec

### `query_endpoints`

Query endpoints based on various criteria.

**Parameters:**

- `path` (string, optional): Filter by path pattern (supports wildcards like `*`)
- `method` (string, optional): Filter by HTTP method (GET, POST, PUT, DELETE, etc.)
- `tags` (array, optional): Filter by tags
- `search` (string, optional): Search in summary and description

### `get_endpoint_details`

Get detailed information about a specific endpoint.

**Parameters:**

- `path` (string, required): The endpoint path
- `method` (string, required): The HTTP method

### `list_schemas`

List all available schemas/components.

**Parameters:**

- `type` (string, optional): Filter by component type (schemas, parameters, responses)
- `search` (string, optional): Search in schema names and descriptions

### `get_schema_details`

Get detailed information about a specific schema.

**Parameters:**

- `name` (string, required): The schema name
- `type` (string, optional): The component type (default: schemas)

## Available Resources

- `openapi://spec`: The complete OpenAPI specification
- `openapi://endpoints`: List of all available endpoints
- `openapi://schemas`: List of all available schemas

## Configuration

The server is configured to fetch the OpenAPI spec from `http://localhost/openapi.json`. To change this URL, modify the `apiBaseUrl` property in the `OpenAPIMCPServer` class.

## Usage Examples

1. **Fetch the OpenAPI spec**:

   ```json
   {
     "name": "fetch_openapi_spec"
   }
   ```

2. **Find all POST endpoints**:

   ```json
   {
     "name": "query_endpoints",
     "arguments": {
       "method": "POST"
     }
   }
   ```

3. **Search for endpoints containing "market"**:

   ```json
   {
     "name": "query_endpoints",
     "arguments": {
       "search": "market"
     }
   }
   ```

4. **Get details for a specific endpoint**:

   ```json
   {
     "name": "get_endpoint_details",
     "arguments": {
       "path": "/api/market/listings",
       "method": "GET"
     }
   }
   ```

5. **List all schemas**:
   ```json
   {
     "name": "list_schemas"
   }
   ```

## Integration with AI Assistants

This MCP server can be integrated with AI assistants that support the Model Context Protocol, allowing them to:

- Understand your API structure
- Generate code examples
- Validate API calls
- Provide better assistance with API-related questions

## License

MIT
