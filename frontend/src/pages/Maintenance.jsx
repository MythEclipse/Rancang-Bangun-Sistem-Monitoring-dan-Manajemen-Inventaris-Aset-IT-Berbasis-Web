import { createResource, Show, For } from "solid-js";
import { authStore } from "../store/auth";

const fetchMaintenance = async () => {
  const response = await fetch("/api/maintenance", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Maintenance() {
  const [logs] = createResource(fetchMaintenance);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Maintenance Logs</h2>
        <Show when={authStore.hasRole(["ADMIN", "TECHNICIAN"])}>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + New Log
          </button>
        </Show>
      </div>

      <div class="space-y-4">
        <Show
          when={!logs.loading}
          fallback={
            <p class="text-center text-gray-500 py-8">Loading logs...</p>
          }
        >
          <For each={logs()}>
            {(log) => (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {log.maintenanceNumber}
                    </span>
                    <span
                      class={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        log.priority === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : log.priority === "MEDIUM"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {log.priority}
                    </span>
                  </div>
                  <h3 class="text-lg font-bold text-gray-800">{log.title}</h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {log.description || "No description."}
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : log.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {log.status}
                  </span>
                  <button class="text-gray-400 hover:text-gray-600">➔</button>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
