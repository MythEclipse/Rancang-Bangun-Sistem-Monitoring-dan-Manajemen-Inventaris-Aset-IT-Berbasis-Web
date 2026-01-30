import { createResource, createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";

const fetchAssets = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/assets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return response.json();
};

export default function Dashboard() {
  const [assets, { refetch }] = createResource(fetchAssets);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div class="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside class="w-64 bg-white shadow-md hidden md:block">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-blue-600">AssetMgr</h1>
        </div>
        <nav class="mt-6">
          <a
            href="#"
            class="block px-6 py-2 text-gray-700 hover:bg-gray-100 bg-gray-100 border-r-4 border-blue-600"
          >
            Dashboard
          </a>
          <a href="#" class="block px-6 py-2 text-gray-600 hover:bg-gray-100">
            Assets
          </a>
          <a href="#" class="block px-6 py-2 text-gray-600 hover:bg-gray-100">
            Reports
          </a>
          <a href="#" class="block px-6 py-2 text-gray-600 hover:bg-gray-100">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main class="flex-1 overflow-y-auto">
        <header class="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
          <button onClick={logout} class="text-gray-600 hover:text-red-600">
            Logout
          </button>
        </header>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="p-4 bg-white rounded-lg shadow-sm">
              <h3 class="text-gray-500 text-sm">Total Assets</h3>
              <p class="text-2xl font-bold">{assets()?.length || 0}</p>
            </div>
            {/* More stats */}
          </div>

          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b">
              <h3 class="font-semibold text-gray-800">Recent Assets</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 border-b">
                  <tr>
                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <Show when={assets.loading}>
                    <tr>
                      <td colSpan="4" class="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  </Show>
                  <Show when={assets.error}>
                    <tr>
                      <td
                        colSpan="4"
                        class="px-6 py-4 text-center text-red-500"
                      >
                        Error loading assets. Please login again.
                      </td>
                    </tr>
                  </Show>
                  <For each={assets()}>
                    {(asset) => (
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">
                          {asset.assetCode}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                          {asset.name}
                        </td>
                        <td class="px-6 py-4 text-sm">
                          <span
                            class={`px-2 py-1 text-xs rounded-full ${asset.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                          {asset.categoryId}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
