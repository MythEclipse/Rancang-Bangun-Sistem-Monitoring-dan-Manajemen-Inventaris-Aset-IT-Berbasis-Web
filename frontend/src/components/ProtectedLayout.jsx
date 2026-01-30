import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function ProtectedLayout(props) {
  const navigate = useNavigate();

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  });

  return <>{props.children}</>;
}
