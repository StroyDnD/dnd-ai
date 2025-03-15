
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target } from "lucide-react";
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
                Create Magical Stories in Minutes
              </h1>
              <p className="text-xl text-primary/80 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 rounded-lg p-4">
                Transform your ideas into captivating tales with our AI-powered story generator. Choose your genre,
                answer a few prompts, and watch your story come to life with beautifully crafted illustrations.
              </p>
              <div className="pt-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-500 opacity-50 blur-xl"></div>
                <Link to="/create-story">
                  <Button className="bg-gradient-to-r from-indigo-900 to-red-500 hover:from-indigo-800 hover:to-indigo-400 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background">
                    Start Your Story
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">How It Works</h2>
              <p className="text-xl text-primary/80">Create your story in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: Target,
                  title: "1. Choose Your Genre",
                  description: "Select from science fiction, mystery, fairy tale, or adventure.",
                },
                {
                  icon: Sparkles,
                  title: "2. Answer Prompts",
                  description: "Tell us about your character and their world through guided questions.",
                },
                {
                  icon: BookOpen,
                  title: "3. Generate Story",
                  description: "Watch as your inputs transform into a complete illustrated story.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-900 to-indigo-500 flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                  <p className="text-primary/80">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* <section className="py-16 sm:py-24">
            <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl p-8 sm:p-12 text-center shadow-xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-500">
                Ready to Write Your Story?
              </h2>
              <p className="text-xl text-primary/80">
                Start creating your story now and bring your imagination to life.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-900 to-indigo-500 hover:from-indigo-800 hover:to-indigo-400 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Start Creating Now
              </Button>
            </div>
          </section> */}
        </div>

        {/* Footer */}
        <footer className="py-8 bg-white/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 text-center text-primary/60">
            <p>&copy; {new Date().getFullYear()} Story Generator. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
)
};