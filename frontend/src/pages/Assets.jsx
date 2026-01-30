import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../store/auth";
import Modal from "../components/Modal";

const fetchAssets = async () => {
  const response = await fetch("/api/assets", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Assets() {
  const [assets, { refetch }] = createResource(fetchAssets);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: "",
    brand: "",
    status: "ACTIVE",
    condition: "GOOD",
    price: 0,
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      status: "ACTIVE",
      condition: "GOOD",
      price: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (asset) => {
    setFormData({
      ...asset,
      // Ensure numeric/date fields handle nicely
      price: asset.price || 0,
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split("T")[0] : "",
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
    const url = isEdit() ? `/api/assets/${formData().id}` : "/api/assets";
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
        alert(isEdit() ? "Asset updated!" : "Asset created!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to save asset"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Assets Inventory</h2>
        <Show when={authStore.hasRole(["ADMIN"])}>
          <button
            onClick={openAddModal}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
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
                      <Show when={authStore.hasRole(["ADMIN", "TECHNICIAN"])}>
                        <button
                          onClick={() => openEditModal(asset)}
                          class="text-indigo-600 hover:text-indigo-800"
                        >
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

      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title={isEdit() ? "Edit Asset" : "Add New Asset"}
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
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData().brand}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData().status}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="REPAIR">Repair</option>
                <option value="BROKEN">Broken</option>
                <option value="DISPOSED">Disposed</option>
                <option value="MISSING">Missing</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                name="condition"
                value={formData().condition}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              >
                <option value="NEW">New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Price (IDR)
              </label>
              <input
                type="number"
                name="price"
                value={formData().price}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Purchase Date */}
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData().purchaseDate}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
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
              {isEdit() ? "Update Asset" : "Create Asset"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
