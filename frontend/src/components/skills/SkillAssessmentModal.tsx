import React, { useState } from 'react';
import { Award, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface SkillAssessmentModalProps {
  studentSkillId: string;
  skillName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  studentSkillId,
  skillName,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/student/skills/${studentSkillId}/assessment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAttemptId(json.data.attemptId);
        setQuestions(json.data.questions || []);
      } else {
        setError(json.error || 'Failed to start assessment');
      }
    } catch (e) {
      setError('Error connecting to assessment server');
    } finally {
      setLoading(false);
    }
  };

  const submitAssessment = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const answersArray = questions.map((_, idx) => answers[idx] ?? -1);
      const res = await fetch(`http://localhost:5000/api/student/skills/${studentSkillId}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          attemptId,
          answers: answersArray,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        onSuccess();
      } else {
        setError(json.error || 'Failed to evaluate assessment');
      }
    } catch (e) {
      setError('Error submitting assessment answers');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">{skillName} Practical Skill Assessment</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!attemptId && !result && (
          <div className="space-y-4 text-xs text-slate-300">
            <p>
              Take a short server-evaluated MCQ assessment to convert your self-declared <strong className="text-white">{skillName}</strong> claim into a <strong className="text-emerald-400">VERIFIED / HIGH CONFIDENCE</strong> skill.
            </p>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span>Questions: <strong>5 Questions</strong></span>
                <span>Passing Score: <strong>60%</strong></span>
              </div>
              <p className="text-[11px] text-slate-400">
                Server-evaluated answer keys. Score directly updates your Data Confidence Score.
              </p>
            </div>
            <button
              onClick={startAssessment}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Starting Assessment...' : 'Start Skill Assessment'}
            </button>
          </div>
        )}

        {attemptId && !result && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-semibold text-slate-100">
                  {qIdx + 1}. {q.questionText}
                </p>
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                        answers[qIdx] === optIdx
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${qIdx}`}
                        checked={answers[qIdx] === optIdx}
                        onChange={() => setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                        className="hidden"
                      />
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                        {answers[qIdx] === optIdx && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                      </span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submitAssessment}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Evaluating Server Answers...' : 'Submit Assessment Answers'}
            </button>
          </div>
        )}

        {result && (
          <div className="text-center py-4 space-y-3">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2 ${result.passed ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-amber-500/10 border-amber-500 text-amber-400'}`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">{result.passed ? 'Assessment Passed!' : 'Assessment Complete'}</h4>
            <p className="text-sm text-slate-300">
              Score: <strong className="text-emerald-400">{result.score}%</strong> (Passing threshold: 60%)
            </p>
            <p className="text-xs text-slate-400">
              {result.passed ? `Your ${skillName} skill status has been updated to HIGH CONFIDENCE!` : 'Try reviewing concepts and retake the assessment.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition mt-2"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
