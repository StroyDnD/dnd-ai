import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAuth } from "../providers/AuthProvider";
import { Scroll, X, Home } from "lucide-react";
const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Scroll,
  },
];

export default function UserDrawer() {
  const { showUserDrawer, setShowUserDrawer, user, logout } = useAuth();
  return (
    <Dialog
      open={showUserDrawer}
      onClose={setShowUserDrawer}
      className="relative z-[1000]"
    >
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-xs transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-stone-800 py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-300">
                      {user?.email}
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setShowUserDrawer(false)}
                        className="relative rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <X />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="flex items-center gap-2 text-gray-300 hover:text-gray-100"
                        >
                          <item.icon />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-4 sm:px-6">
                  <button
                    onClick={logout}
                    className="cursor-pointer w-full rounded-md bg-red-900/50 py-2 text-sm font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
