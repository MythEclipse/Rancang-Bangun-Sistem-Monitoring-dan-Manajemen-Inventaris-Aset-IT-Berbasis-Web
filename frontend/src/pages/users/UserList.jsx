import { createResource, Show, For, createSignal } from "solid-js";
import { authStore } from "../../store/auth";

const fetchUsers = async () => {
  const response = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  if (!response.ok) return [];
  return response.json();
};

export default function UserList() {
  const [users, { refetch }] = createResource(fetchUsers);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
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
            <Show when={!users.loading} fallback={
              <tr><td colspan="5" class="p-8 text-center text-gray-500">Loading users...</td></tr>
            }>
              <For each={users()}>
                {(user) => (
                  <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td class="p-4 font-medium text-gray-900">{user.username}</td>
                    <td class="p-4 text-gray-600">{user.fullName}</td>
                    <td class="p-4">
                      <span class={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'MANAGER' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td class="p-4 text-gray-600">{user.email}</td>
                    <td class="p-4">
                      <button class="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                      <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
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
