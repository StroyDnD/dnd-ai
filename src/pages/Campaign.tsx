import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useCampaign } from "@/context/CampaignContext";
import {
  parseLocations,
  generateMapTemplate,
} from "@/lib/templates/mapGenerator";
import { StoryService } from "@/lib/api";
import { base64ToFile } from "@/utils/images";
import supabase from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";
import {SlideshowLightbox} from 'lightbox.js-react'

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { campaign, setCurrentSection, setCampaign } = useCampaign();
  const [parsedCampaign, setParsedCampaign] = useState<ParsedCampaign | null>(
    null
  );
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapImage, setMapImage] = useState<string | null>(null);

  useEffect(() => {
    // Get campaign data from context
    if (campaign) {
      const { title, content } = campaign;
      const parsed = parseCampaignContent(title, content);
      setParsedCampaign(parsed);
    }
  }, [campaign]);

  const handleBackToEdit = () => {
    setCurrentSection("World Building");
    navigate(`/campaigns/${params.id}/edit`);
  };

  const handleGenerateMaps = async () => {
    if (!campaign) return;

    try {
      setIsGeneratingMap(true);
      setMapError(null);

      // Parse locations from campaign content
      const locations = parseLocations(campaign);
      if (!locations.length) {
        setMapError("No locations found in campaign content");
        return;
      }

      // Generate map template
      const mapTemplate = generateMapTemplate(locations);

      // Call the map generation service
      const result = await StoryService.generateMap(mapTemplate);

      if (result.illustrations && result.illustrations[0]) {
        const base64Image = result.illustrations[0];
        const imageFile = base64ToFile(
          base64Image,
          `campaign-${campaign.id}-map.png`
        );
        await supabase.storage
          .from("campaign-maps")
          .upload(`${user?.id}/${imageFile.name}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("campaign-maps")
          .getPublicUrl(`${user?.id}/${imageFile.name}`);

        // Store the URL in your campaigns table
        console.log("publicUrl", publicUrl);
        console.log("campaign.id", campaign.id);
        await supabase
          .from("campaigns")
          .update({ map_image_url: publicUrl })
          .eq("id", campaign.id)
          .select();
        setMapImage(result.illustrations[0]);
      }
    } catch (error) {
      console.error("Error generating map:", error);
      setMapError(
        error instanceof Error ? error.message : "Failed to generate map"
      );
    } finally {
      setIsGeneratingMap(false);
    }
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
    if (params.id && !campaign) {
      fetchCampaign();
    }
  }, [params.id, fetchCampaign, campaign]);

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
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={handleBackToEdit}
            className="cursor-pointer flex items-center font-cormorant text-ghibli-brown hover:opacity-80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Edit
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateMaps}
              disabled={isGeneratingMap}
              className={`px-4 py-2 bg-ghibli-forest rounded hover:bg-ghibli-brown transition-colors ${
                isGeneratingMap ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGeneratingMap
                ? campaign?.map_image_url
                  ? "Regenerating Map..."
                  : "Generating Map..."
                : campaign?.map_image_url
                ? "Regenerate Map"
                : "Generate Map"}
            </button>
          </div>
        </div>

        {mapError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {mapError}
          </div>
        )}
        <SlideshowLightbox className="absolute h-1/5 w-1/5 left-10">
          {campaign?.map_image_url && (
            <img className="w-full rounded" src={campaign.map_image_url} alt="Campaign Map" />
          )}
          {/* Add more images here if you have more URLs */}
        </SlideshowLightbox>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full pt-5">
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
                  <p
                    key={`p-${index}-${pidx}`}
                    className="font-cormorant text-lg leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.listItems.length > 0 && (
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    {section.listItems.map((item, iidx) => (
                      <li
                        key={`li-${index}-${iidx}`}
                        className="font-cormorant text-lg leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function parseCampaignContent(title: string, content: string): ParsedCampaign {
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
