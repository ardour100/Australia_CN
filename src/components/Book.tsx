import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import ReactMarkdown from 'react-markdown';
import bookData from '../data/chapters.json';
import coverImage from '../assets/cover.png';
import './Book.css';

// Import all chapter files
import chapter01 from '../data/chapters/chapter-01.json';
import chapter02 from '../data/chapters/chapter-02.json';
import chapter03 from '../data/chapters/chapter-03.json';
import chapter04 from '../data/chapters/chapter-04.json';
import chapter05 from '../data/chapters/chapter-05.json';
import chapter06 from '../data/chapters/chapter-06.json';
import chapter07 from '../data/chapters/chapter-07.json';
import chapter08 from '../data/chapters/chapter-08.json';
import chapter09 from '../data/chapters/chapter-09.json';
import chapter10 from '../data/chapters/chapter-10.json';
import chapter11 from '../data/chapters/chapter-11.json';
import chapter12 from '../data/chapters/chapter-12.json';
import chapter13 from '../data/chapters/chapter-13.json';
import chapter14 from '../data/chapters/chapter-14.json';
import chapter15 from '../data/chapters/chapter-15.json';
import chapter16 from '../data/chapters/chapter-16.json';
import chapter17 from '../data/chapters/chapter-17.json';
import chapter18 from '../data/chapters/chapter-18.json';

