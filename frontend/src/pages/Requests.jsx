import { createResource, Show, For } from "solid-js";
import { authStore } from "../store/auth";

const fetchRequests = async () => {
  const response = await fetch("/api/requests", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Requests() {
  const [requests] = createResource(fetchRequests);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Requests</h2>
        <Show when={authStore.hasRole(["TECHNICIAN"])}>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
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

                <Show
                  when={
                    authStore.hasRole(["MANAGER"]) &&
                    req.status === "PENDING_APPROVAL"
                  }
                >
                  <div class="mt-6 flex gap-3 border-t pt-4">
                    <button class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition">
                      Approve
                    </button>
                    <button class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-medium transition">
                      Reject
                    </button>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
