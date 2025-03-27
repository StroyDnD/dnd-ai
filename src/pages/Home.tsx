import { Button } from "@/components/ui/button";
import { BookOpen, Sword, Shield, Map } from "lucide-react";
import { useNavigate, Link } from "react-router";
import landingBackground from '@/images/landing-bg.png';

export const Home = () => {
  return (
    <main className="relative min-h-screen font-display text-yellow-100">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={landingBackground}
          alt="Hero background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000aa] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <section className="pt-32 pb-20 text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-md">
              Create Epic D&D <br />
              <span className="text-yellow-300">Campaigns in Minutes</span>
            </h1>
            <div className="mt-8">
              <Button
                asChild
                className="text-lg px-8 py-4 rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-200 transition shadow-lg"
              >
                <Link to="/create-campaign">
                  <Sword className="mr-2 h-5 w-5" />
                  Build Your Campaign
                </Link>
              </Button>
            </div>
          </section>

          {/* How It Works */}
          <section className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-yellow-200 mb-2 drop-shadow">
              How It Works
            </h2>
            <p className="text-lg text-yellow-100/90 max-w-2xl mx-auto">
              Our campaign generator makes it easy to build a complete D&D adventure in just a few steps.
            </p>
          </section>

          {/* Features */}
          <section className="pb-24">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">🌍 World Building</h3>
                <p className="text-sm text-white/90">
                  Define your world’s core conflicts, environments, and magic levels to create a rich foundation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">📖 Campaign Structure</h3>
                <p className="text-sm text-white/90">
                  Set up your campaign’s level range, story arcs, and decide how linear or sandbox it should be.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">🎒 Complete Package</h3>
                <p className="text-sm text-white/90">
                  Get NPCs, locations, encounters, and plot hooks ready to use in your next D&D session.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
