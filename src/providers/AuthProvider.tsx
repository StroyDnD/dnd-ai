import supabase from '@/utils/supabase';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Define the user type
interface User {
  id: string;
  email: string;
  username?: string;
  // Add other user properties as needed
}

// Define the context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username?: string | null) => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  showUserDrawer: boolean;
  setShowUserDrawer: (show: boolean) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      // log in with supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      const newUser = data.user;
      console.log('newUser', newUser);
      setUser({
        id: newUser.id,
        email: newUser.email || '',
      });
      setShowAuthModal(false);
    } catch (err) {
      console.error('Login error:');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setAuthError(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      navigate('/');
      setAuthLoading(false);
    }
  };

  const signup = async (email: string, password: string, username?: string | null) => {
    try {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) {
        throw error;
      }
      const newUser = data.user;
      if (!newUser) {
        throw new Error('New user not found');
      }
      setUser({
        id: newUser.id, 
        email: newUser.email || '',
      });
      setAuthError(null);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Check active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        })
      } else {
        setUser(null)
      }
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          })
        } else {
          setUser(null)
        }
      }
    )
    
    // Cleanup on unmount
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, setShowAuthModal, signup, authLoading, setAuthLoading, authError, setAuthError, showUserDrawer, setShowUserDrawer }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
