import { CampaignSection } from "@/types/campaign";
import { Button } from "@/components/ui/button";

interface CampaignContentProps {
  sections: CampaignSection[];
  activeSection: string;
  onGenerateLocationMap?: (locationName: string) => void;
}

export function CampaignContent({ sections, activeSection, onGenerateLocationMap }: CampaignContentProps) {
  // Find the index of the selected main section
  const sectionIdx = sections.findIndex(
    (section) => section.title === activeSection && section.type === "main"
  );
  
  if (sectionIdx === -1) return null;
  
  // Gather all sections from this index up to the next main section
  const groupedSections = [];
  for (let i = sectionIdx; i < sections.length; i++) {
    const section = sections[i];
    if (i !== sectionIdx && section.type === "main") break;
    groupedSections.push(section);
  }

  // Check if this is the Main Locations section
  const isLocationsSection = activeSection.includes("Main Locations");

  return (
    <>
      {groupedSections.map((section, index) => (
        <div key={index} className="mb-8">
          {section.type === "main" ? (
            <h2 className="font-imfell text-2xl md:text-3xl text-ghibli-forest border-b-2 border-ghibli-gold pb-2 mb-4">
              {section.title}
            </h2>
          ) : section.type === "sub" ? (
            <div className="flex justify-between items-center mt-6 mb-3">
              <h3 className="font-playfair text-xl md:text-2xl text-ghibli-brown">
                {section.title}
              </h3>
              {isLocationsSection && onGenerateLocationMap && (
                <Button
                  onClick={() => onGenerateLocationMap(section.title)}
                  className="bg-ghibli-forest text-white text-sm px-3 py-1 rounded-lg"
                  size="sm"
                >
                  Generate Map
                </Button>
              )}
            </div>
          ) : (
            <h4 className="font-cormorant font-semibold text-lg md:text-xl text-ghibli-brown mt-4 mb-2">
              {section.title}
            </h4>
          )}
          {section.content.map((paragraph, pidx) => (
            <p
              key={`p-${section.title}-${pidx}`}
              className="font-cormorant text-lg leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}
          {section.listItems.length > 0 && (
            <ul className="list-disc pl-6 mb-6 space-y-2">
              {section.listItems.map((item, iidx) => (
                <li
                  key={`li-${section.title}-${iidx}`}
                  className="font-cormorant text-lg leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
} 