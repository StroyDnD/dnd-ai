import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { randProductAdjective, randAnimal } from "@ngneat/falso";

export const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    login,
    signup,
    authLoading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const randomUsername = useMemo(() => {
    return `${randProductAdjective()} ${randAnimal()}`;
  }, []);

  const handleButtonPress = () => {
    if (mode === "login") {
      login(email, password);
    } else {
      signup(email, password, username || randomUsername);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="bg-white border-none">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Login" : "Register"}</DialogTitle>
          <AuthError />
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          {mode === "register" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <Input
                placeholder={`${randomUsername}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <button
            disabled={authLoading}
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={handleButtonPress}
          >
            {authLoading
              ? "Loading..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
          <span className="text-gray-500 block text-center">or</span>
          <button
            className="text-gray-500 hover:text-purple-500 cursor-pointer"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AuthError = () => {
  const { authError } = useAuth();
  if (!authError) return null;
  return <div className="text-red-500">{authError}</div>;
};
