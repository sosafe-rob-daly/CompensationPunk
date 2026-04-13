import { useState } from 'react';

interface PromptBarProps {
  prompt: string;
}

export function PromptBar({ prompt }: PromptBarProps) {
  const [copied, setCopied] = useState(false);

  function copyPrompt() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="prompt-bar">
      <div className="prompt-text">{prompt}</div>
      <button className={'copy-btn' + (copied ? ' copied' : '')} onClick={copyPrompt}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
