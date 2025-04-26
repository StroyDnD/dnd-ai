import { createContext, useContext, useState, ReactNode } from 'react';
import { DndCampaignAnswers } from '@/lib/templates';

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
  generatedCampaign: GeneratedCampaign | null;
  setGeneratedCampaign: (campaign: GeneratedCampaign | null) => void;
  
  // Reset all data
  resetCampaignData: () => void;
}

// Create the context with default values
const CampaignContext = createContext<CampaignContextValue | undefined>(undefined);

// Provider component
export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  // State for form answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // State for tracking completed sections
  const [completedSections, setCompletedSections] = useState<CampaignSection[]>([]);
  
  // State for current section
  const [currentSection, setCurrentSection] = useState<CampaignSection>("World Building");
  
  // State for generated campaign
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  
  // Update answers
  const updateAnswers = (newAnswers: Record<string, string>) => {
    setAnswers(prev => ({
      ...prev,
      ...newAnswers
    }));
  };
  
  // Add a completed section
  const addCompletedSection = (section: CampaignSection) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
  };
  
  // Reset all data
  const resetCampaignData = () => {
    setAnswers({});
    setCompletedSections([]);
    setCurrentSection("World Building");
    setGeneratedCampaign(null);
  };
  
  // Context value
  const value: CampaignContextValue = {
    answers,
    updateAnswers,
    completedSections,
    addCompletedSection,
    currentSection,
    setCurrentSection,
    generatedCampaign,
    setGeneratedCampaign,
    resetCampaignData
  };
  
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
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  
  return context;
}; 