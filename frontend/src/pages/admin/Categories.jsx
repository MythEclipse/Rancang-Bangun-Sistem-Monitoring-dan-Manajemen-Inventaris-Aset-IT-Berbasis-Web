import { createResource, Show, For } from "solid-js";
import { authStore } from "../../store/auth";

const fetchCategories = async () => {
  const response = await fetch("/api/categories", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Categories() {
  const [categories] = createResource(fetchCategories);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Categories</h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Add Category
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Show when={!categories.loading} fallback={<p>Loading...</p>}>
          <For each={categories()}>
            {(cat) => (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-4">
                  <div class="text-3xl">{cat.icon}</div>
                  <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {cat.code}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-800">{cat.name}</h3>
                <p class="text-sm text-gray-500 mt-2 mb-4">
                  {cat.description || "No description provided."}
                </p>
                <div class="flex justify-end gap-2 text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
