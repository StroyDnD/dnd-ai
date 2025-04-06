import { useState, useEffect } from "react";
import PromptWheel from "@/components/PromptWheel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, Check } from "lucide-react";
// import { campaignSections } from "@/components/PromptWheel";
import createCampaignBackground from "@/images/create-campaign-bg.png";
import { StoryService } from "@/lib/api";
import { DndCampaignAnswers } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { config, testDndCampaignAnswers } from "@/lib/config";
import { campaignSections } from "@/data/campaignSections";
import { useNavigate } from "react-router";

// Define all sections in order
const sections = [
  "World Building", 
  "Campaign Structure", 
  "Tone & Themes", 
  "Player Experience", 
  "Practical DMing Support"
] as const;
type CampaignSection = keyof typeof campaignSections;

export default function CreateStory() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<CampaignSection>("World Building");
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<CampaignSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateButton, setShowGenerateButton] = useState(config.testMode ? true : false);

  const handleAnswersUpdate = (sectionAnswers: Record<string, string>) => {
    setAllAnswers(prev => ({
      ...prev,
      ...sectionAnswers
    }));
  };

  const handleSectionComplete = (section: CampaignSection) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
    
    // Move to next section
    const currentIndex = sections.indexOf(section);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  // Show generate button when all sections are completed or in test mode
  useEffect(() => {
    const allSectionsCompleted = sections.every(section => 
      completedSections.includes(section)
    );
    setShowGenerateButton(config.testMode || allSectionsCompleted);
  }, [completedSections]);

  // Update useEffect to navigate when campaign is generated
  useEffect(() => {
    if (generatedCampaign) {
      navigate('/campaign', { state: { campaign: generatedCampaign } });
    }
  }, [generatedCampaign, navigate]);

  const handleGenerateCampaign = async () => {
    if (isGenerating) return; // Prevent multiple clicks
    
    try {
      setIsGenerating(true);
      setError(null);

      // In test mode, use the predefined answers
      if (config.testMode) {
        console.log("generating test campaign");
        const result = await StoryService.generateDndCampaign(testDndCampaignAnswers);
        
        setGeneratedCampaign({
          title: result.title || "D&D Campaign",
          content: result.story,
        });
      } else {
        // Extract theme values and convert to array
        const themesArray = allAnswers.coreThemes ? 
          allAnswers.coreThemes.split(',').map(theme => theme.trim()) :
          [];
        
        // Create campaign answers object from all collected answers
        const dndAnswers: DndCampaignAnswers = {
          // Campaign Structure section
          levelRange: allAnswers.levelRange || "",
          campaignLength: allAnswers.campaignLength || "",
          // World Building section
          setting: `${allAnswers.culturalInspiration || ""} with ${allAnswers.environments || ""}. Magic: ${allAnswers.magicLevel || ""}. Tech: ${allAnswers.technologyLevel || ""}`,
          // Tone & Themes section 
          themes: themesArray,
          // Additional context
          coreConflict: allAnswers.coreConflict || "",
          storyArcs: allAnswers.storyArcs || "",
          structure: allAnswers.structure || "",
          emotionalTone: allAnswers.emotionalTone || "",
          partyMotivation: allAnswers.partyMotivation || "",
          otherGenres: allAnswers.otherGenres || "",
          moralChoices: allAnswers.moralChoices || "",
          gameplayBalance: allAnswers.gameplayBalance || "",
          characterClasses: allAnswers.characterClasses || "",
          backgrounds: allAnswers.backgrounds || "",
          rewards: allAnswers.rewards || "",
          // DMing support
          challengingEncounters: allAnswers.challengingEncounters || "",
          npcDevelopment: allAnswers.npcDevelopment || "",
          locations: allAnswers.locations || "",
          villains: allAnswers.villains || "",
          contingencies: allAnswers.contingencies || "",
          // New fields
          historyLore: allAnswers.historyLore || "",
          religionsDeities: allAnswers.religionsDeities || "",
          majorVillain: allAnswers.majorVillain || "",
          criticalEvents: allAnswers.criticalEvents || "",
          sensitiveContent: allAnswers.sensitiveContent || "",
          characterDeath: allAnswers.characterDeath || "",
        };
        
        const result = await StoryService.generateDndCampaign(dndAnswers);
        
        setGeneratedCampaign({
          title: result.title || "D&D Campaign",
          content: result.story,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate campaign.");
      console.error("Campaign generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigateToSection = (section: CampaignSection) => {
    if (isGenerating) return; // Prevent navigation while generating
    setCurrentSection(section);
  };

  const handleReturnToQuestions = () => {
    setGeneratedCampaign(null);
  };

  return (
    <div className="min-h-screen">
      {/* Loading overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <Loader className="h-10 w-10 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-lg font-medium">
              {config.testMode ? "Generating Test Campaign..." : "Generating your campaign..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      )}
      
      {/* Full-height background */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src={createCampaignBackground}
            alt="Hero background"
            className="object-cover w-full h-full object-center fixed inset-0"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
        </div>
        
        {/* Section navigation on top of the background */}
        <div className="relative z-10 pt-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex overflow-x-auto py-2 gap-2 justify-center">
              {sections.map((section) => (
                <Button
                  key={section}
                  onClick={() => handleNavigateToSection(section)}
                  variant={currentSection === section ? "default" : completedSections.includes(section) ? "outline" : "ghost"}
                  className={cn(
                    "rounded-full whitespace-nowrap flex items-center gap-1",
                    completedSections.includes(section) ? "bg-opacity-90" : "bg-opacity-80",
                    currentSection === section ? "bg-indigo-600 text-white" : "bg-white/70 text-indigo-900 backdrop-blur-sm hover:bg-white/80"
                  )}
                  size="sm"
                  disabled={isGenerating}
                >
                  {completedSections.includes(section) && (
                    <div className="bg-green-500 rounded-full p-0.5 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-2 mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Add pointer-events-none to disable interaction with PromptWheel during generation */}
        <div className={cn("relative z-10", isGenerating ? "pointer-events-none" : "")}>
          <PromptWheel 
            section={currentSection}
            onAnswersUpdate={handleAnswersUpdate}
            onSectionComplete={handleSectionComplete}
            initialAnswers={allAnswers}
          />
        </div>
        
        {/* Floating Generate Campaign button that appears when all sections are completed or in test mode */}
        <div 
          className={cn(
            "fixed right-12 bottom-12 transform z-50 transition-all duration-300",
            showGenerateButton ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          )}
        >
          <Button 
            className={cn(
              "px-6 py-6 text-lg rounded-full border border-white shadow-lg hover:shadow-xl transition-all text-white",
              "hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] hover:border-opacity-80 transform transition-transform duration-300",
              isGenerating ? "bg-gradient-to-r from-indigo-600 to-indigo-400 cursor-not-allowed opacity-80" : "bg-gradient-to-r from-indigo-700 to-indigo-400"
            )}
            onClick={handleGenerateCampaign}
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader className="mr-3 h-5 w-5 animate-spin" /> 
                {config.testMode ? "Generating Test Campaign..." : "Generating..."}
              </>
            ) : (
              <>
                {config.testMode ? "Generate Test Campaign!!" : "Generate Campaign"} <ArrowRight className="ml-3 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
