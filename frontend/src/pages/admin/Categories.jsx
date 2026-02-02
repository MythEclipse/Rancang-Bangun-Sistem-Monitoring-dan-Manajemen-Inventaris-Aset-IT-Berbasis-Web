import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../../store/auth";
import Modal from "../../components/Modal";

const fetchCategories = async () => {
  const response = await fetch("/api/categories", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Categories() {
  const [categories, { refetch }] = createResource(fetchCategories);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: "",
    code: "",
    description: "",
    icon: "",
    maintenanceIntervalDays: 30,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      icon: "",
      maintenanceIntervalDays: 30,
    });
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setFormData({
      ...cat,
      maintenanceIntervalDays: cat.maintenanceIntervalDays || 30,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData(), [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit() ? `/api/categories/${formData().id}` : "/api/categories";
    const method = isEdit() ? "PUT" : "POST";

    const payload = { ...formData() };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        refetch();
        alert(isEdit() ? "Category updated!" : "Category created!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to save category"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token()}`,
        },
      });

      if (response.ok) {
        refetch();
        alert("Category deleted successfully!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to delete category"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={openAddModal}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add Category
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Show when={!categories.loading} fallback={<p>Loading...</p>}>
          <For each={categories()}>
            {(cat) => (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-4">
                  <div class="text-3xl">{cat.icon || "📦"}</div>
                  <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {cat.code}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-800">{cat.name}</h3>
                <p class="text-sm text-gray-500 mt-2 mb-4">
                  {cat.description || "No description provided."}
                </p>
                <Show when={cat.maintenanceIntervalDays}>
                  <p class="text-xs text-gray-400 mb-4">
                    Maintenance interval: {cat.maintenanceIntervalDays} days
                  </p>
                </Show>
                <div class="flex justify-end gap-2 text-sm font-medium">
                  <button
                    onClick={() => openEditModal(cat)}
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    class="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>

      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title={isEdit() ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData().name}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={formData().code}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              required
              disabled={isEdit()}
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Icon</label>
            <input
              type="text"
              name="icon"
              placeholder="e.g., 💻 or 📦"
              value={formData().icon}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            />
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
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Maintenance Interval (days)
            </label>
            <input
              type="number"
              name="maintenanceIntervalDays"
              value={formData().maintenanceIntervalDays}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              min="1"
            />
          </div>

          <div class="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isEdit() ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
