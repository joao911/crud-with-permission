import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { UsersTable } from "./pages/UsersTable";
import { DefaultLayout } from "./Layouts";
import { Profile } from "./pages/Profile";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/users" element={<UsersTable />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
