import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="">
      {/* <Navbar /> */}
      <main className="">
        <Outlet />
      </main>
      <footer className="">
        <p>© 2025 Story AI</p>
      </footer>
    </div>
  );
};