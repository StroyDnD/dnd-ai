import { AuthModal } from "@/components/AuthModal";
import { Layout } from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import Campaign from "@/pages/Campaign";
import CreateStory from "@/pages/CreateStory";
import { Home } from "@/pages/Home";
import { Route, Routes } from "react-router";
export const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-campaign" element={<CreateStory />} />
          <Route path="/campaign" element={<Campaign />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
      <AuthModal />
    </>
  );
};
