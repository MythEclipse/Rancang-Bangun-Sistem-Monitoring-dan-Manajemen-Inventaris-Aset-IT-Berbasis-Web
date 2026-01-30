import { createResource, Show, For } from "solid-js";
import { authStore } from "../store/auth";

const fetchStats = async () => {
  const response = await fetch("/api/dashboard/stats", {
    headers: { Authorization: `Bearer ${authStore.token()}` },
  });
  return response.json();
};

const StatCard = (props) => (
  <div class={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${props.color}`}>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {props.title}
        </p>
        <p class="mt-2 text-3xl font-bold text-gray-900">{props.value}</p>
      </div>
      <div class={`p-3 rounded-full ${props.iconBg} text-white`}>
        {props.icon}
      </div>
    </div>
    <Show when={props.subtext}>
      <p class="mt-3 text-xs text-gray-400">{props.subtext}</p>
    </Show>
  </div>
);

export default function Dashboard() {
  const [stats] = createResource(fetchStats);

  return (
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {authStore.user()?.fullName}
      </h2>

      <Show when={stats.loading}>
        <div class="flex justify-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Show>

      <Show when={!stats.loading && stats()}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Assets"
            value={stats().assets.total}
            icon="💼"
            color="border-blue-500"
            iconBg="bg-blue-500"
            subtext={`${stats().assets.active} Active, ${stats().assets.repair} Repair`}
          />
          <StatCard
            title="Maintenance"
            value={stats().maintenance.total}
            icon="🔧"
            color="border-orange-500"
            iconBg="bg-orange-500"
            subtext={`${stats().maintenance.inProgress} In Progress`}
          />
          <StatCard
            title="Requests"
            value={stats().requests.total}
            icon="📝"
            color="border-purple-500"
            iconBg="bg-purple-500"
            subtext={`${stats().requests.pending} Pending`}
          />
          <Show when={authStore.user()?.role === "ADMIN"}>
            <StatCard
              title="Users"
              value={stats().users.total}
              icon="👥"
              color="border-green-500"
              iconBg="bg-green-500"
              subtext={`${stats().users.technicians} Techs, ${stats().users.managers} Managers`}
            />
          </Show>
        </div>

        {/* Role Specific Content */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity or Charts could go here */}
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <Show when={authStore.user()?.role === "TECHNICIAN"}>
                <button class="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition">
                  + Create New Maintenance Log
                </button>
                <button class="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition">
                  + Submit New Request
                </button>
              </Show>
              <Show when={authStore.user()?.role === "ADMIN"}>
                <button class="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition">
                  + Add New User
                </button>
                <button class="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition">
                  + Add New Asset
                </button>
              </Show>
              <Show when={authStore.user()?.role === "MANAGER"}>
                <button class="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700 font-medium transition">
                  Review Pending Requests ({stats().pendingApprovals || 0})
                </button>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
