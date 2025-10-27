import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuestionBuilder } from './QuestionBuilder';
import type { AssessmentSection, Question, QuestionType } from '@/types';

interface SectionBuilderProps {
  section: AssessmentSection;
  onUpdate: (updates: Partial<AssessmentSection>) => void;
  onDelete: () => void;
}

export function SectionBuilder({ section, onUpdate, onDelete }: SectionBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion: Question;

    if (type === 'single-choice') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'single-choice',
        text: '',
        required: false,
        order: section.questions.length,
        options: ['Option 1', 'Option 2'],
      };
    } else if (type === 'multi-choice') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'multi-choice',
        text: '',
        required: false,
        order: section.questions.length,
        options: ['Option 1', 'Option 2'],
      };
    } else if (type === 'short-text') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'short-text',
        text: '',
        required: false,
        order: section.questions.length,
      };
    } else if (type === 'long-text') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'long-text',
        text: '',
        required: false,
        order: section.questions.length,
      };
    } else if (type === 'numeric') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'numeric',
        text: '',
        required: false,
        order: section.questions.length,
      };
    } else {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'file-upload',
        text: '',
        required: false,
        order: section.questions.length,
      };
    }

    onUpdate({
      questions: [...section.questions, newQuestion],
    });
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    onUpdate({
      questions: section.questions.map(q => q.id === questionId ? { ...q, ...updates } as Question : q),
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    onUpdate({
      questions: section.questions.filter(q => q.id !== questionId)
        .map((q, index) => ({ ...q, order: index })),
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Section title"
              className="font-semibold"
            />
            <Input
              value={section.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Section description (optional)"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 size={20} className="text-red-600" />
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {section.questions.map((question) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}

          <div className="pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Add Question:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('single-choice')}
              >
                Single Choice
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('multi-choice')}
              >
                Multi Choice
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('short-text')}
              >
                Short Text
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('long-text')}
              >
                Long Text
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('numeric')}
              >
                Numeric
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddQuestion('file-upload')}
              >
                File Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

