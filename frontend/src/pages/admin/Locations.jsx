import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../../store/auth";
import Modal from "../../components/Modal";

const fetchLocations = async () => {
  const response = await fetch("/api/locations", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Locations() {
  const [locations, { refetch }] = createResource(fetchLocations);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: "",
    code: "",
    building: "",
    floor: "",
    room: "",
    address: "",
    city: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      building: "",
      floor: "",
      room: "",
      address: "",
      city: "",
      description: "",
    });
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (loc) => {
    setFormData(loc);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit() ? `/api/locations/${formData().id}` : "/api/locations";
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
        alert(isEdit() ? "Location updated!" : "Location created!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to save location"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token()}`,
        },
      });

      if (response.ok) {
        refetch();
        alert("Location deleted successfully!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to delete location"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Locations</h2>
        <button
          onClick={openAddModal}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add Location
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="p-4 font-semibold text-gray-600">Code</th>
              <th class="p-4 font-semibold text-gray-600">Name</th>
              <th class="p-4 font-semibold text-gray-600">Building</th>
              <th class="p-4 font-semibold text-gray-600">Floor/Room</th>
              <th class="p-4 font-semibold text-gray-600">City</th>
              <th class="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={!locations.loading}
              fallback={
                <tr>
                  <td colspan="6" class="p-8 text-center text-gray-500">
                    Loading locations...
                  </td>
                </tr>
              }
            >
              <For each={locations()}>
                {(loc) => (
                  <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td class="p-4 font-mono text-sm text-gray-500">
                      {loc.code}
                    </td>
                    <td class="p-4 font-medium text-gray-900">{loc.name}</td>
                    <td class="p-4 text-gray-600">{loc.building || "-"}</td>
                    <td class="p-4 text-gray-600">
                      {loc.floor && loc.room ? `${loc.floor}/${loc.room}` : "-"}
                    </td>
                    <td class="p-4 text-gray-600">{loc.city || "-"}</td>
                    <td class="p-4 text-sm font-medium">
                      <button
                        onClick={() => openEditModal(loc)}
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        class="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
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
        title={isEdit() ? "Edit Location" : "Add New Location"}
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
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Building
              </label>
              <input
                type="text"
                name="building"
                value={formData().building}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData().floor}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Room
              </label>
              <input
                type="text"
                name="room"
                value={formData().room}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData().city}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData().address}
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
