import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import bookData from '../data/chapters.json';
import coverImage from '../assets/cover.png';
import './Book.css';

interface PageProps {
  number: number;
  children: React.ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ number, children }, ref) => {
  return (
    <div className="book-page" ref={ref}>
      <div className="page-content">
        {children}
      </div>
      {number > 0 && <div className="page-number">{number}</div>}
    </div>
  );
});

Page.displayName = 'Page';

const Book: React.FC = () => {
  // Detect user's preferred language based on browser settings
  const detectPreferredLanguage = (): 'zh' | 'zhTraditional' | 'en' => {
    const userLanguage = navigator.language || (navigator as any).userLanguage;

    // Check for Traditional Chinese (Taiwan, Hong Kong, Macau)
    if (userLanguage.includes('zh-TW') || userLanguage.includes('zh-HK') || userLanguage.includes('zh-MO')) {
      return 'zhTraditional';
    }
    // Check for Simplified Chinese
    else if (userLanguage.includes('zh')) {
      return 'zh';
    }
    // Check for English
    else if (userLanguage.includes('en')) {
      return 'en';
    }

    // Default to Simplified Chinese
    return 'zh';
  };

  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [prefaceLanguage, setPrefaceLanguage] = useState<'zh' | 'zhTraditional' | 'en'>(detectPreferredLanguage());
  const totalPages = bookData.chapters.length + 5; // chapters + cover + blank + preface + catalog + back cover

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const handleChapterClick = (chapterIndex: number) => {
    // Navigate to the chapter page (chapter index + 4 because of cover, blank, preface, and catalog)
    const pageIndex = chapterIndex + 4;
    bookRef.current?.pageFlip().flip(pageIndex);
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      bookRef.current?.pageFlip().flip(pageNum - 1);
      setGoToPageInput('');
    }
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  // Add keyboard arrow key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // Previous page
        if (currentPage > 0) {
          bookRef.current?.pageFlip().flipPrev();
        }
      } else if (e.key === 'ArrowRight') {
        // Next page
        if (currentPage < totalPages - 1) {
          bookRef.current?.pageFlip().flipNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="book-container">
      <div className="flipbook-wrapper">
        <HTMLFlipBook
          ref={bookRef}
          width={715}
          height={935}
          size="stretch"
          minWidth={330}
          maxWidth={880}
          minHeight={440}
          maxHeight={1100}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flip-book"
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          style={{}}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover Page */}
          <Page number={0}>
            <div className="cover-page">
              <img src={coverImage} alt="Book Cover" className="cover-image" />
            </div>
          </Page>

          {/* Blank Page */}
          <Page number={0}>
            <div className="blank-page"></div>
          </Page>

          {/* Preface Page */}
          <Page number={0}>
            <div className="content-page preface-page">
              <div className="language-toggle">
                <button
                  className={`lang-btn ${prefaceLanguage === 'zh' ? 'active' : ''}`}
                  onClick={() => setPrefaceLanguage('zh')}
                >
                  简体
                </button>
                <button
                  className={`lang-btn ${prefaceLanguage === 'zhTraditional' ? 'active' : ''}`}
                  onClick={() => setPrefaceLanguage('zhTraditional')}
                >
                  繁體
                </button>
                <button
                  className={`lang-btn ${prefaceLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => setPrefaceLanguage('en')}
                >
                  EN
                </button>
              </div>
              <h2>{bookData.preface.title[prefaceLanguage]}</h2>
              {bookData.preface.content[prefaceLanguage].map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p className="signature">{bookData.preface.signature}</p>
            </div>
          </Page>

          {/* Catalog Page */}
          <Page number={0}>
            <div className="catalog-page">
              <h2 className="catalog-title">Table of Contents<br/>目录 / 目錄</h2>
              <div className="catalog-list">
                {bookData.chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="catalog-item"
                    onClick={() => handleChapterClick(index)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="chapter-number">{chapter.id}</span>
                    <div className="chapter-titles">
                      <div className="chapter-title-en">{chapter.title}</div>
                      <div className="chapter-title-zh">
                        {chapter.chineseTitle} / {chapter.chineseTitleTraditional}
                      </div>
                    </div>
                    <span className="chapter-page">{chapter.pageNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </Page>

          {/* Dynamic Chapter Pages */}
          {bookData.chapters.map((chapter: any) => (
            <Page key={chapter.id} number={chapter.pageNumber}>
              <div className="content-page">
                <h2>{chapter.title}</h2>
                {chapter.content.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {chapter.placeholder && (
                  <div className="placeholder-text">{chapter.placeholder}</div>
                )}
                {chapter.note && (
                  <div className="page-note">
                    <strong>Note:</strong> {chapter.note}
                  </div>
                )}
              </div>
            </Page>
          ))}

          {/* Back Cover */}
          <Page number={bookData.chapters.length + 1}>
            <div className="back-cover">
              <div className="back-cover-content">
                <h3>{bookData.backCover.title}</h3>
                {bookData.backCover.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="back-note">{bookData.backCover.note}</p>
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Floating Navigation */}
      <div className={`floating-nav ${isNavExpanded ? 'expanded' : ''}`}>
        <button className="nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
          {isNavExpanded ? '✕' : '📖'}
        </button>

        {isNavExpanded && (
          <div className="nav-content">
            <div className="current-page-display">
              Page {currentPage + 1} of {totalPages}
            </div>
            <form onSubmit={handleGoToPage} className="go-to-page-form">
              <label htmlFor="page-input">Go to page:</label>
              <input
                id="page-input"
                type="number"
                min="1"
                max={totalPages}
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
                placeholder={`1-${totalPages}`}
                className="page-input"
              />
              <button type="submit" className="go-button">Go</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
