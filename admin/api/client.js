const API_BASE = "http://localhost:4000/api";

function token() {
  return localStorage.getItem("admin_token");
}

async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

window.api = api;
