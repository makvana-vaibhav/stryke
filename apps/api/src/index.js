const http = require("http");
const { URL } = require("url");

const PORT = Number(process.env.API_PORT || 4000);

const deployments = [];
let deploymentId = 1;
const servers = [
  { id: "prod-ec2", name: "Production Server (EC2)" },
  { id: "staging-vps", name: "Staging Server (VPS)" }
];

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const applyCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const collectJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });

const validateDeploymentRequest = (body) => {
  const required = ["repositoryUrl", "branch", "serverId", "appName", "domain"];
  for (const key of required) {
    if (!body[key] || typeof body[key] !== "string") {
      return `Missing or invalid field: ${key}`;
    }
  }

  if (!Number.isInteger(body.port) || body.port < 1 || body.port > 65535) {
    return "Missing or invalid field: port";
  }

  if (!body.envVars || typeof body.envVars !== "object" || Array.isArray(body.envVars)) {
    return "Missing or invalid field: envVars";
  }

  const serverExists = servers.some((server) => server.id === body.serverId);
  if (!serverExists) {
    return "Invalid serverId";
  }

  return null;
};

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  applyCors(res);

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      service: "stryke-api",
      redis: "disabled",
      timestamp: new Date().toISOString()
    });
  }

  if (method === "GET" && url.pathname === "/deployments") {
    return sendJson(res, 200, { items: deployments });
  }

  if (method === "GET" && url.pathname === "/servers") {
    return sendJson(res, 200, { items: servers });
  }

  if (method === "POST" && url.pathname === "/deployments") {
    try {
      const body = await collectJsonBody(req);
      const validationError = validateDeploymentRequest(body);

      if (validationError) {
        return sendJson(res, 400, { error: validationError });
      }

      const deployment = {
        id: String(deploymentId++),
        ...body,
        status: "queued",
        createdAt: new Date().toISOString()
      };

      deployments.push(deployment);

      return sendJson(res, 201, {
        message: "Deployment accepted",
        deployment
      });
    } catch (error) {
      return sendJson(res, 400, {
        error: error.message || "Bad request"
      });
    }
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`[api] running at http://localhost:${PORT}`);
});
