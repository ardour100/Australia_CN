import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface CollapsibleSectionProps {
  title: string;
  content: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, content }) => {
  // Each section has its own independent state
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="collapsible-section">
      <div
        className="section-header"
        onClick={toggleExpanded}
        style={{ cursor: 'pointer' }}
      >
        <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
        <h3>{title}</h3>
      </div>
      {isExpanded && (
        <div className="section-content markdown-content">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ width: "380px", height: "200px", objectFit: "cover" }}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
