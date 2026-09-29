import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-sim-border">
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
          Feedback & Support
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Contact Engineering Team
        </h1>
        <p className="text-xs sm:text-sm text-sim-muted leading-relaxed">
          Questions regarding simulation models, graph topology schemas, or hackathon deployment? Submit an engineering inquiry.
        </p>
      </div>

      <div className="rounded-sm border border-sim-border bg-sim-panel p-6">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              Inquiry Logged
            </h3>
            <p className="text-xs text-sim-muted max-w-sm mx-auto">
              Thank you for testing the API Failure Twin prototype. Your simulation feedback has been received.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setFeedback('');
              }}
              className="text-xs font-mono text-blue-400 hover:underline pt-2 inline-block"
            >
              Submit another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Reliability Engineer"
                  className="w-full rounded-sm border border-sim-border bg-sim-card px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full rounded-sm border border-sim-border bg-sim-card px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1">
                Topology or Scenario Feedback
              </label>
              <textarea
                required
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts on the deterministic blast radius calculation, mitigation strategies, or custom scenario configurations..."
                className="w-full rounded-sm border border-sim-border bg-sim-card px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Engineering Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
