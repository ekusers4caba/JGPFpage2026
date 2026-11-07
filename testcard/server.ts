
const PORT = 3001;

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

    // Serve index.html when visiting the root
    if (path === "/") {
      path = "/index.html";
    }

    // Resolve files relative to the current directory
    const filePath = `.${path}`;
    const targetFile = Bun.file(filePath);

    if (await targetFile.exists()) {
      const ext = path.substring(path.lastIndexOf("."));

      // Transpile TypeScript for browser modules
      if (ext === ".ts") {
        const result = await Bun.build({
          entrypoints: [filePath],
          format: "esm",
        });

        if (!result.success) {
          return new Response(
            `Build error: ${result.logs.join("\n")}`,
            { status: 500 }
          );
        }

        const output = result.outputs[0];

        if (!output) {
          return new Response("Transpilation failed", {
            status: 500,
          });
        }

        return new Response(await output.text(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      }

      // Serve other files
      return new Response(targetFile, {
        headers: {
          "Content-Type":
            mimeTypes[ext] || "application/octet-stream",
        },
      });
    }

    return new Response("File not found: " + path, {
      status: 404,
    });
  },
});

console.log(`Server running at http://localhost:${PORT}`);
