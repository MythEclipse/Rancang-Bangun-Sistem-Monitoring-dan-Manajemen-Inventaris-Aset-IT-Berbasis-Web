import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../store/auth";
import Modal from "../components/Modal";

const fetchRequests = async () => {
  const response = await fetch("/api/requests", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Requests() {
  const [requests, { refetch }] = createResource(fetchRequests);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [formData, setFormData] = createSignal({
    title: "",
    requestType: "REPLACEMENT",
    priority: "MEDIUM",
    description: "",
  });

  const openAddModal = () => {
    setFormData({
      title: "",
      requestType: "REPLACEMENT",
      priority: "MEDIUM",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/requests", {
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
        alert("Request submitted successfully!");
      } else {
        alert("Failed to submit request");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleStatusChange = async (requestId, action) => {
    const message = action === "APPROVED" ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${message} this request?`)) return;

    try {
      const endpoint = action === "APPROVED" 
        ? `/api/requests/${requestId}/approve` 
        : `/api/requests/${requestId}/reject`;
      
      const payload = action === "APPROVED" 
        ? { notes: "" }
        : { reason: "Rejected by manager" };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        refetch();
        alert(`Request ${message}d successfully!`);
      } else {
        const err = await response.json();
        alert("Failed to update status: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Requests</h2>
        <Show when={authStore.hasRole(["TECHNICIAN"])}>
          <button
            onClick={openAddModal}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + New Request
          </button>
        </Show>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Show
          when={!requests.loading}
          fallback={
            <p class="text-center col-span-2 text-gray-500 py-8">
              Loading requests...
            </p>
          }
        >
          <For each={requests()}>
            {(req) => (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span class="font-mono text-xs text-gray-500 block mb-1">
                      {req.requestNumber}
                    </span>
                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {req.requestType}
                    </span>
                  </div>
                  <span
                    class={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : req.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">
                  {req.title}
                </h3>
                <p class="text-sm text-gray-500 mb-4">
                  {req.description || "No description."}
                </p>

                <Show
                  when={
                    authStore.hasRole(["MANAGER"]) &&
                    req.status === "PENDING_APPROVAL"
                  }
                >
                  <div class="mt-6 flex gap-3 border-t pt-4">
                    <button
                      onClick={() => handleStatusChange(req.id, "APPROVED")}
                      class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, "REJECTED")}
                      class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </Show>
      </div>

      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Request"
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
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="requestType"
              value={formData().requestType}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            >
              <option value="REPLACEMENT">Replacement</option>
              <option value="DISPOSAL">Disposal</option>
              <option value="MAJOR_REPAIR">Major Repair</option>
              <option value="PROCUREMENT_ADDITIONAL">New Procurement</option>
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
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