// Map chapter files to their IDs
const chapterContents: { [key: number]: any } = {
  1: chapter01,
  2: chapter02,
  3: chapter03,
  4: chapter04,
  5: chapter05,
  6: chapter06,
  7: chapter07,
  8: chapter08,
  9: chapter09,
  10: chapter10,
  11: chapter11,
  12: chapter12,
  13: chapter13,
  14: chapter14,
  15: chapter15,
  16: chapter16,
  17: chapter17,
  18: chapter18,
};

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
  // Default to Simplified Chinese for all users
  const detectPreferredLanguage = (): 'zh' | 'zhTraditional' | 'en' => {
    // Always default to Simplified Chinese
    return 'zh';
  };

  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(true); // Start expanded to show instructions
  const [prefaceLanguage, setPrefaceLanguage] = useState<'zh' | 'zhTraditional' | 'en'>(detectPreferredLanguage());
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium'); // Font size control

  // Split chapter content into pages based on paragraph count
  // Adjusted to fit page height - smaller number for first page (with header), more for subsequent pages
  const splitContentIntoPages = (content: string[], firstPageParagraphs: number = 3, otherPageParagraphs: number = 5) => {
    const pages: string[][] = [];

    if (content.length === 0) {
      return [[]];
    }

    // First page has less space due to chapter header
    pages.push(content.slice(0, firstPageParagraphs));

    // Remaining pages can fit more content
    for (let i = firstPageParagraphs; i < content.length; i += otherPageParagraphs) {
      pages.push(content.slice(i, i + otherPageParagraphs));
    }

    return pages;
  };

  // Calculate total pages dynamically based on content
  const calculateTotalPages = () => {
    let pageCount = 4; // cover + blank + preface + catalog

    bookData.chapters.forEach((chapter: any) => {
      // Get full chapter content from imported files
      const fullChapter = chapterContents[chapter.id];

      let content: string[] = [];
      if (prefaceLanguage === 'zh' && fullChapter?.contentZh) {
        content = fullChapter.contentZh;
      } else if (prefaceLanguage === 'zhTraditional' && fullChapter?.contentZhTraditional) {
        content = fullChapter.contentZhTraditional;
      } else if (prefaceLanguage === 'en' && fullChapter?.content) {
        content = fullChapter.content;
      }

      if (content && content.length > 0) {
        const pages = splitContentIntoPages(content);
        pageCount += pages.length;
      } else {
        pageCount += 1; // Empty chapter still gets one page
      }
    });

    pageCount += 1; // back cover
    return pageCount;
  };

  const totalPages = calculateTotalPages();

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  // Calculate the actual page index for each chapter based on content
  const getChapterPageIndex = (chapterIndex: number) => {
    let pageIndex = 4; // Start after cover + blank + preface + catalog

    // Calculate pages for all chapters before this one
    for (let i = 0; i < chapterIndex; i++) {
      const chapter = bookData.chapters[i];
      const fullChapter = chapterContents[chapter.id];

      let content: string[] = [];
      if (prefaceLanguage === 'zh' && fullChapter?.contentZh) {
        content = fullChapter.contentZh;
      } else if (prefaceLanguage === 'zhTraditional' && fullChapter?.contentZhTraditional) {
        content = fullChapter.contentZhTraditional;
      } else if (prefaceLanguage === 'en' && fullChapter?.content) {
        content = fullChapter.content;
      }

      if (content && content.length > 0) {
        const pages = splitContentIntoPages(content);
        pageIndex += pages.length;
      } else {
        pageIndex += 1; // Empty chapter still gets one page
      }
    }

    return pageIndex;
  };

  const handleChapterClick = (chapterIndex: number) => {
    // Navigate to the chapter page (chapter index + 4 because of cover, blank, preface, and catalog)
    const pageIndex = chapterIndex + 4;
    bookRef.current?.pageFlip().turnToPage(pageIndex);
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      bookRef.current?.pageFlip().turnToPage(pageNum - 1);
      setGoToPageInput('');
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setGoToPageInput(value);
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
    <div className={`book-container font-size-${fontSize}`}>
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

          {/* Blank Page
          <Page number={0}>
            <div className="blank-page"></div>
          </Page> */}

          {/* Preface Page */}
          <Page number={0}>
            <div className="content-page preface-page" key={`preface-${prefaceLanguage}`}>
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
              {bookData.preface.content[prefaceLanguage] && Array.isArray(bookData.preface.content[prefaceLanguage]) ? (
                bookData.preface.content[prefaceLanguage].map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>内容加载中...</p>
              )}
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
                    <span className="chapter-page">{getChapterPageIndex(index) + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Page>

          {/* Dynamic Chapter Pages */}
          {(() => {
            let currentPageNumber = 1;
            const pages: React.ReactElement[] = [];

            bookData.chapters.forEach((chapter: any) => {
              // Get full chapter content from imported files
              const fullChapter = chapterContents[chapter.id];

              // Get content based on language
              let content: string[] = [];
              if (prefaceLanguage === 'zh' && fullChapter?.contentZh) {
                content = fullChapter.contentZh;
              } else if (prefaceLanguage === 'zhTraditional' && fullChapter?.contentZhTraditional) {
                content = fullChapter.contentZhTraditional;
              } else if (prefaceLanguage === 'en' && fullChapter?.content) {
                content = fullChapter.content;
              }

              // Split content into pages
              const contentPages = content && content.length > 0 ? splitContentIntoPages(content) : [[]];

              // Create pages for this chapter
              contentPages.forEach((pageContent: string[], pageIndex: number) => {
                const isFirstPage = pageIndex === 0;

                pages.push(
                  <Page key={`${chapter.id}-${pageIndex}`} number={currentPageNumber}>
                    <div className="content-page">
                      {isFirstPage && (
                        <div className="chapter-header">
                          <div className="chapter-number">Chapter {chapter.id}</div>
                          <h2>{chapter.title}</h2>
                          <div className="chapter-title-cn">{chapter.chineseTitle} / {chapter.chineseTitleTraditional}</div>
                        </div>
                      )}

                      {/* Render page content with markdown support */}
                      {pageContent.length > 0 ? (
                        pageContent.map((paragraph: string, pIndex: number) => (
                          <div key={pIndex} className="markdown-content">
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
                              {paragraph}
                            </ReactMarkdown>
                          </div>
                        ))
                      ) : (
                        fullChapter?.placeholder && (
                          <div className="placeholder-text">{fullChapter.placeholder}</div>
                        )
                      )}

                      {isFirstPage && fullChapter?.note && (
                        <div className="page-note">
                          <strong>Note:</strong> {fullChapter.note}
                        </div>
                      )}
                    </div>
                  </Page>
                );

                currentPageNumber++;
              });
            });

            return pages;
          })()}

          {/* Back Cover */}
          <Page number={0}>
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={goToPageInput}
                onChange={handlePageInputChange}
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
                  onClick={() => setFontSize('small')}
                  aria-label="Small font"
                >
                  Aa
                </button>
                <button
                  type="button"
                  className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => setFontSize('medium')}
                  aria-label="Medium font"
                >
                  Aa
                </button>
                <button
                  type="button"
                  className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => setFontSize('large')}
                  aria-label="Large font"
                >
                  Aa
                </button>
              </div>
            </div>
            <div className="usage-instructions">
              <h4>How to Use</h4>
              <ul>
                <li>← → Arrow keys</li>
                <li>Click page to flip</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
