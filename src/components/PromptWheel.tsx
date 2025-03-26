import { useState, ChangeEvent, MouseEvent } from "react"

export interface Prompt {
  id: string;
  question: string;
  hint: string;
}

// Restructured as sections for D&D campaign creation instead of genres
export const campaignSections = {
  "World Building": [
    {
      id: "coreConflict",
      question: "What's the core conflict or central tension driving this world?",
      hint: 'Describe the primary conflict that shapes your world. For example: "An ancient evil awakening" or "War between rival kingdoms"',
    },
    {
      id: "environments",
      question: "What mix of environments do you want?",
      hint: 'Specify the environments your campaign will include. For example: "Urban cities, dense forests, and ancient ruins" or "Desert wasteland and underground caverns"',
    },
    {
      id: "culturalInspiration",
      question: "Which historical period or cultural inspiration would serve as your primary influence?",
      hint: 'Specify a time period or culture. For example: "Medieval Europe" or "Ancient Egypt" or "Viking Age Scandinavia"',
    },
    {
      id: "magicLevel",
      question: "What level of magic exists in this world?",
      hint: 'Describe how common or rare magic is. For example: "High magic with spellcasters in every town" or "Low magic where spells are rare and feared"',
    },
    {
      id: "technologyLevel",
      question: "What technological level exists alongside magic?",
      hint: 'Describe the technology level. For example: "Medieval with simple machines" or "Renaissance with early firearms" or "Steampunk with magic-powered devices"',
    },
  ],
  "Campaign Structure": [
    {
      id: "levelRange",
      question: "What level range should this campaign cover?",
      hint: 'Specify the starting and ending levels. For example: "1-5" or "5-10" or "1-20 for a full campaign"',
    },
    {
      id: "storyArcs",
      question: "How many major story arcs would you like?",
      hint: 'Choose the number of major plot arcs. For example: "One epic storyline" or "Three interconnected arcs" or "Five milestone adventures"',
    },
    {
      id: "campaignLength",
      question: "What campaign length are you aiming for?",
      hint: 'Estimate the campaign duration. For example: "Short (5-10 sessions)" or "Medium (10-25 sessions)" or "Long (25+ sessions)"',
    },
    {
      id: "structure",
      question: "How linear vs. sandbox should the story structure be?",
      hint: 'Describe the narrative structure. For example: "Highly linear with clear objectives" or "Open sandbox with multiple paths" or "Guided sandbox with a central plot but freedom to explore"',
    },
    {
      id: "partyMotivation",
      question: "What's the primary motivation keeping the party together?",
      hint: 'Explain why the characters stay as a group. For example: "Shared goal of defeating a villain" or "All members of the same organization" or "Bound by a magical contract"',
    },
  ],
  "Tone & Themes": [
    {
      id: "emotionalTone",
      question: "What emotional tone do you want?",
      hint: 'Describe the overall mood. For example: "Dark and gritty" or "Heroic high fantasy" or "Humorous adventure" or "Mysterious and tense"',
    },
    {
      id: "coreThemes",
      question: "What core themes would you like to explore?",
      hint: 'List 2-3 themes to explore. For example: "Redemption, sacrifice, power" or "Freedom, responsibility, corruption" or "Faith, doubt, perseverance"',
    },
    {
      id: "otherGenres",
      question: "Which genres besides fantasy would you like to incorporate?",
      hint: 'Mention other genres to blend in. For example: "Horror elements" or "Mystery and intrigue" or "Political thriller" or "None, pure fantasy"',
    },
    {
      id: "moralChoices",
      question: "What kinds of moral choices should players face?",
      hint: 'Describe moral dilemmas. For example: "Greater good vs. individual needs" or "Honor vs. practical necessity" or "Justice vs. mercy"',
    },
  ],
  "Player Experience": [
    {
      id: "gameplayBalance",
      question: "What balance of combat/exploration/social interaction do you prefer?",
      hint: 'Specify your preferred gameplay mix. For example: "Combat-heavy (60/20/20)" or "Balanced (40/30/30)" or "Social-focused (20/20/60)"',
    },
    {
      id: "characterClasses",
      question: "Which character classes or builds do you want to particularly shine?",
      hint: 'List classes you want to highlight. For example: "Rogues and bards for a heist campaign" or "Paladins and clerics for an undead-focused adventure" or "All classes equally"',
    },
    {
      id: "rewards",
      question: "What distinctive rewards beyond standard treasure would you like to offer?",
      hint: 'Describe special rewards. For example: "Political influence" or "Rare magic items with story significance" or "Property and followers" or "Divine blessings"',
    },
    {
      id: "backgrounds",
      question: "What player backgrounds would connect well to this campaign?",
      hint: 'Suggest relevant character backgrounds. For example: "Soldier, Noble, and Sage for a war campaign" or "Criminal, Urchin, and Charlatan for an urban adventure"',
    },
  ],
  "Practical DMing Support": [
    {
      id: "challengingEncounters",
      question: "What encounter types do you struggle to design?",
      hint: 'Mention encounter types you find difficult. For example: "Naval battles" or "Large-scale war" or "Social encounters with political intrigue" or "Puzzles and riddles"',
    },
    {
      id: "npcDevelopment",
      question: "Which NPCs would benefit from deeper development?",
      hint: 'Describe NPCs needing development. For example: "The main villain" or "Recurring allies" or "Political figures" or "Quest givers"',
    },
    {
      id: "locations",
      question: "What locations would you like detailed maps for?",
      hint: "List location types needing maps. For example: \"Main city hub\" or \"Villain's fortress\" or \"Ancient temple\" or \"Wilderness regions\"",
    },
    {
      id: "villains",
      question: "What recurring villains or factions should be fleshed out?",
      hint: 'Describe antagonists needing detail. For example: "The main villain and their lieutenants" or "Rival adventuring party" or "Corrupt noble house" or "Cult of the ancient god"',
    },
    {
      id: "contingencies",
      question: "What plot complications could arise if players go off-track?",
      hint: 'Describe possible diversions. For example: "Alternative paths to the main objective" or "Side quests that connect back to the main plot" or "Consequences of avoiding key encounters"',
    },
  ],
} as const;

