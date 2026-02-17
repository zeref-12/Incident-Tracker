import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Fetch paginated incidents.
 * @param {Object} params – { page, per_page, search, severity, status, service, sort_by, order }
 */
export async function fetchIncidents(params = {}) {
  const { data } = await api.get("/incidents", { params });
  return data;
}

export async function fetchIncident(id) {
  const { data } = await api.get(`/incidents/${id}`);
  return data;
}

export async function createIncident(payload) {
  const { data } = await api.post("/incidents", payload);
  return data;
}

export async function updateIncident(id, payload) {
  const { data } = await api.patch(`/incidents/${id}`, payload);
  return data;
}
