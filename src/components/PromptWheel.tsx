import { useState, ChangeEvent, MouseEvent } from "react"

export interface Prompt {
  id: string;
  question: string;
  hint: string;
}

export const genrePrompts = {
  "Sci-Fi": [
    {
      id: "characterName",
      question: "What is your character's name?",
      hint: 'Give your sci-fi protagonist a memorable name. For example: "Dr. Elara Nova" or "Commander Zephyr Vex"',
    },
    {
      id: "characterDetails",
      question: "What are some key details about your character?",
      hint: 'Share defining traits, background, or characteristics. For example: "A reclusive xenobiologist with cybernetic enhancements who grew up on a mining colony"',
    },
    {
      id: "setting",
      question: "Where does your character's story take place?",
      hint: 'Think of futuristic or technological settings. For example: "A space station orbiting a dying star"',
    },
    {
      id: "ability",
      question: "Describe your character's unique technological ability",
      hint: 'Think about how they interact with technology in a special way. For example: "I can mentally connect to any computer system I touch"',
    },
    {
      id: "discovery",
      question: "What scientific discovery changed your character's life?",
      hint: 'Consider both personal and global impact. For example: "The discovery of ancient alien technology beneath my family\'s research facility"',
    },
    {
      id: "fear",
      question: "What terrifies your character about the future?",
      hint: 'Think about technological consequences. For example: "The AI we created becoming too powerful to control"',
    },
  ],
  Adventure: [
    {
      id: "adventure",
      question: "What exciting journey is your character about to embark on?",
      hint: 'Think of thrilling expeditions or quests. For example: "A treacherous climb to the peak of an unexplored mountain"',
    },
  ],
  Mystery: [
    {
      id: "mystery",
      question: "What perplexing case does your detective need to solve?",
      hint: 'Consider intriguing and puzzling scenarios. For example: "The disappearance of a famous artifact from a locked museum"',
    },
  ],
  "Fairy Tale": [
    {
      id: "fairytale",
      question: "In what magical realm does your story unfold?",
      hint: 'Imagine enchanted forests, mystical kingdoms, or whimsical villages. For example: "A hidden valley where animals can talk and trees whisper secrets"',
    },
  ],
} as const;

interface PromptWheelProps {
  genre: keyof typeof genrePrompts;
  onAnswersUpdate?: (answers: Record<string, string>) => void;
}

const PromptWheel = ({ genre, onAnswersUpdate }: PromptWheelProps) => {
  const prompts = genrePrompts[genre]
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleNext = () => {
    if (answers[prompts[currentPromptIndex].id]?.trim()) {
      setCurrentPromptIndex((prev) => Math.min(prev + 1, prompts.length - 1))
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
              <p className="text-indigo-600">{answers[prompt.id]}</p>
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
                      {currentPromptIndex === prompts.length - 1 ? "Complete" : "Next"}
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

  if (currentPromptIndex >= prompts.length) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">All prompts completed!</h2>
        <pre className="text-left bg-indigo-50 p-4 rounded-lg">{JSON.stringify(answers, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-b from-indigo-50 to-white">
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

