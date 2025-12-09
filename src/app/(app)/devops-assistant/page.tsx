"use client";

import React, { useState } from "react";

interface DevOpsResponse {
  agent: string;
  data: {
    diagnosis: string;
    proposed_fix_explanation: string;
    patch_suggestion: string;
    pr_title: string;
    pr_description: string;
  };
  _mock?: boolean;
  _fallback?: boolean;
  warning?: string;
}

export default function DevOpsAssistantPage() {
  const [errorLog, setErrorLog] = useState("");
  const [codeContext, setCodeContext] = useState("");
  const [filePath, setFilePath] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DevOpsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agents/DevOpsAssistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error_log: errorLog,
          code_context: codeContext,
          file_path: filePath || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response from DevOps Assistant");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">DevOps Assistant</h1>
        <p className="text-slate-400 mb-6">
          Get AI-powered error diagnosis and fix suggestions
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Error Log / Stack Trace *
            </label>
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono"
              rows={5}
              placeholder="Error: Cannot read property 'id' of undefined&#10;    at Component (file.tsx:42:5)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Code Context *
            </label>
            <textarea
              value={codeContext}
              onChange={(e) => setCodeContext(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono"
              rows={10}
              placeholder="const MyComponent = (props) => {&#10;  const user = props.user;&#10;  return <div>{user.id}</div>;&#10;};"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              File Path (optional)
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm"
              placeholder="src/components/MyComponent.tsx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm"
              rows={3}
              placeholder="Any additional context that might help..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !errorLog.trim() || !codeContext.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Analyzing..." : "Get Diagnosis & Fix"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {result._mock && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-400 font-medium">
                  {result._fallback ? "⚠️ Fallback Mode" : "🧪 Mock Mode"}
                </p>
                {result.warning && (
                  <p className="text-yellow-300 text-sm mt-1">{result.warning}</p>
                )}
              </div>
            )}

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Diagnosis</h2>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">
                  {result.data.diagnosis}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Proposed Fix</h2>
                <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3">
                  {result.data.proposed_fix_explanation}
                </p>
                <pre className="bg-slate-950 border border-slate-800 rounded p-4 text-xs overflow-x-auto">
                  <code>{result.data.patch_suggestion}</code>
                </pre>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">PR Title</h2>
                <p className="text-slate-300 text-sm">{result.data.pr_title}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">PR Description</h2>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">
                  {result.data.pr_description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

