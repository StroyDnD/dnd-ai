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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseCampaignContent } from "@/utils/campaignParser.ts";
import { CampaignContent } from "@/components/CampaignContent.tsx";
import { ParsedCampaign, CampaignSection } from "@/types/campaign";

import {SlideshowLightbox} from 'lightbox.js-react'

export default function Campaign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { campaign, setCurrentSection, setCampaign } = useCampaign();
  const [parsedCampaign, setParsedCampaign] = useState<ParsedCampaign | null>(null);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Get campaign data from context
    if (campaign) {
      const { title, content } = campaign;
      const parsed = parseCampaignContent(title, content);
      setParsedCampaign(parsed);
      // Set initial active section to first main section
      const firstMainSection = parsed.sections.find((s: CampaignSection) => s.type === "main");
      if (firstMainSection) {
        setActiveSection(firstMainSection.title);
      }
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

  // Get main sections for tabs
  const mainSections = parsedCampaign.sections.filter(section => section.type === "main");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto pt-12 px-8 pb-24">
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
        {campaign?.map_image_url ? (
            <img className="w-full rounded" src={campaign.map_image_url} alt="Campaign Map" />
          ) : <p>No map available</p>}
        </SlideshowLightbox>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {campaign?.map_image_url || mapImage ? (
            <div className="mb-8 w-full md:w-1/3 sticky h-fit top-0 pt-5">
              <img
                src={campaign?.map_image_url || `data:image/png;base64,${mapImage}`}
                alt="Generated campaign map"
                className="cursor-pointer hover:opacity-80 w-full rounded-lg shadow-lg p-1 border-3 bg-ghibli-brown border-emerald-800"
                onClick={() => {
                  window.open(campaign?.map_image_url || `data:image/png;base64,${mapImage}`, "_blank");
                }}
              />
            </div>
          ) : null}

          <div className="w-full md:w-2/3 pt-5">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-ghibli-forest mb-10 text-center">
              {parsedCampaign.title}
            </h1>

            {/* Section Tabs */}
            <div className="flex flex-wrap py-2 gap-2 justify-center mb-8">
              {mainSections.map((section) => (
                <Button
                  key={section.title}
                  onClick={() => setActiveSection(section.title)}
                  variant={activeSection === section.title ? "default" : "outline"}
                  className={cn(
                    "rounded-full whitespace-nowrap flex items-center gap-1",
                    activeSection === section.title
                      ? "bg-emerald-600 text-white"
                      : "bg-white/70 text-emerald-900 backdrop-blur-sm hover:bg-white/80"
                  )}
                  size="sm"
                >
                  {section.title.replace(/^SECTION:\s*/i, "")}
                </Button>
              ))}
            </div>

            {/* Content Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
              <CampaignContent 
                sections={parsedCampaign.sections}
                activeSection={activeSection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
