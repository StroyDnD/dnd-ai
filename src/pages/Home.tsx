import { BookOpen, Sword, Shield, Map, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import landingBackground from "@/images/landing-bg.png";

export const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToCreateCampaign = () => {
    navigate("/create-campaign");
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
            <p className="text-xl tracking-wider text-yellow-100/90 max-w-2xl mx-auto font-signika">
              Our campaign generator is designed for ease and flexibility,
              giving you full control to create a custom D&D adventure tailored
              to your style.
            </p>
          </section>

          {/* Features */}
          <section className="pb-24">
            <h2 className="flex justify-center text-4xl font-semibold text-title mb-6 drop-shadow tracking-wider font-signika">
              How it Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 font-signika">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-2xl font-semibold mb-3">World Creation</h3>
                <p className="text-lg text-white/90">
                  Define your setting, factions, magic, and conflicts through guided prompts.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl mb-3">🛠️</div>
                <h3 className="text-2xl font-semibold mb-3">
                  Campaign Builder
                </h3>
                <p className="text-lg text-white/90">
                  Set level range, story arcs, and structure with AI-assisted tools.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-2xl font-semibold mb-3">
                  Ready-to-Play Package
                </h3>
                <p className="text-lg text-white/90">
                  Download a full campaign with maps, NPCs, encounters, and art.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
