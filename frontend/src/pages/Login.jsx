import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { authStore } from "../store/auth";

export default function Login() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username(), password: password() }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      authStore.login(data.accessToken, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-sm">
        <h3 class="text-2xl font-bold text-center text-gray-800">
          IT Asset Manager
        </h3>
        <form onSubmit={handleLogin}>
          <div class="mt-4">
            <label class="block text-gray-700" for="username">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700" for="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error() && <p class="text-red-500 text-sm mt-2">{error()}</p>}
          <div class="flex items-baseline justify-between">
            <button
              class="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full transition duration-300"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
