import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../store/auth";
import Modal from "../components/Modal";

const fetchMaintenance = async () => {
  const response = await fetch("/api/maintenance", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Maintenance() {
  const [logs, { refetch }] = createResource(fetchMaintenance);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [formData, setFormData] = createSignal({
    title: "",
    description: "",
    priority: "MEDIUM",
    assetId: "", // ideally this would be a dropdown selection
    maintenanceType: "PREVENTIVE",
  });

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      assetId: "",
      maintenanceType: "PREVENTIVE",
    });
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token()}`,
        },
        body: JSON.stringify(formData()),
      });

      if (response.ok) {
        setIsModalOpen(false);
        refetch();
        alert("Maintenance log created successfully!");
      } else {
        alert("Failed to create maintenance log");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Maintenance Logs</h2>
        <Show when={authStore.hasRole(["ADMIN", "TECHNICIAN"])}>
          <button
            onClick={openAddModal}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
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
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>

      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Log"
      >
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData().title}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Asset (UUID)
            </label>
            <input
              type="text"
              name="assetId"
              placeholder="Enter Asset UUID"
              value={formData().assetId}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Maintenance Type
            </label>
            <select
              name="maintenanceType"
              value={formData().maintenanceType}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            >
              <option value="PREVENTIVE">Preventive</option>
              <option value="CORRECTIVE">Corrective</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData().priority}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData().description}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              class="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Submit Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
