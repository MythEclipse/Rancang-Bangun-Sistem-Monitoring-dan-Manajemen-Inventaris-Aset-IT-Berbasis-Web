import { createSignal } from "solid-js";

// Initialize state from localStorage if available
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const [token, setToken] = createSignal(storedToken);
const [user, setUser] = createSignal(storedUser);

export const authStore = {
    token,
    user,
    isAuthenticated: () => !!token(),
    login: (accessToken, userData) => {
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
    },
    logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    hasRole: (allowedRoles) => {
        const currentUser = user();
        return currentUser && allowedRoles.includes(currentUser.role);
    },
};
