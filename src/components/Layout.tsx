import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="">
      {/* <Navbar /> */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};