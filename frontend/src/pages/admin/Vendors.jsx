import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../../store/auth";
import Modal from "../../components/Modal";

const fetchVendors = async () => {
  const response = await fetch("/api/vendors", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function Vendors() {
  const [vendors, { refetch }] = createResource(fetchVendors);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: "",
    code: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    website: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      website: "",
    });
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setFormData(vendor);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit() ? `/api/vendors/${formData().id}` : "/api/vendors";
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
        alert(isEdit() ? "Vendor updated!" : "Vendor created!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to save vendor"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token()}`,
        },
      });

      if (response.ok) {
        refetch();
        alert("Vendor deleted successfully!");
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to delete vendor"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Vendors</h2>
        <button
          onClick={openAddModal}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add Vendor
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Show
          when={!vendors.loading}
          fallback={
            <p class="col-span-2 text-center text-gray-500 py-8">
              Loading vendors...
            </p>
          }
        >
          <For each={vendors()}>
            {(vendor) => (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-800">
                      {vendor.name}
                    </h3>
                    <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 inline-block mt-1">
                      {vendor.code}
                    </span>
                  </div>
                </div>

                <div class="space-y-2 text-sm text-gray-600 mb-4">
                  <Show when={vendor.contactPerson}>
                    <p>
                      <span class="font-medium">Contact:</span> {vendor.contactPerson}
                    </p>
                  </Show>
                  <Show when={vendor.email}>
                    <p>
                      <span class="font-medium">Email:</span> {vendor.email}
                    </p>
                  </Show>
                  <Show when={vendor.phone}>
                    <p>
                      <span class="font-medium">Phone:</span> {vendor.phone}
                    </p>
                  </Show>
                  <Show when={vendor.city}>
                    <p>
                      <span class="font-medium">City:</span> {vendor.city}
                    </p>
                  </Show>
                  <Show when={vendor.website}>
                    <p>
                      <span class="font-medium">Website:</span>{" "}
                      <a
                        href={vendor.website}
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        {vendor.website}
                      </a>
                    </p>
                  </Show>
                </div>

                <div class="flex justify-end gap-2 text-sm font-medium pt-4 border-t">
                  <button
                    onClick={() => openEditModal(vendor)}
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
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
        title={isEdit() ? "Edit Vendor" : "Add New Vendor"}
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
            <label class="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData().contactPerson}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData().email}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData().phone}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData().city}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData().website}
                onInput={handleInput}
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData().address}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              rows="2"
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
