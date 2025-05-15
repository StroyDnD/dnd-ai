import { useState, useEffect, useCallback } from "react";
import { getFantasySaying } from "@/utils/falso";
import PromptWheel from "@/components/PromptWheel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, Check, FileText } from "lucide-react";
// import { campaignSections } from "@/components/PromptWheel";
import createCampaignBackground from "@/images/create-campaign-bg.png";
import { StoryService } from "@/lib/api";
import { DndCampaignAnswers } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { config, testDndCampaignAnswers } from "@/lib/config";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCampaign, CampaignSection } from "@/context/CampaignContext";
import supabase from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { base64ToFile } from "@/utils/images";
// Define all sections in order
const sections = [
  "World Building",
  "Campaign Structure",
  "Tone & Themes",
  "Player Experience",
  "Practical DMing Support",
] as const;

export default function CreateStory() {
  const navigate = useNavigate();

  // Use campaign context instead of local state
  const {
    currentSection,
    setCurrentSection,
    answers,
    updateAnswers,
    completedSections,
    addCompletedSection,
    setCampaign,
    campaign,
  } = useCampaign();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");
  const [fantasySaying, setFantasySaying] = useState<string>("");

  // Function to convert testDndCampaignAnswers to the correct format and update context
  const fillTestAnswers = () => {
    // Convert DndCampaignAnswers to Record<string, string> format
    const testAnswersRecord: Record<string, string> = {
      levelRange: testDndCampaignAnswers.levelRange ?? "",
      campaignLength: testDndCampaignAnswers.campaignLength ?? "",
      // Convert themes array back to comma-separated string for consistency
      coreThemes: (testDndCampaignAnswers.themes || []).join(", "),
      // Extract values from the setting string and other fields
      setting: testDndCampaignAnswers.setting ?? "",
      coreConflict: testDndCampaignAnswers.coreConflict ?? "",
      environments: testDndCampaignAnswers.environments ?? "",
      culturalInspiration: testDndCampaignAnswers.culturalInspiration ?? "",
      magicLevel: testDndCampaignAnswers.magicLevel ?? "",
      technologyLevel: testDndCampaignAnswers.technologyLevel ?? "",
      storyArcs: testDndCampaignAnswers.storyArcs ?? "",
      structure: testDndCampaignAnswers.structure ?? "",
      emotionalTone: testDndCampaignAnswers.emotionalTone ?? "",
      partyMotivation: testDndCampaignAnswers.partyMotivation ?? "",
      otherGenres: testDndCampaignAnswers.otherGenres ?? "",
      moralChoices: testDndCampaignAnswers.moralChoices ?? "",
      gameplayBalance: testDndCampaignAnswers.gameplayBalance ?? "",
      characterClasses: testDndCampaignAnswers.characterClasses ?? "",
      backgrounds: testDndCampaignAnswers.backgrounds ?? "",
      rewards: testDndCampaignAnswers.rewards ?? "",
      challengingEncounters: testDndCampaignAnswers.challengingEncounters ?? "",
      npcDevelopment: testDndCampaignAnswers.npcDevelopment ?? "",
      locations: testDndCampaignAnswers.locations ?? "",
      villains: testDndCampaignAnswers.villains ?? "",
      contingencies: testDndCampaignAnswers.contingencies ?? "",
      historyLore: testDndCampaignAnswers.historyLore ?? "",
      religionsDeities: testDndCampaignAnswers.religionsDeities ?? "",
      majorVillain: testDndCampaignAnswers.majorVillain ?? "",
      criticalEvents: testDndCampaignAnswers.criticalEvents ?? "",
      sensitiveContent: testDndCampaignAnswers.sensitiveContent ?? "",
      characterDeath: testDndCampaignAnswers.characterDeath ?? "",
    };

    // Update answers in context
    updateAnswers(testAnswersRecord);

    // Mark all sections as completed
    sections.forEach((section) => {
      addCompletedSection(section as CampaignSection);
    });
  };

  const handleAnswersUpdate = (sectionAnswers: Record<string, string>) => {
    // Update answers in context
    updateAnswers(sectionAnswers);
  };

  const handleSectionComplete = (section: CampaignSection) => {
    // Add completed section to context
    addCompletedSection(section);

    // Move to next section
    const currentIndex = sections.indexOf(section);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1] as CampaignSection);
    }
  };

  // Show generate button when all sections are completed or in test mode
  useEffect(() => {
    const allSectionsCompleted = sections.every((section) =>
      completedSections.includes(section as CampaignSection)
    );
    setShowGenerateButton(allSectionsCompleted);
  }, [completedSections]);

  const handleGenerateCampaign = async () => {
    if (isGenerating) return; // Prevent multiple clicks

    try {
      setIsGenerating(true);
      setError(null);
      // Extract theme values and convert to array
      const themesArray = answers.coreThemes
        ? answers.coreThemes.split(",").map((theme) => theme.trim())
        : [];

      // Create campaign answers object from all collected answers
      const dndAnswers: DndCampaignAnswers = {
        // Campaign Structure section
        levelRange: answers.levelRange || "",
        campaignLength: answers.campaignLength || "",
        // World Building section
        setting: `${answers.culturalInspiration || ""} with ${
          answers.environments || ""
        }. Magic: ${answers.magicLevel || ""}. Tech: ${
          answers.technologyLevel || ""
        }`,
        // Tone & Themes section
        themes: themesArray,
        // Additional context
        coreConflict: answers.coreConflict || "",
        storyArcs: answers.storyArcs || "",
        structure: answers.structure || "",
        emotionalTone: answers.emotionalTone || "",
        partyMotivation: answers.partyMotivation || "",
        otherGenres: answers.otherGenres || "",
        moralChoices: answers.moralChoices || "",
        gameplayBalance: answers.gameplayBalance || "",
        characterClasses: answers.characterClasses || "",
        backgrounds: answers.backgrounds || "",
        rewards: answers.rewards || "",
        // DMing support
        challengingEncounters: answers.challengingEncounters || "",
        npcDevelopment: answers.npcDevelopment || "",
        locations: answers.locations || "",
        villains: answers.villains || "",
        contingencies: answers.contingencies || "",
        // New fields
        historyLore: answers.historyLore || "",
        religionsDeities: answers.religionsDeities || "",
        majorVillain: answers.majorVillain || "",
        criticalEvents: answers.criticalEvents || "",
        sensitiveContent: answers.sensitiveContent || "",
        characterDeath: answers.characterDeath || "",
      };

      const result = await StoryService.generateDndCampaign(dndAnswers);

      // upload to supabase
      // we use upsert and pass in the id to update the campaign if present
      // if not present, it will create a new campaign
      const { data, error } = await supabase
        .from("campaigns")
        .upsert({
          id: params.id,
          title: result.title || "D&D Campaign",
          content: result.story,
          user_id: user?.id,
          prompt_answers: answers,
        })
        .select();
      console.log("data", data);

      const campaignId = data?.[0]?.id;
      
      const tempImagePrompt = `create a fantasy illustration for a D&D campaign with the following title: ${result.title}. DO NOT add this text to the image. The campaign is about ${result.story}.`;
      const imageResult = await StoryService.generateCampaignImage(tempImagePrompt);
      if (imageResult?.illustrations?.[0]) {
        const base64Image = imageResult.illustrations[0];
        const imageFile = base64ToFile(base64Image, `campaign-image-${campaignId}.png`);
        await supabase.storage.from("campaign-images").upload(`${user?.id}/${campaignId}/${imageFile.name}`, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

        const { data: { publicUrl } } = supabase.storage.from("campaign-images").getPublicUrl(`${user?.id}/${campaignId}/${imageFile.name}`);
        await supabase
        .from("campaigns")
        .update({
          image_url: publicUrl,
        })
        .eq("id", campaignId)
        .select();
      }

      if (error) {
        setError(error.message);
        console.error("Campaign generation error:", error);
      } else {
        // Fetch the latest campaign data that includes the image_url
        const { data: updatedCampaignData, error: fetchError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", campaignId)
          .single();
          
        if (fetchError) {
          console.error("Error fetching updated campaign:", fetchError);
          // Still navigate even if we couldn't fetch the latest data
          navigate(`/campaigns/${campaignId}`);
        } else {
          setCampaign(updatedCampaignData);
          navigate(`/campaigns/${campaignId}`);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate campaign."
      );
      console.error("Campaign generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigateToSection = (section: CampaignSection) => {
    if (isGenerating) return; // Prevent navigation while generating
    setCurrentSection(section);
  };

  // Handler to clear all answers (dev only)
  const handleClearAnswers = () => {
    updateAnswers({});
    sections.forEach(() => {
      // Reset completed sections in context
      completedSections.length = 0;
    });
  };

  const fetchCampaign = useCallback(async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", params.id);
    if (error) {
      console.error("Error fetching campaign:", error);
    } else {
      setCampaign(data[0]);
    }
  }, [params.id, setCampaign]);

  useEffect(() => {
    // if we are on the edit page, and no cmapaign in state, fetch the campaign
    if (params.id && !campaign) {
      fetchCampaign();
    }
  }, [params.id, fetchCampaign, campaign]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isGenerating) {
      setFantasySaying(getFantasySaying());
      intervalId = setInterval(() => {
        setFantasySaying(getFantasySaying());
      }, 5000); // Change every 5 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating]);

  return (
    <div className="min-h-screen">
      {/* Loading overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white w-md p-6 rounded-lg shadow-xl text-center">
            <Loader className="h-10 w-10 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-lg font-medium">
              {config.testMode
                ? "Generating Test Campaign..."
                : "Generating your campaign..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            {fantasySaying && (
              <p className="text-sm text-indigo-700 mt-4 italic break-words">{fantasySaying}</p>
            )}
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
                  variant={
                    currentSection === section
                      ? "default"
                      : completedSections.includes(section)
                      ? "outline"
                      : "ghost"
                  }
                  className={cn(
                    "rounded-full whitespace-nowrap flex items-center gap-1",
                    completedSections.includes(section)
                      ? "bg-opacity-90"
                      : "bg-opacity-80",
                    currentSection === section
                      ? "bg-emerald-600 text-white"
                      : "bg-white/70 text-emerald-900 backdrop-blur-sm hover:bg-white/80"
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
        <div
          className={cn(
            "relative z-10",
            isGenerating ? "pointer-events-none" : ""
          )}
        >
          <PromptWheel
            section={currentSection}
            onAnswersUpdate={handleAnswersUpdate}
            onSectionComplete={handleSectionComplete}
          />
        </div>
        {isEditMode ? (
          <div className="fixed right-12 top-32 z-50">
            <Button
              className="px-4 py-2 text-sm rounded-md border border-gray-400 bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 transition-all"
              onClick={() => navigate(`/campaigns/${params.id}`)}
              variant="outline"
              size="sm"
            >
              View Campaign
            </Button>
          </div>
        ) : null}
        {/* Floating Dev Button for clearing answers (test mode only) */}
        {config.testMode && (
          <div className="fixed right-12 bottom-32 z-50 flex flex-col gap-3">
            <Button
              className="px-4 py-2 text-sm rounded-md border border-red-400 bg-red-100 text-red-800 shadow-sm hover:bg-red-200 transition-all"
              onClick={handleClearAnswers}
              variant="outline"
              size="sm"
            >
              Clear Answers (Dev)
            </Button>

            {/* New Fill Answers button */}
            <Button
              className="px-4 py-2 text-sm rounded-md border border-emerald-400 bg-emerald-100 text-emerald-800 shadow-sm hover:bg-emerald-200 transition-all"
              onClick={fillTestAnswers}
              variant="outline"
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Fill Answers (Dev)
            </Button>
          </div>
        )}

        {/* Floating Generate Campaign button that appears when all sections are completed or in test mode */}
        <div
          className={
            "fixed right-12 bottom-12 transform z-50 transition-all duration-300translate-x-0 opacity-100"
          }
        >
          <Button
            className={cn(
              "px-6 py-6 text-lg rounded-full border border-white shadow-lg hover:shadow-xl transition-all text-white",
              "hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] hover:border-opacity-80 transform transition-transform duration-300",
              isGenerating
                ? "bg-gradient-to-r from-emerald-600 to-emerald-400 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-emerald-700 to-emerald-400"
            )}
            onClick={handleGenerateCampaign}
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader className="mr-3 h-5 w-5 animate-spin" />
                {config.testMode
                  ? "Generating Test Campaign..."
                  : "Generating..."}
              </>
            ) : (
              <>
                {isEditMode
                  ? "Update Campaign"
                  : config.testMode
                  ? "Generate Test Campaign!!"
                  : "Generate Campaign"}{" "}
                <ArrowRight className="ml-3 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
