import { CampaignSection, ParsedCampaign } from "@/types/campaign";

export function parseCampaignContent(title: string, content: string): ParsedCampaign {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const sections: CampaignSection[] = [];

  let currentTitle = "";
  let currentType: "main" | "sub" | "subsub" = "main";
  let currentContent: string[] = [];
  let currentListItems: string[] = [];

  // If the first line looks like a title (starting with #), use it as the title
  // Otherwise use the provided title
  let campaignTitle = title;
  let startIndex = 0;

  if (lines.length > 0 && lines[0].startsWith("# ")) {
    campaignTitle = lines[0].replace("# ", "");
    startIndex = 1;
  }

  const addCurrentSection = () => {
    if (currentTitle) {
      sections.push({
        title: currentTitle,
        type: currentType,
        content: [...currentContent],
        listItems: [...currentListItems],
      });
      currentContent = [];
      currentListItems = [];
    }
  };

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    // Check for section headers
    if (line.startsWith("## ")) {
      addCurrentSection();
      currentTitle = line.replace("## ", "");
      currentType = "main";
    } else if (line.startsWith("### ")) {
      addCurrentSection();
      currentTitle = line.replace("### ", "");
      currentType = "sub";
    } else if (line.startsWith("#### ")) {
      addCurrentSection();
      currentTitle = line.replace("#### ", "");
      currentType = "subsub";
    }
    // Check for list items
    else if (line.startsWith("* ") || line.startsWith("- ")) {
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
    sections,
  };
} 