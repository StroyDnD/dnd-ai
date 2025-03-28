import { BookOpen, Sword, Shield, Map, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import landingBackground from '@/images/landing-bg.png';

export const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToCreateCampaign = () => {
    navigate('/create-campaign');
  };

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
          <section className="pt-16 pb-18 text-center text-title">
            <h1 className="text-6xl md:text-7xl font-semibold leading-tight drop-shadow-md font-signika">
              Create Epic D&D <br />
              <span className="">Campaigns in Minutes</span>
            </h1>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleNavigateToCreateCampaign}
                className="flex items-center gap-2 justify-center text-2xl px-8 py-5 rounded-full bg-title text-gray-900 hover:bg-yellow-200 transition shadow-lg font-signika"
              >
                <ArrowRight className="mr-1 h-7 w-7" />
                Build Your Campaign
              </button>
            </div>
          </section>

          {/* How It Works */}
          <section className="text-center mb-18">
            <h2 className="text-4xl font-semibold text-yellow-200 mb-6 drop-shadow tracking-wide font-signika">
              How It Works
            </h2>
            <p className="text-xl tracking-wider text-yellow-100/90 max-w-2xl mx-auto font-signika">
              Our campaign generator makes it easy to build a complete D&D adventure in just a few steps.
            </p>
          </section>

          {/* Features */}
          <section className="pb-24">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 font-signika">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-2">🌍 World Building</h3>
                <p className="text-lg text-white/90">
                  Define your world's core conflicts, environments, and magic levels to create a rich foundation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-2">📖 Campaign Structure</h3>
                <p className="text-lg text-white/90">
                  Set up your campaign's level range, story arcs, and decide how linear or sandbox it should be.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-2">🎒 Complete Package</h3>
                <p className="text-lg text-white/90">
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
