import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../../store/auth";
import Modal from "../../components/Modal";

const fetchUsers = async () => {
  const response = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function UserList() {
  const [users, { refetch }] = createResource(fetchUsers);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [formData, setFormData] = createSignal({
    username: "",
    password: "",
    fullName: "",
    role: "TECHNICIAN",
    email: "",
  });

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      role: "TECHNICIAN",
      email: "",
    });
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      ...user,
      password: "", // Don't show password, optional to update
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData(), [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit() ? `/api/users/${formData().id}` : "/api/users";
    const method = isEdit() ? "PUT" : "POST";

    // Remove empty password if editing and not changing it
    const payload = { ...formData() };
    if (isEdit() && !payload.password) delete payload.password;

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
        alert(
          isEdit()
            ? "User updated successfully!"
            : "User created successfully!",
        );
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "Failed to save user"));
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authStore.token()}` },
      });

      if (response.ok) {
        refetch();
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={openAddModal}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add User
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="p-4 font-semibold text-gray-600">Username</th>
              <th class="p-4 font-semibold text-gray-600">Full Name</th>
              <th class="p-4 font-semibold text-gray-600">Role</th>
              <th class="p-4 font-semibold text-gray-600">Email</th>
              <th class="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={!users.loading}
              fallback={
                <tr>
                  <td colspan="5" class="p-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              }
            >
              <For each={users()}>
                {(user) => (
                  <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td class="p-4 font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td class="p-4 text-gray-600">{user.fullName}</td>
                    <td class="p-4">
                      <span
                        class={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "MANAGER"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td class="p-4 text-gray-600">{user.email}</td>
                    <td class="p-4">
                      <button
                        onClick={() => openEditModal(user)}
                        class="text-blue-600 hover:text-blue-800 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        class="text-red-500 hover:text-red-700 font-medium"
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
        title={isEdit() ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData().username}
              onInput={handleInput}
              disabled={isEdit()}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData().fullName}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData().email}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData().role}
              onInput={handleInput}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Password {isEdit() && "(Leave blank to keep current)"}
            </label>
            <input
              type="password"
              name="password"
              value={formData().password}
              onInput={handleInput}
              required={!isEdit()}
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              {isEdit() ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
