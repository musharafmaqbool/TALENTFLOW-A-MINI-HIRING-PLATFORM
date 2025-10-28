import { Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Question } from '@/types';

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

export function QuestionBuilder({ question, onUpdate, onDelete }: QuestionBuilderProps) {
  const handleAddOption = () => {
    if (question.type === 'single-choice' || question.type === 'multi-choice') {
      const options = (question as any).options || [];
      onUpdate({ options: [...options, `Option ${options.length + 1}`] } as any);
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (question.type === 'single-choice' || question.type === 'multi-choice') {
      const options = [...(question as any).options];
      options[index] = value;
      onUpdate({ options } as any);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (question.type === 'single-choice' || question.type === 'multi-choice') {
      const options = (question as any).options.filter((_: any, i: number) => i !== index);
      onUpdate({ options } as any);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <Input
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Question text"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 size={16} className="text-red-600" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">
          {question.type.replace('-', ' ').toUpperCase()}
        </span>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Required
        </label>
      </div>

      {/* Type-specific configuration */}
      {(question.type === 'single-choice' || question.type === 'multi-choice') && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Options:</p>
          {((question as any).options || []).map((option: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => handleUpdateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveOption(index)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={handleAddOption}>
            <Plus size={16} className="mr-1" />
            Add Option
          </Button>
        </div>
      )}

      {(question.type === 'short-text' || question.type === 'long-text') && (
        <div className="flex gap-4">
          <Input
            type="number"
            label="Max Length"
            value={(question as any).maxLength || ''}
            onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) || undefined } as any)}
            placeholder="Optional"
          />
        </div>
      )}

      {question.type === 'numeric' && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Min Value"
            value={(question as any).min || ''}
            onChange={(e) => onUpdate({ min: parseInt(e.target.value) || undefined } as any)}
            placeholder="Optional"
          />
          <Input
            type="number"
            label="Max Value"
            value={(question as any).max || ''}
            onChange={(e) => onUpdate({ max: parseInt(e.target.value) || undefined } as any)}
            placeholder="Optional"
          />
        </div>
      )}

      {question.type === 'file-upload' && (
        <Input
          label="Accepted Formats (comma-separated)"
          value={(question as any).acceptedFormats?.join(', ') || ''}
          onChange={(e) => onUpdate({ acceptedFormats: e.target.value.split(',').map(s => s.trim()) } as any)}
          placeholder="e.g., .pdf, .doc, .docx"
        />
      )}
    </div>
  );
}



