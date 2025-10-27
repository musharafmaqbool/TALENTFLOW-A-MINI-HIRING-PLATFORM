import { useState } from 'react';
import type { AssessmentSection, Question } from '@/types';

interface AssessmentPreviewProps {
  title: string;
  description?: string;
  sections: AssessmentSection[];
}

export function AssessmentPreview({ title, description, sections }: AssessmentPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'single-choice':
        return (
          <div className="space-y-2">
            {((question as any).options || []).map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi-choice':
        return (
          <div className="space-y-2">
            {((question as any).options || []).map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswerChange(question.id, newAnswers);
                  }}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short-text':
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={(question as any).maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Your answer..."
          />
        );

      case 'long-text':
        return (
          <textarea
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={(question as any).maxLength}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Your answer..."
          />
        );

      case 'numeric':
        return (
          <input
            type="number"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            min={(question as any).min}
            max={(question as any).max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter a number..."
          />
        );

      case 'file-upload':
        return (
          <div>
            <input
              type="file"
              accept={(question as any).acceptedFormats?.join(',')}
              onChange={(e) => handleAnswerChange(question.id, e.target.files?.[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {(question as any).acceptedFormats?.length > 0
                ? `Accepted formats: ${(question as any).acceptedFormats.join(', ')}`
                : 'All file types accepted'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              )}
            </div>

            {section.questions.map((question) => {
              return (
                <div key={question.id} className="space-y-2">
                  <label className="block">
                    <span className="text-gray-900 font-medium">
                      {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </label>
                  
                  {renderQuestion(question)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No sections added yet. Add sections and questions to see the preview.
        </p>
      )}
    </div>
  );
}

