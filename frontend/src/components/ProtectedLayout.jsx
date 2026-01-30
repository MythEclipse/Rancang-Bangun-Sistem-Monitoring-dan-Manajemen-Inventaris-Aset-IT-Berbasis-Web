import { useNavigate } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { authStore } from "../store/auth";
import Sidebar from "./Sidebar";

export default function ProtectedLayout(props) {
  const navigate = useNavigate();

  onMount(() => {
    if (!authStore.isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <div class="flex h-screen bg-gray-100 font-sans">
      <Show when={authStore.isAuthenticated()}>
        <Sidebar />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {props.children}
        </main>
      </Show>
    </div>
  );
}
