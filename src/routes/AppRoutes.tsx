import { AuthModal } from "@/components/AuthModal";
import { Layout } from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import UserDrawer from "@/components/UserDrawer";
import Campaign from "@/pages/Campaign";
import CreateStory from "@/pages/CreateStory";
import { Home } from "@/pages/Home";
import { Route, Routes } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
export const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {user ? (
            <>
              <Route path="/create-campaign" element={<CreateStory />} />
              <Route path="/campaigns/:id/edit" element={<CreateStory />} />
              <Route path="/campaigns/:id" element={<Campaign />} />
            </>
          ) : (
            null
          )}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
      <AuthModal />
      <UserDrawer />
    </>
  );
};
