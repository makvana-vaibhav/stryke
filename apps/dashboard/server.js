const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.DASHBOARD_PORT || 3000);
const SRC_DIR = path.join(__dirname, "src");

const contentTypeByExt = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requestPath).replace(/^\.\.(\/|\\|$)/, "");
  const filePath = path.join(SRC_DIR, safePath);

  if (!filePath.startsWith(SRC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": contentTypeByExt[ext] || "text/plain; charset=utf-8" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`[dashboard] running at http://localhost:${PORT}`);
});
