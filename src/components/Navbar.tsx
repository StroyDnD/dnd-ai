import { useAuth } from '../providers/AuthProvider'

export const Navbar = () => {
  const {user, logout, setShowAuthModal} = useAuth()
  const handleLoginClick = () => {
    setShowAuthModal(true)
  }

  const handleLogoutClick = () => {
    logout();
  }

  return (
    <div
      className="w-full flex items-center bg-transparent absolute top-0 left-0 h-20 z-20"
      style={{ pointerEvents: "none" }}
    >
      <nav className="w-full px-5">
        <div className="flex flex-row-reverse items-center justify-between">
          {user ? (
            <button
              className="cursor-pointer text-white font-thin px-3 py-1 bg-white/20 rounded-full"
              onClick={handleLogoutClick}
              style={{ pointerEvents: "auto" }} // allow clicks on button
            >
              Logout
            </button>
          ) : (
            <button
              className="cursor-pointer text-white font-thin px-3 py-1 bg-white/20 rounded-full"
              onClick={handleLoginClick}
              style={{ pointerEvents: "auto" }} // allow clicks on button
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}