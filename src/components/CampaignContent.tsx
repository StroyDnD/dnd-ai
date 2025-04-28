import { CampaignSection } from "@/types/campaign";

interface CampaignContentProps {
  sections: CampaignSection[];
  activeSection: string;
}

export function CampaignContent({ sections, activeSection }: CampaignContentProps) {
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

  return (
    <>
      {groupedSections.map((section, index) => (
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