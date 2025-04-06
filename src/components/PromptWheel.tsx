import { useState, ChangeEvent, MouseEvent, useEffect } from "react"
import { Prompt, campaignSections } from "../data/campaignSections"

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

  // Reset currentPromptIndex to 0 when section changes
  useEffect(() => {
    setCurrentPromptIndex(0)
  }, [section])

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers]);

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
      contentClass += "bg-indigo-100/95 backdrop-blur-sm shadow-lg "
    } else if (position < 0) {
      containerClass += `transform -translate-y-16 scale-90 opacity-50 z-10 `
      contentClass += "bg-indigo-50/90 backdrop-blur-sm cursor-pointer "

      if (hoveredIndex === index) {
        contentClass += "ring-2 ring-indigo-400 shadow-lg "
      }
    } else {
      containerClass += `transform translate-y-16 scale-90 opacity-50 z-0 `
      contentClass += "bg-indigo-50/90 backdrop-blur-sm cursor-pointer "

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
            <div className="relative">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">{prompt.question}</h3>
              <p className="text-indigo-600">{answers[prompt.id] || ""}</p>
              {answers[prompt.id]?.trim() && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
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
    <div className="min-h-[calc(100vh-4rem)] p-8 flex flex-col items-center">
      {/* Section header - centered properly */}
      <div className="text-center mb-8 bg-white/70 backdrop-blur-sm p-4 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-indigo-900">{section}</h2>
        <p className="text-indigo-600">Complete this section to build your campaign</p>
      </div>
      
      <div className="relative pt-16 max-w-4xl mx-auto w-full">
        {/* Vertical progress indicator */}
        <div className="fixed left-8 top-24 bottom-24 flex flex-col items-center justify-between">
          {/* Progress text */}
          <div className="text-sm bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full text-indigo-600 font-medium">
            Question {currentPromptIndex + 1} of {prompts.length}
          </div>
          
          {/* Progress dots and bar container */}
          <div className="flex-1 flex items-center space-x-4 my-8">
            {/* Progress dots */}
            <div className="flex flex-col space-y-4 bg-white/30 backdrop-blur-sm p-2 rounded-full">
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
            <div className="h-full w-2 bg-indigo-100/70 backdrop-blur-sm rounded-full overflow-hidden">
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
        <div className="relative">
          <div className="relative">
            {prompts.map((prompt, index) => renderPrompt(prompt, index))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptWheel

