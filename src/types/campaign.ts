export interface CampaignSection {
  title: string;
  type: "main" | "sub" | "subsub";
  content: string[];
  listItems: string[];
}

export interface ParsedCampaign {
  title: string;
  sections: CampaignSection[];
} 