import {
  executeMcpTool,
  MCP_TOOLS,
  verifyAdminSecret,
} from './_lib/studio-core.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: 'kramz-portfolio-studio-mcp',
        version: '1.0.0',
      },
      tools: MCP_TOOLS,
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  const { jsonrpc = '2.0', id = 1, method, params = {} } = body

  const headerSecret =
    req.headers?.['x-admin-secret'] ||
    (req.headers?.authorization || '').replace(/^Bearer\s+/i, '')
  const auth = verifyAdminSecret(headerSecret || params?.adminSecret || '')

  try {
    if (method === 'initialize') {
      return res.status(200).json({
        jsonrpc,
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'kramz-portfolio-studio-mcp',
            version: '1.0.0',
          },
        },
      })
    }

    if (method === 'tools/list') {
      return res.status(200).json({
        jsonrpc,
        id,
        result: {
          tools: MCP_TOOLS,
        },
      })
    }

    if (method === 'tools/call') {
      const toolName = params.name
      const toolArgs = params.arguments || {}
      const output = await executeMcpTool(toolName, toolArgs, auth.authorized)
      return res.status(200).json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(output, null, 2),
            },
          ],
          structuredContent: output,
          isError: false,
        },
      })
    }

    return res.status(400).json({
      jsonrpc,
      id,
      error: {
        code: -32601,
        message: `Unsupported JSON-RPC method: ${method}`,
      },
    })
  } catch (err) {
    return res.status(200).json({
      jsonrpc,
      id,
      result: {
        content: [
          {
            type: 'text',
            text: err instanceof Error ? err.message : 'MCP execution error',
          },
        ],
        isError: true,
      },
    })
  }
}
