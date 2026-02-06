// ============================================
// SURVEY FORM COMPONENT
// ============================================

'use client'

import { useState } from 'react'
import { surveyQuestions, calculateProgress } from '@/lib/surveyQuestions'
import { storage } from '@/lib/utils'

interface SurveyFormProps {
  onComplete?: (responses: Record<string, any>) => void
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>(() => {
    // Load saved responses from localStorage
    if (typeof window !== 'undefined') {
      return storage.get<Record<string, any>>('survey_responses', {})
    }
    return {}
  })
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = surveyQuestions[currentStep]
  const progress = calculateProgress(Object.keys(responses).length)
  const canGoBack = currentStep > 0
  const canGoForward = responses[currentQuestion?.id] !== undefined || !currentQuestion?.required

  const saveResponse = (questionId: string, value: any) => {
    const newResponses = { ...responses, [questionId]: value }
    setResponses(newResponses)

    // Save to localStorage
    storage.set('survey_responses', newResponses)
  }

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Survey complete
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      storage.remove('survey_responses')
      onComplete?.(responses)
    }, 1500)
  }

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={responses[currentQuestion.id] === option.value}
                  onChange={(e) => saveResponse(currentQuestion.id, e.target.value)}
                  className="pixel-radio"
                />
                <span className="flex-1 pixel-border-thin p-3 bg-white group-hover:bg-gray-50 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )

      case 'multi_select':
        const selectedValues = responses[currentQuestion.id] || []
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: any) => v !== option.value)
                    saveResponse(currentQuestion.id, newValues)
                  }}
                  className="pixel-checkbox"
                />
                <span className="flex-1 pixel-border-thin p-3 bg-white group-hover:bg-gray-50 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )

      case 'scale':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={responses[currentQuestion.id] === option.value}
                  onChange={(e) => saveResponse(currentQuestion.id, parseInt(e.target.value))}
                  className="pixel-radio"
                />
                <span className="flex-1 pixel-border-thin p-3 bg-white group-hover:bg-gray-50 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )

      case 'crush_list':
        const crushes = responses[currentQuestion.id] || []
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter the Mapua email addresses of up to 5 people you're interested in. If they also list you, you'll both get a compatibility bonus!
            </p>
            {[0, 1, 2, 3, 4].map((index) => (
              <input
                key={index}
                type="email"
                placeholder={`Crush ${index + 1} email (optional)`}
                value={crushes[index] || ''}
                onChange={(e) => {
                  const newCrushes = [...crushes]
                  newCrushes[index] = e.target.value
                  saveResponse(currentQuestion.id, newCrushes.filter(c => c.trim()))
                }}
                className="pixel-input w-full"
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold" style={{ color: '#D32F2F' }}>
            Question {currentStep + 1} of {surveyQuestions.length}
          </span>
          <span className="pixel-badge" style={{ background: '#1976D2' }}>
            {progress}% Complete
          </span>
        </div>
        <div className="pixel-progress-container">
          <div
            className="pixel-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="pixel-card">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="pixel-badge">
            {currentQuestion.category}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1976D2' }}>
          {currentQuestion.text}
        </h2>

        {currentQuestion.required && (
          <p className="text-sm text-red-600 mb-6">* Required</p>
        )}

        {/* Input */}
        <div className="mb-8">
          {renderQuestionInput()}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className="pixel-btn pixel-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoForward || isSaving}
            className="pixel-btn pixel-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              'Saving...'
            ) : currentStep === surveyQuestions.length - 1 ? (
              '✓ Submit Survey'
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mt-8 pixel-card bg-gray-100">
        <h3 className="font-bold mb-4">Quick Navigation</h3>
        <div className="flex flex-wrap gap-2">
          {surveyQuestions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentStep(index)}
              className={`w-10 h-10 flex items-center justify-center border-2 font-bold text-sm transition-all ${
                currentStep === index
                  ? 'bg-red-600 text-white border-red-800'
                  : responses[question.id]
                  ? 'bg-blue-100 border-blue-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
