export interface MapInstructions {
  type: 'Regional' | 'Battle';
  title: string;
  style: string;
  instructions: string[];
}

export interface MapAsset {
  encounter?: string;
  instructions: MapInstructions;
}

export interface MapAssets {
  regional: MapAsset;
  battle: MapAsset[];
}

export function parseMapAssets(content: string): { regional: string; battle: string[] } | null {
  const mapAssetsSection = content.split('## SECTION: LLM Map Assets')[1]?.split('## SECTION:')[0];
  if (!mapAssetsSection) return null;

  const regionalMapMatch = mapAssetsSection.match(/### SUBSECTION: Regional Map([\s\S]*?)(?=### SUBSECTION:|$)/);
  const battleMapsMatch = mapAssetsSection.match(/### SUBSECTION: Battle Maps([\s\S]*?)(?=### SUBSECTION:|$)/);

  if (!regionalMapMatch || !battleMapsMatch) return null;

  const regionalMap = parseMapAssetString(regionalMapMatch[1]);
  const battleMaps = parseBattleMapsString(battleMapsMatch[1]);

  return {
    regional: regionalMap,
    battle: battleMaps
  };
}

function parseMapAssetString(content: string): string {
  const typeMatch = content.match(/\* #### MAP TYPE: (.*)/);
  const titleMatch = content.match(/\* #### MAP TITLE: (.*)/);
  const styleMatch = content.match(/\* #### MAP STYLE: (.*)/);
  const instructionsMatch = content.match(/\* #### MAP INSTRUCTIONS:([\s\S]*?)(?=\* ####|$)/);

  if (!typeMatch || !titleMatch || !styleMatch || !instructionsMatch) {
    throw new Error('Invalid map asset format');
  }

  const instructions = instructionsMatch[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.substring(2));

  return `instructions: Follow these strict style guidelines to maintain consistency Create an image of:

type: ${typeMatch[1].trim()}
title: ${titleMatch[1].trim()}
style: ${styleMatch[1].trim()}
${instructions.join('\n')}`;
}

function parseBattleMapsString(content: string): string[] {
  const encounterBlocks = content.split('* #### ENCOUNTER:');
  const battleMaps: string[] = [];

  for (let i = 1; i < encounterBlocks.length; i++) {
    const block = encounterBlocks[i];
    const encounterMatch = block.match(/(.*?)(?=\* ####|$)/);
    if (!encounterMatch) continue;
    
    const encounter = encounterMatch[1].trim();
    const mapString = parseMapAssetString(block);
    battleMaps.push(mapString);
  }

  return battleMaps;
} 