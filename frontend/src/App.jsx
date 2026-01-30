import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import "./index.css";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  );
}

export default App;
