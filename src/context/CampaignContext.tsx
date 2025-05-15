import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Prompt, campaignSections } from "@/data/campaignSections";
// Define campaign section types based on existing code
export type CampaignSection =
  | "World Building"
  | "Campaign Structure"
  | "Tone & Themes"
  | "Player Experience"
  | "Practical DMing Support";

// Interface for the generated campaign
export interface GeneratedCampaign {
  title: string;
  content: string;
}

export type Campaign = {
  id: string;
  title: string;
  content: string;
  map_image_url: string
  image_url: string
  user_id: string
  prompt_answers: Record<string, string>
}

// Interface for the context value
interface CampaignContextValue {
  // Form data
  answers: Record<string, string>;
  updateAnswers: (newAnswers: Record<string, string>) => void;

  // Section tracking
  completedSections: CampaignSection[];
  addCompletedSection: (section: CampaignSection) => void;

  // Current section
  currentSection: CampaignSection;
  setCurrentSection: (section: CampaignSection) => void;

  // Generated campaign
  campaign: Campaign | null;
  setCampaign: (campaign: Campaign | null) => void;

  // Reset all data
  resetCampaignData: () => void;

  // Prompts
  prompts: Prompt[];
  generatePromptContext: () => void;
  currentPromptIndex: number;
  setCurrentPromptIndex: (index: number) => void;
  promptContext: string;
  setPromptContext: (context: string) => void;
}

// Create the context with default values
const CampaignContext = createContext<CampaignContextValue | undefined>(
  undefined
);

// Provider component
export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  // State for form answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // State for tracking completed sections
  const [completedSections, setCompletedSections] = useState<CampaignSection[]>(
    []
  );

  // State for current section
  const [currentSection, setCurrentSection] =
    useState<CampaignSection>("World Building");

  // State for generated campaign
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // State for current prompt index
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // State for prompts
  const prompts = campaignSections[currentSection];

  // State for prompt context
  const [promptContext, setPromptContext] = useState("");

  // Update answers
  const updateAnswers = (newAnswers: Record<string, string>) => {
    setAnswers((prev) => ({
      ...prev,
      ...newAnswers,
    }));
  };

  // Add a completed section
  const addCompletedSection = (section: CampaignSection) => {
    if (!completedSections.includes(section)) {
      setCompletedSections((prev) => [...prev, section]);
    }
  };

  // Reset all data
  const resetCampaignData = () => {
    setAnswers({});
    setCompletedSections([]);
    setCurrentSection("World Building");
  };

  const generatePromptContext = useCallback(() => {
    const currentPrompt = prompts[currentPromptIndex];
    let string = `
    You are a DM for a D&D campaign.
    You will be given a list of features for the campaign.
    Please respond to the section labeled "Next prompt".
    Here are the features for the campaign:

    `;
    Object.keys(answers).forEach((key) => {
      if (key === currentPrompt.id) {
        return;
      }
      string += `${key}: ${answers[key]}\n`;
    });

    string += `
    Next prompt:
    ${currentPrompt.id}: ${currentPrompt.question}. ${currentPrompt.hint}
    `;
    console.log(string);
    setPromptContext(string);
  }, [currentPromptIndex]);

  // Context value
  const value: CampaignContextValue = {
    answers,
    updateAnswers,
    completedSections,
    addCompletedSection,
    currentSection,
    setCurrentSection,
    campaign,
    setCampaign,
    resetCampaignData,
    prompts,
    generatePromptContext,
    currentPromptIndex,
    setCurrentPromptIndex,
    promptContext,
    setPromptContext,
  };

  useEffect(() => {
    generatePromptContext();
    console.log(currentPromptIndex, "currentPromptIndex effect");
  }, [currentPromptIndex, generatePromptContext]);

  useEffect(() => {
    setCurrentPromptIndex(0);
  }, [currentSection]);

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

// Custom hook for using the campaign context
export const useCampaign = () => {
  const context = useContext(CampaignContext);

  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }

  return context;
};
