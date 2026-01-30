import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import "./index.css";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={ProtectedLayout}>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
      </Route>
    </Router>
  );
}

export default App;
