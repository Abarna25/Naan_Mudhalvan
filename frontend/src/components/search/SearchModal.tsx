'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, User, Code, Award, CheckCircle } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    students: any[];
    projects: any[];
    skills: any[];
    certifications: any[];
  }>({
    students: [
      { name: 'Aravind Kumar', dept: 'CSE', score: '88%' },
      { name: 'Kavitha R', dept: 'IT', score: '92%' },
    ],
    projects: [
      { title: 'AI Smart Traffic Management', tech: 'Python, FastAPI, OpenCV' },
      { title: 'Cloud Microservices Shop', tech: 'Node.js, Docker, Redis' },
    ],
    skills: [
      { name: 'React.js', category: 'Frontend' },
      { name: 'PostgreSQL', category: 'Database' },
    ],
    certifications: [
      { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services' },
      { title: 'Naan Mudhalvan Advanced Full Stack', issuer: 'TNSDC' },
    ],
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled elsewhere or passed in
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type student name, skill, project, or certification..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Students Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Students</span>
            </h4>
            <div className="space-y-1">
              {results.students.map((st, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-xs">
                  <div>
                    <span className="font-medium text-slate-200">{st.name}</span>
                    <span className="text-slate-500 ml-2">({st.dept})</span>
                  </div>
                  <span className="text-emerald-400 font-medium">Eligibility Score: {st.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Projects</span>
            </h4>
            <div className="space-y-1">
              {results.projects.map((proj, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-xs">
                  <span className="font-medium text-slate-200">{proj.title}</span>
                  <span className="text-slate-400">{proj.tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Certifications</span>
            </h4>
            <div className="space-y-1">
              {results.certifications.map((cert, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-xs">
                  <span className="font-medium text-slate-200">{cert.title}</span>
                  <span className="text-blue-400">{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
