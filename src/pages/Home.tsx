import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target, Sword, Shield, Map } from "lucide-react";
import { useNavigate, Link } from "react-router";
import landingBackground from '@/images/landing-background.jpg';

export const Home = () => {

  return  (
    <main className="relative min-h-screen">
      {/* Hero Image with Fade */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-screen">
          <img
            src={landingBackground}
            alt="Hero background"
            className="object-cover w-full h-full"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-16 sm:py-24 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
                Create Epic D&D Campaigns in Minutes
              </h1>
              <p className="text-xl text-primary/80 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 rounded-lg p-4">
                Transform your ideas into captivating campaigns with our AI-powered D&D campaign generator. 
                Answer a few questions about your world, and watch a complete campaign outline come to life.
              </p>
              <div className="pt-4 relative">
                <Button className="text-lg px-8 py-6 bg-primary text-white hover:bg-primary/90" asChild>
                  <Link to="/create-campaign">
                    <Sword className="mr-2 h-5 w-5" />
                    Build Your Campaign
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-12 sm:py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary">How It Works</h2>
              <p className="text-xl text-primary/80 max-w-2xl mx-auto mt-4">
                Our campaign generator makes it easy to build a complete D&D adventure in just a few steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">World Building</h3>
                <p className="text-primary/80">
                  Define your world's core conflicts, environments, and magic levels to create a rich foundation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Campaign Structure</h3>
                <p className="text-primary/80">
                  Set up your campaign's level range, story arcs, and decide how linear or sandbox it should be.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Complete Package</h3>
                <p className="text-primary/80">
                  Get NPCs, locations, encounters, and plot hooks ready to use in your next D&D session.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-4">Ready to Begin Your Adventure?</h2>
              <p className="text-xl text-primary/80 mb-8">
                Join thousands of Dungeon Masters who have created unforgettable campaigns with our tool.
              </p>
              <Button className="text-lg px-8 py-6 bg-primary text-white hover:bg-primary/90" asChild>
                <Link to="/create-campaign">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Your Campaign
                </Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="py-8 bg-white/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 text-center text-primary/60">
            <p>&copy; {new Date().getFullYear()} Story Generator. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
};