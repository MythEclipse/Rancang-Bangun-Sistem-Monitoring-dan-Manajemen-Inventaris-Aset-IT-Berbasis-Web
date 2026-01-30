import { createResource, Show, For } from "solid-js";
import { authStore } from "../store/auth";

const fetchAssets = async () => {
  const response = await fetch("/api/assets", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Assets() {
  const [assets] = createResource(fetchAssets);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Assets Inventory</h2>
        <Show when={authStore.hasRole(["ADMIN"])}>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + New Asset
          </button>
        </Show>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="p-4 font-semibold text-gray-600">Asset Code</th>
              <th class="p-4 font-semibold text-gray-600">Name</th>
              <th class="p-4 font-semibold text-gray-600">Brand</th>
              <th class="p-4 font-semibold text-gray-600">Status</th>
              <th class="p-4 font-semibold text-gray-600">Condition</th>
              <th class="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={!assets.loading}
              fallback={
                <tr>
                  <td colspan="6" class="p-8 text-center text-gray-500">
                    Loading assets...
                  </td>
                </tr>
              }
            >
              <For each={assets()}>
                {(asset) => (
                  <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td class="p-4 font-mono text-sm text-gray-500">
                      {asset.assetCode}
                    </td>
                    <td class="p-4 font-medium text-gray-900">{asset.name}</td>
                    <td class="p-4 text-gray-600">{asset.brand}</td>
                    <td class="p-4">
                      <span
                        class={`px-3 py-1 rounded-full text-xs font-semibold ${
                          asset.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : asset.status === "BROKEN"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td class="p-4 text-sm text-gray-600">{asset.condition}</td>
                    <td class="p-4 text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-800 mr-3">
                        View
                      </button>
                      <Show when={authStore.hasRole(["ADMIN", "TECHNICIAN"])}>
                        <button class="text-indigo-600 hover:text-indigo-800">
                          Edit
                        </button>
                      </Show>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
