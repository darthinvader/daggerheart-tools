import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SessionZeroQuestion } from '@/lib/schemas/campaign';

interface EditableQuestionsProps {
  questions: SessionZeroQuestion[];
  onChange: (questions: SessionZeroQuestion[]) => void;
  onBlur?: () => void;
}

export function EditableQuestions({
  questions,
  onChange,
  onBlur,
}: EditableQuestionsProps) {
  const addQuestion = () => {
    onChange([
      ...questions,
      {
        id: `question-${Date.now()}`,
        question: '',
        category: 'custom',
      },
    ]);
  };

  const updateQuestion = (
    id: string,
    updates: Partial<SessionZeroQuestion>
  ) => {
    onChange(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={question.id} className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={question.question}
              onChange={e =>
                updateQuestion(question.id, { question: e.target.value })
              }
              onBlur={onBlur}
              placeholder={`Question ${index + 1}`}
              rows={2}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => removeQuestion(question.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addQuestion} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
