import { authStore } from "../store/auth";
import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      roles: ["ADMIN", "TECHNICIAN", "MANAGER"],
    },
    {
      label: "Users",
      path: "/users",
      icon: "👥",
      roles: ["ADMIN"],
    },
    {
      label: "Categor.",
      path: "/categories",
      icon: "📁",
      roles: ["ADMIN"],
    },
    {
      label: "Locat.",
      path: "/locations",
      icon: "📍",
      roles: ["ADMIN"],
    },
    {
      label: "Vendors",
      path: "/vendors",
      icon: "🏪",
      roles: ["ADMIN"],
    },
    {
      label: "Assets",
      path: "/assets",
      icon: "💼",
      roles: ["ADMIN", "TECHNICIAN", "MANAGER"],
    },
    {
      label: "Maint.",
      path: "/maintenance",
      icon: "🔧",
      roles: ["ADMIN", "TECHNICIAN", "MANAGER"],
    },
    {
      label: "Reqs",
      path: "/requests",
      icon: "📝",
      roles: ["ADMIN", "TECHNICIAN", "MANAGER"],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div class="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-xl">
      <div class="p-6 border-b border-gray-800">
        <h1 class="text-xl font-bold tracking-wider">IT Asset Mgr</h1>
        <p class="text-xs text-gray-400 mt-1">
          {authStore.user()?.role || "Guest"}
        </p>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <Show when={authStore.hasRole(item.roles)}>
              <li>
                <A
                  href={item.path}
                  class={`flex items-center px-6 py-3 transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white border-r-4 border-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span class="mr-3 text-lg">{item.icon}</span>
                  <span class="font-medium">{item.label}</span>
                </A>
              </li>
            </Show>
          ))}
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center mb-4 px-2">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold mr-3">
            {authStore.user()?.username.charAt(0).toUpperCase()}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium truncate">
              {authStore.user()?.fullName}
            </p>
            <p class="text-xs text-gray-400 truncate">
              {authStore.user()?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            authStore.logout();
            window.location.href = "/login";
          }}
          class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
