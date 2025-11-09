import React, { useState } from 'react';
import { Lesson } from '../types';
import { askQuestionAboutLesson } from '../services/geminiService';

interface LessonQAProps {
  lesson: Lesson | null;
}

const LessonQA: React.FC<LessonQAProps> = ({ lesson }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim() || !lesson) return;

    setIsLoading(true);
    setAnswer('');
    const result = await askQuestionAboutLesson(lesson.title, lesson.content, question);
    setAnswer(result);
    setIsLoading(false);
    setQuestion('');
  };

  if (!lesson) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3">❓ Preguntas sobre la Lección</h3>
      <div className="flex-1 bg-gray-200 dark:bg-gray-800 p-4 rounded-md overflow-y-auto mb-3 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
        <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">💬 Respuesta:</h4>
        {isLoading && <p className="text-sm text-gray-600 dark:text-gray-400">🤖 Pensando en la respuesta...</p>}
        {!isLoading && !answer && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">💭 Escribe una pregunta sobre "{lesson.title}" y haz clic en Enviar...</p>
        )}
        <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-300">{answer}</p>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          placeholder={`Pregunta sobre "${lesson.title}"...`}
          className="flex-1 p-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-300 dark:border-gray-700 transition-colors duration-300"
          disabled={isLoading}
        />
        <button
          onClick={handleAskQuestion}
          disabled={isLoading || !question.trim()}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors font-semibold text-white"
        >
          {isLoading ? '💬 Preguntando...' : '📤 Enviar'}
        </button>
      </div>
    </div>
  );
};

export default LessonQA;
