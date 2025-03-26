import { Layout } from "@/components/Layout";
import CreateStory from "@/pages/CreateStory";
import { Home } from "@/pages/Home";
import { Route, Routes } from "react-router";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create-campaign" element={<CreateStory />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};