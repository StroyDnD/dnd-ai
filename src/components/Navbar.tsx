import { Settings } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'

export const Navbar = () => {
  const {user, setShowUserDrawer, setShowAuthModal} = useAuth()
  const handleLoginClick = () => {
    setShowAuthModal(true)
  }

  return (
    <div
      className="bg-transparent fixed flex items-center justify-center top-0 bottom-0 right-0 h-20 z-20"
    >
      <nav className="w-full px-5">
            <div className="flex flex-row-reverse items-center justify-between">
              {user ? (
                <button className="cursor-pointer text-white font-thin px-3 py-1 bg-white/20 rounded-full" onClick={() => setShowUserDrawer(true)}>
                  <Settings />
                </button>
              ) : (
                <button className="cursor-pointer text-white font-thin px-3 py-1 bg-white/20 rounded-full" onClick={handleLoginClick}>Login</button>
              )}
            </div>
          </nav>
        </div>
    )
}