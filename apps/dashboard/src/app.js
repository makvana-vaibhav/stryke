const API_BASE_URL = "http://localhost:4000";

const form = document.getElementById("deploymentForm");
const message = document.getElementById("message");
const deploymentsOutput = document.getElementById("deploymentsOutput");
const serverSelect = document.getElementById("serverId");
const refreshBtn = document.getElementById("refreshBtn");

const setMessage = (text, type) => {
  message.textContent = text;
  message.className = `message ${type || ""}`.trim();
};

const parseEnvVars = (text) => {
  const result = {};
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) {
      throw new Error(`Invalid env var format: ${line}`);
    }

    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();

    if (!key) {
      throw new Error(`Invalid env var key in line: ${line}`);
    }

    result[key] = value;
  }

  return result;
};

const loadServers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/servers`);
    if (!res.ok) throw new Error("Failed to load servers");

    const data = await res.json();
    serverSelect.innerHTML = "";

    for (const server of data.items || []) {
      const option = document.createElement("option");
      option.value = server.id;
      option.textContent = server.name;
      serverSelect.appendChild(option);
    }
  } catch (err) {
    setMessage(err.message || "Unable to load servers", "error");
  }
};

const loadDeployments = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/deployments`);
    if (!res.ok) throw new Error("Failed to load deployments");

    const data = await res.json();
    deploymentsOutput.textContent = JSON.stringify(data.items || [], null, 2);
  } catch (err) {
    deploymentsOutput.textContent = `Error: ${err.message || "Failed to fetch"}`;
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    setMessage("Submitting deployment...", "");
    const formData = new FormData(form);

    const payload = {
      repositoryUrl: String(formData.get("repositoryUrl") || "").trim(),
      branch: String(formData.get("branch") || "main").trim() || "main",
      serverId: String(formData.get("serverId") || "").trim(),
      appName: String(formData.get("appName") || "").trim(),
      domain: String(formData.get("domain") || "").trim(),
      port: Number(formData.get("port") || 0),
      envVars: parseEnvVars(String(formData.get("envVars") || ""))
    };

    const res = await fetch(`${API_BASE_URL}/deployments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create deployment");
    }

    setMessage(`Deployment #${data.deployment.id} created`, "success");
    await loadDeployments();
  } catch (err) {
    setMessage(err.message || "Submission failed", "error");
  }
});

refreshBtn.addEventListener("click", () => {
  loadDeployments();
});

loadServers().then(loadDeployments);
