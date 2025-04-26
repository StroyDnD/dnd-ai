import { GeneratedCampaign } from '@/context/CampaignContext';

interface Location {
  name: string;
  type: string;
  description: string;
  keyFeatures: string[];
  encounters: string[];
  secrets: string[];
}

/**
 * Parses the Main Locations section from campaign content
 */
export function parseLocations(campaign: GeneratedCampaign): Location[] {
  const locations: Location[] = [];
  const content = campaign.content;
  
  // Find the Main Locations section
  const locationsMatch = content.match(/## SECTION: Main Locations([\s\S]*?)(?=## SECTION:|$)/);
  if (!locationsMatch) return locations;
  
  const locationsContent = locationsMatch[1];
  
  // Split into individual location blocks
  const locationBlocks = locationsContent.split('### SUBSECTION:');
  
  for (let i = 1; i < locationBlocks.length; i++) {
    const block = locationBlocks[i];
    const lines = block.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    
    // Parse location name (first line)
    const name = lines[0];
    
    // Parse other properties
    const type = lines.find((line: string) => line.startsWith('* Type:'))?.replace('* Type:', '').trim() || '';
    const description = lines.find((line: string) => line.startsWith('* Description:'))?.replace('* Description:', '').trim() || '';
    const keyFeatures = lines.find((line: string) => line.startsWith('* Key Features:'))?.replace('* Key Features:', '').split(',').map((f: string) => f.trim()) || [];
    const encounters = lines.find((line: string) => line.startsWith('* Encounters:'))?.replace('* Encounters:', '').split(',').map((e: string) => e.trim()) || [];
    const secrets = lines.find((line: string) => line.startsWith('* Secrets:'))?.replace('* Secrets:', '').split(',').map((s: string) => s.trim()) || [];
    
    locations.push({
      name,
      type,
      description,
      keyFeatures,
      encounters,
      secrets
    });
  }
  
  return locations;
}

/**
 * Generates a template for map generation based on parsed locations
 */
export function generateMapTemplate(locations: Location[]): string {
  return `
You are an expert cartographer specializing in fantasy map creation.
Create a detailed regional map based on the following locations:

${locations.map(loc => `
Location: ${loc.name}
Type: ${loc.type}
Description: ${loc.description}
Key Features: ${loc.keyFeatures.join(', ')}
`).join('\n')}

Map Generation Instructions:
- Create a regional fantasy map showing all locations and their relationships
- Use an isometric/3D style with hand-drawn appearance
- Include each main location from above
- Include terrain features mentioned in descriptions
- Show clear paths/connections between locations
- Use a fantasy parchment style with earth tones
- Include a legend and scale
- Mark key features and points of interest
- Show natural features like rivers, mountains, forests
- Indicate political boundaries if relevant
- Add decorative elements that match the fantasy theme

The map should be generated as a high-quality image that can be used in the campaign.
`;
} 