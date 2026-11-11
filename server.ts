import { file } from "bun";

const PORT = 3000;

// MIME type mapping
const mimeTypes: Record<string, string> = {
  ".ts": "application/javascript",
  ".js": "application/javascript",
  ".json": "application/json",
  ".html": "text/html",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    if (path === "/") {
        path = "/projects/testcard1/index.html";
    } else if (path.endsWith("/")) {
        // Serve index.html for directory requests
        path = path + "index.html";
    }

    const filePath = `.${path}`;
    const targetFile = file(filePath);

    if (await targetFile.exists()) {
      // Get file extension
      const ext = path.substring(path.lastIndexOf("."));
      
      // Handle TypeScript transpilation for browser modules
      if (ext === ".ts") {
        const result = await Bun.build({
          entrypoints: [filePath],
          format: "esm",
        });
        
        if (!result.success) {
          return new Response(`Build error: ${result.logs.join('\n')}`, { status: 500 });
        }
        
        const transpiled = await result.outputs[0]!.text();
        
        return new Response(transpiled, {
          headers: { "Content-Type": "application/javascript" }
        });
      }
      
      // Serve other file types normally
      const contentType = mimeTypes[ext] || "application/octet-stream";
      return new Response(targetFile, {
        headers: { "Content-Type": contentType }
      });
    }

    return new Response("File not found", { status: 404 });
  },
});

console.log(`Babylon.js server running at http://localhost:${PORT}`);