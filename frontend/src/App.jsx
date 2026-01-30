import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import "./index.css";
import ProtectedLayout from "./components/ProtectedLayout";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserList = lazy(() => import("./pages/users/UserList"));
const Assets = lazy(() => import("./pages/Assets"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Requests = lazy(() => import("./pages/Requests"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Locations = lazy(() => import("./pages/admin/Locations"));
const Vendors = lazy(() => import("./pages/admin/Vendors"));

function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={ProtectedLayout}>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users" component={UserList} />
        <Route path="/assets" component={Assets} />
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/requests" component={Requests} />
        <Route path="/categories" component={Categories} />
        <Route path="/locations" component={Locations} />
        <Route path="/vendors" component={Vendors} />
      </Route>
    </Router>
  );
}

export default App;