interface PromptWheelProps {
  section: keyof typeof campaignSections;
  onAnswersUpdate?: (answers: Record<string, string>) => void;
  onSectionComplete?: (section: keyof typeof campaignSections) => void;
  initialAnswers?: Record<string, string>;
}

const PromptWheel = ({ section, onAnswersUpdate, onSectionComplete, initialAnswers = {} }: PromptWheelProps) => {
  const prompts = campaignSections[section]
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleNext = () => {
    if (answers[prompts[currentPromptIndex].id]?.trim()) {
      if (currentPromptIndex === prompts.length - 1) {
        // Last prompt in this section
        if (onSectionComplete) {
          onSectionComplete(section);
        }
      } else {
        setCurrentPromptIndex((prev) => Math.min(prev + 1, prompts.length - 1))
      }
    }
  }

  const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const currentPromptId = prompts[currentPromptIndex].id
    const updatedAnswers = {
      ...answers,
      [currentPromptId]: e.target.value,
    }
    
    setAnswers(updatedAnswers)
    
    // Notify parent component about the updated answers
    if (onAnswersUpdate) {
      onAnswersUpdate(updatedAnswers)
    }
  }

  const handlePromptClick = (index: number) => {
    if (index !== currentPromptIndex) {
      setCurrentPromptIndex(index)
    }
  }

  const renderPrompt = (prompt: Prompt, index: number) => {
    const position = index - currentPromptIndex

    let containerClass = "transition-all duration-500 w-full max-w-2xl mx-auto mb-4 relative "
    let contentClass = "p-6 rounded-lg transition-all duration-500 "

    // Position-based styling
    if (position === 0) {
      containerClass += "transform translate-y-0 scale-100 opacity-100 z-20 "
      contentClass += "bg-indigo-100 shadow-lg "
    } else if (position < 0) {
      containerClass += `transform -translate-y-16 scale-90 opacity-50 z-10 `
      contentClass += "bg-indigo-50 cursor-pointer "

      if (hoveredIndex === index) {
        contentClass += "ring-2 ring-indigo-400 shadow-lg "
      }
    } else {
      containerClass += `transform translate-y-16 scale-90 opacity-50 z-0 `
      contentClass += "bg-indigo-50 cursor-pointer "

      if (hoveredIndex === index) {
        contentClass += "ring-2 ring-indigo-400 shadow-lg "
      }
    }

    return (
      <div
        key={prompt.id}
        className={containerClass}
        onClick={() => handlePromptClick(index)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className={contentClass}>
          {position < 0 ? (
            <div>
              <h3 className="text-sm font-medium text-indigo-800 mb-2">{prompt.question}</h3>
              <p className="text-indigo-600">{answers[prompt.id] || ""}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">{prompt.question}</h3>
              <p className="text-sm text-indigo-600 mb-4">{prompt.hint}</p>
              {position === 0 && (
                <>
                  <textarea
                    value={answers[prompt.id] || ""}
                    onChange={handleAnswerChange}
                    placeholder="Type your answer here..."
                    className="w-full p-3 rounded border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentPromptIndex > 0) {
                          setCurrentPromptIndex((prev) => prev - 1)
                        }
                      }}
                      className={`px-6 py-2 rounded-lg font-medium 
                        ${
                          currentPromptIndex > 0 ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200" : "hidden"
                        } transition-colors duration-200`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                      }}
                      disabled={!answers[prompt.id]?.trim()}
                      className={`px-6 py-2 rounded-lg font-medium 
                        ${
                          answers[prompt.id]?.trim()
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-300 text-indigo-100"
                        } transition-colors duration-200`}
                    >
                      {currentPromptIndex === prompts.length - 1 ? "Complete Section" : "Next"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-b from-indigo-50 to-white">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-900">{section}</h2>
        <p className="text-indigo-600">Complete this section to build your campaign</p>
      </div>
      
      <div className="relative pt-16 max-w-4xl mx-auto">
        {/* Vertical progress indicator */}
        <div className="fixed left-8 top-24 bottom-24 flex flex-col items-center justify-between">
          {/* Progress text */}
          <div className="text-sm text-indigo-600 font-medium">
            Question {currentPromptIndex + 1} of {prompts.length}
          </div>
          
          {/* Progress dots and bar container */}
          <div className="flex-1 flex items-center space-x-4 my-8">
            {/* Progress dots */}
            <div className="flex flex-col space-y-4">
              {prompts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentPromptIndex ? 'bg-indigo-600' : 'bg-indigo-200'
                  }`}
                />
              ))}
            </div>

            {/* Vertical progress bar */}
            <div className="h-full w-2 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="w-full bg-indigo-600 transition-all duration-500 rounded-full"
                style={{ 
                  height: `${((currentPromptIndex + 1) / prompts.length) * 100}%`,
                  marginTop: 'auto' // Makes the bar fill from bottom to top
                }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative mr-48">
          <div className="relative">
            {prompts.map((prompt, index) => renderPrompt(prompt, index))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptWheel

