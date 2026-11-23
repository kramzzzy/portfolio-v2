import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function studioDevMiddlewarePlugin(): Plugin {
  return {
    name: 'kramz-studio-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/admin') && !url.startsWith('/api/mcp')) {
          return next()
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          }
          const rawBody = Buffer.concat(chunks).toString('utf8')
          const parsedBody = rawBody ? JSON.parse(rawBody) : {}

          const wrappedReq = Object.assign(req, { body: parsedBody })
          const wrappedRes = {
            status(code: number) {
              res.statusCode = code
              return this
            },
            json(payload: unknown) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify(payload))
              return this
            },
          }

          if (url.startsWith('/api/admin')) {
            // @ts-expect-error -- Serverless handler module is plain ESM JS
            const mod = await import('./api/admin.js')
            await mod.default(wrappedReq, wrappedRes)
            return
          }

          if (url.startsWith('/api/mcp')) {
            // @ts-expect-error -- Serverless handler module is plain ESM JS
            const mod = await import('./api/mcp.js')
            await mod.default(wrappedReq, wrappedRes)
            return
          }
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              ok: false,
              error: err instanceof Error ? err.message : 'Vite API middleware error',
            })
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), studioDevMiddlewarePlugin()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/react-icons')) return 'vendor-icons'
          if (id.includes('node_modules/react')) return 'vendor-react'
        },
      },
    },
  },
})
