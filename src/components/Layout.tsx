import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};