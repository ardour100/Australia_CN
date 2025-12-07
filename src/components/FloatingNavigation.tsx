import React from 'react';

interface FloatingNavigationProps {
  isExpanded: boolean;
  currentPage: number;
  totalPages: number;
  goToPageInput: string;
  fontSize: 'small' | 'medium' | 'large';
  onToggle: () => void;
  onGoToPage: (e: React.FormEvent) => void;
  onPageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  isExpanded,
  currentPage,
  totalPages,
  goToPageInput,
  fontSize,
  onToggle,
  onGoToPage,
  onPageInputChange,
  onFontSizeChange,
}) => {
  return (
    <div className={`floating-nav ${isExpanded ? 'expanded' : ''}`}>
      <button className="nav-toggle" onClick={onToggle} aria-label="Toggle navigation">
        {isExpanded ? '✕' : '📖'}
      </button>

      {isExpanded && (
        <div className="nav-content">
          <div className="current-page-display">
            Page {currentPage + 1} of {totalPages}
          </div>
          <form onSubmit={onGoToPage} className="go-to-page-form">
            <label htmlFor="page-input">Go to page:</label>
            <input
              id="page-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={goToPageInput}
              onChange={onPageInputChange}
              placeholder="Enter page number"
              className="page-input"
            />
            <button type="submit" className="go-button">Go</button>
          </form>

          {/* Font Size Control */}
          <div className="font-size-control">
            <label>Font size:</label>
            <div className="font-size-buttons">
              <button
                type="button"
                className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('small')}
                aria-label="Small font"
              >
                Aa
              </button>
              <button
                type="button"
                className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('medium')}
                aria-label="Medium font"
              >
                Aa
              </button>
              <button
                type="button"
                className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('large')}
                aria-label="Large font"
              >
                Aa
              </button>
            </div>
          </div>
          <div className="usage-instructions">
            <h4>How to Use / 使用说明</h4>
            <ul>
              <li>← → Arrow keys / 左右键翻页</li>
              <li>Click page to flip / 点击翻页</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingNavigation;
