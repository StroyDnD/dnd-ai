import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCampaign } from "@/context/CampaignContext";

interface CampaignSection {
  title: string;
  type: "main" | "sub" | "subsub";
  content: string[];
  listItems: string[];
}

interface ParsedCampaign {
  title: string;
  sections: CampaignSection[];
}

export default function Campaign() {
  const navigate = useNavigate();
  const { generatedCampaign, setCurrentSection, setGeneratedCampaign } = useCampaign();
  const [parsedCampaign, setParsedCampaign] = useState<ParsedCampaign | null>(null);
  
  useEffect(() => {
    // Get campaign data from context
    if (generatedCampaign) {
      const { title, content } = generatedCampaign;
      const parsed = parseCampaignContent(title, content);
      setParsedCampaign(parsed);
    }
  }, [generatedCampaign]);

  const handleBackToEdit = () => {
    // Clear the generated campaign to prevent immediate redirect
    setGeneratedCampaign(null);
    // Navigate back to create-campaign page
    setCurrentSection("World Building");
    navigate('/create-campaign');
  };

  if (!parsedCampaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">No campaign data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-12 px-4 pb-24">
        <div className="mb-8 flex justify-start">
          <button
            onClick={handleBackToEdit}
            className="flex items-center font-cormorant text-ghibli-brown hover:text-ghibli-forest transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Edit
          </button>
        </div>
        
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-ghibli-forest mb-10 text-center">
          {parsedCampaign.title}
        </h1>

        {parsedCampaign.sections.map((section, index) => (
          <div key={index} className="mb-8">
            {section.type === "main" ? (
              <h2 className="font-imfell text-2xl md:text-3xl text-ghibli-forest border-b-2 border-ghibli-gold pb-2 mb-4">
                {section.title}
              </h2>
            ) : section.type === "sub" ? (
              <h3 className="font-playfair text-xl md:text-2xl text-ghibli-brown mt-6 mb-3">
                {section.title}
              </h3>
            ) : (
              <h4 className="font-cormorant font-semibold text-lg md:text-xl text-ghibli-brown mt-4 mb-2">
                {section.title}
              </h4>
            )}

            {section.content.map((paragraph, pidx) => (
              <p key={`p-${index}-${pidx}`} className="font-cormorant text-lg leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            {section.listItems.length > 0 && (
              <ul className="list-disc pl-6 mb-6 space-y-2">
                {section.listItems.map((item, iidx) => (
                  <li key={`li-${index}-${iidx}`} className="font-cormorant text-lg leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function parseCampaignContent(title: string, content: string): ParsedCampaign {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections: CampaignSection[] = [];
  
  let currentTitle = "";
  let currentType: "main" | "sub" | "subsub" = "main";
  let currentContent: string[] = [];
  let currentListItems: string[] = [];
  
  // If the first line looks like a title (starting with #), use it as the title
  // Otherwise use the provided title
  let campaignTitle = title;
  let startIndex = 0;
  
  if (lines.length > 0 && lines[0].startsWith('# ')) {
    campaignTitle = lines[0].replace('# ', '');
    startIndex = 1;
  }
  
  const addCurrentSection = () => {
    if (currentTitle) {
      sections.push({
        title: currentTitle,
        type: currentType,
        content: [...currentContent],
        listItems: [...currentListItems]
      });
      currentContent = [];
      currentListItems = [];
    }
  };
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers
    if (line.startsWith('## ')) {
      addCurrentSection();
      currentTitle = line.replace('## ', '');
      currentType = "main";
    } else if (line.startsWith('### ')) {
      addCurrentSection();
      currentTitle = line.replace('### ', '');
      currentType = "sub";
    } else if (line.startsWith('#### ')) {
      addCurrentSection();
      currentTitle = line.replace('#### ', '');
      currentType = "subsub";
    } 
    // Check for list items
    else if (line.startsWith('* ') || line.startsWith('- ')) {
      currentListItems.push(line.substring(2));
    } 
    // Regular paragraph text
    else {
      currentContent.push(line);
    }
  }
  
  // Add the last section
  addCurrentSection();
  
  return {
    title: campaignTitle,
    sections
  };
} 