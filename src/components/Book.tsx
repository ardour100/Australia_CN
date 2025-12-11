import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import ReactMarkdown from 'react-markdown';
import bookData from '../data/chapters.json';
import coverImage from '../assets/cover.png';
import CollapsibleSection from './CollapsibleSection';
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
import authorData from '../data/chapters/author.json';

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
  // Odd pages (1, 3, 5...) are on the right, even pages (2, 4, 6...) are on the left
  const isLeftPage = number % 2 !== 0;
  const pageNumberClass = isLeftPage ? 'page-number left' : 'page-number right';

  return (
    <div className="book-page" ref={ref}>
      <div className="page-content">
        {children}
      </div>
      {number > 0 && <div className={pageNumberClass}>{number}</div>}
    </div>
  );
});

Page.displayName = 'Page';

const Book: React.FC = () => {
  // Detect mobile device
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Default to Simplified Chinese for all users
  const detectPreferredLanguage = (): 'zh' | 'zhTraditional' | 'en' => {
    // Always default to Simplified Chinese
    return 'zh';
  };

  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(!isMobile()); // Collapsed on mobile by default
  const [prefaceLanguage, setPrefaceLanguage] = useState<'zh' | 'zhTraditional' | 'en'>(detectPreferredLanguage());
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium'); // Font size control
  const [pageToRestore, setPageToRestore] = useState<number | null>(null); // Store page before language change
  const [flippingTime, setFlippingTime] = useState<number>(1000); // Control animation duration

  // Draggable navigation state
  const [navPosition, setNavPosition] = useState(() => {
    const saved = localStorage.getItem('navPosition');
    return saved ? JSON.parse(saved) : { x: 32, y: 32 }; // Default: 2rem = 32px
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragMoved, setDragMoved] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Touch tracking for smart scroll/swipe detection
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);

  // Calculate dynamic page sizes based on viewport height
  // Goal: NO scrollbars, content fits perfectly on each page
  const calculateDynamicPageSizes = () => {
    const viewportHeight = window.innerHeight;

    // Conservative estimates to ensure NO overflow (measured from actual rendered content)
    const estimatedParagraphHeight = 100;    // Each paragraph entry (including markdown) - conservative estimate
    const chapterHeaderHeight = 200;         // Chapter header with title and subtitle - with extra spacing
    const pageTopBottomPadding = 32;         // 1rem top + 1rem bottom from .book-page
    const safetyMargin = 100;                // Extra safety margin to prevent any overflow

    // Calculate available content height based on viewport
    // We need to leave enough room so content NEVER overflows
    const totalAvailableHeight = viewportHeight - pageTopBottomPadding - safetyMargin;

    // First page: subtract chapter header space
    const firstPageContentHeight = totalAvailableHeight - chapterHeaderHeight;
    const firstPageParagraphs = Math.max(1, Math.floor(firstPageContentHeight / estimatedParagraphHeight));

    // Other pages: full content area available
    const otherPageParagraphs = Math.max(2, Math.floor(totalAvailableHeight / estimatedParagraphHeight));

    console.log('📖 Dynamic page size calculation (NO overflow):', {
      viewportHeight,
      totalAvailableHeight,
      firstPageContentHeight,
      firstPageParagraphs,
      otherPageParagraphs,
      note: 'Conservative estimates to prevent scrollbars'
    });

    return {
      firstPageParagraphs,
      otherPageParagraphs
    };
  };

  // State for dynamic page sizes (changes with screen resize)
  const [dynamicPageSizes, setDynamicPageSizes] = useState<{
    firstPageParagraphs: number;
    otherPageParagraphs: number;
  }>(() => calculateDynamicPageSizes());

  // Update page sizes when window is resized (for different screen sizes)
  useEffect(() => {
    const handleResize = () => {
      const newSizes = calculateDynamicPageSizes();
      // Only update if values actually changed
      if (newSizes.firstPageParagraphs !== dynamicPageSizes.firstPageParagraphs ||
          newSizes.otherPageParagraphs !== dynamicPageSizes.otherPageParagraphs) {
        console.log('🔄 Screen resized - updating page layout');
        setDynamicPageSizes(newSizes);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dynamicPageSizes]);

  // Check if a paragraph starts with a section header (▶▶▶)
  const isSectionHeader = (paragraph: string): boolean => {
    return paragraph.trim().startsWith('▶▶▶');
  };

  // Extract section title from paragraph
  const extractSectionTitle = (paragraph: string): string => {
    const match = paragraph.match(/^▶▶▶\s*(.+?)(?:\n|$)/);
    return match ? match[1].trim() : '';
  };

  // Intelligently split long paragraphs into smaller chunks
  // This prevents content from being hidden due to overflow
  const splitLongParagraphs = (content: string[]): string[] => {
    const result: string[] = [];

    content.forEach(paragraph => {
      // Split by double newlines (Markdown paragraph separator)
      const subParagraphs = paragraph.split('\n\n').filter(p => p.trim());

      // If we got multiple sub-paragraphs, add them separately
      if (subParagraphs.length > 1) {
        result.push(...subParagraphs);
      } else {
        // If still one long paragraph, check if it has headers or lists
        // Split by headers (## or ###)
        const headerSplit = paragraph.split(/(?=\n#{2,3} )/);
        if (headerSplit.length > 1) {
          result.push(...headerSplit.map(p => p.trim()).filter(p => p));
        } else {
          // Keep as is
          result.push(paragraph);
        }
      }
    });

    console.log(`📝 Split ${content.length} entries into ${result.length} smaller paragraphs`);
    return result;
  };

  // Split chapter content into pages based on paragraph count
  // Dynamically adjusted based on viewport height
  const splitContentIntoPages = (content: string[], firstPageParagraphs?: number, otherPageParagraphs?: number) => {
    const pages: string[][] = [];

    if (content.length === 0) {
      return [[]];
    }

    // First, intelligently split long paragraphs
    const splitContent = splitLongParagraphs(content);

    // Use provided values or dynamic values based on screen size
    const firstPage = firstPageParagraphs ?? dynamicPageSizes.firstPageParagraphs;
    const otherPages = otherPageParagraphs ?? dynamicPageSizes.otherPageParagraphs;

    // First page has less space due to chapter header
    pages.push(splitContent.slice(0, firstPage));

    // Remaining pages can fit more content
    for (let i = firstPage; i < splitContent.length; i += otherPages) {
      pages.push(splitContent.slice(i, i + otherPages));
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

    pageCount += 2; // author introduction page + back cover
    return pageCount;
  };

  const [totalPages, setTotalPages] = useState(calculateTotalPages());

  // Recalculate total pages when dynamic page sizes or language changes
  useEffect(() => {
    const newTotalPages = calculateTotalPages();
    setTotalPages(newTotalPages);
  }, [dynamicPageSizes, prefaceLanguage]);

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
    // Navigate to the chapter page directly without animation
    const pageIndex = getChapterPageIndex(chapterIndex);

    // Temporarily disable animation by setting flipping time to 0
    setFlippingTime(0);

    // Navigate to the page
    setTimeout(() => {
      bookRef.current?.pageFlip().turnToPage(pageIndex);

      // Restore animation after navigation completes
      setTimeout(() => {
        setFlippingTime(1000);
      }, 50);
    }, 0);
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput, 10);

    // Calculate the actual flipbook page index for the given page number
    // Pages are structured as: cover(0), blank(0), preface(0), catalog(0), then chapters starting from page 1
    // So page number N corresponds to flipbook index: 4 + (N - 1) = 3 + N
    const pageIndex = 3 + pageNum;

    if (!isNaN(pageNum) && pageNum >= 1 && pageIndex < totalPages) {
      bookRef.current?.pageFlip().turnToPage(pageIndex);
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

  // Handle language change with page restoration
  const handleLanguageChange = (newLanguage: 'zh' | 'zhTraditional' | 'en') => {
    if (newLanguage !== prefaceLanguage) {
      // Save current page before language change
      setPageToRestore(currentPage);
      setPrefaceLanguage(newLanguage);
    }
  };

  // Restore page after HTMLFlipBook remounts
  useEffect(() => {
    if (pageToRestore !== null && bookRef.current) {
      // Use setTimeout to ensure flipbook is fully initialized
      setTimeout(() => {
        bookRef.current?.pageFlip().turnToPage(pageToRestore);
        setPageToRestore(null);
      }, 100);
    }
  }, [prefaceLanguage, pageToRestore]);

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

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragOffset({
      x: clientX - navPosition.x,
      y: clientY - navPosition.y
    });
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    setDragMoved(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    // Keep navigation within viewport bounds
    const maxX = window.innerWidth - (navRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (navRef.current?.offsetHeight || 0);

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    setNavPosition({ x: boundedX, y: boundedY });
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to localStorage
      localStorage.setItem('navPosition', JSON.stringify(navPosition));
    }
  };

  // Handle toggle click - only if not dragged
  const handleToggleClick = () => {
    if (!dragMoved) {
      toggleNav();
    }
    setDragMoved(false);
  };

  // Set up drag event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset, navPosition]);

  // Smart touch handling: distinguish vertical scroll from horizontal swipe
  useEffect(() => {
    const flipbookElement = document.querySelector('.flipbook-wrapper');
    if (!flipbookElement) return;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      touchStartX.current = touchEvent.touches[0].clientX;
      touchStartY.current = touchEvent.touches[0].clientY;
      isScrolling.current = false;
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (!touchStartX.current || !touchStartY.current) return;

      const currentX = touchEvent.touches[0].clientX;
      const currentY = touchEvent.touches[0].clientY;

      const deltaX = Math.abs(currentX - touchStartX.current);
      const deltaY = Math.abs(currentY - touchStartY.current);

      // Determine if this is a scroll or swipe
      // If vertical movement is greater than horizontal, it's a scroll
      if (deltaY > deltaX && deltaY > 10) {
        isScrolling.current = true;
      }

      // If user is scrolling vertically, prevent page flip
      if (isScrolling.current) {
        // Allow the scroll to happen, don't interfere
        return;
      }
    };

    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (!touchStartX.current || !touchStartY.current) return;

      touchEndX.current = touchEvent.changedTouches[0].clientX;
      touchEndY.current = touchEvent.changedTouches[0].clientY;

      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Only trigger page flip if:
      // 1. Horizontal movement is greater than vertical
      // 2. Not currently scrolling
      // 3. Horizontal swipe distance is significant (> 50px)
      if (absDeltaX > absDeltaY && !isScrolling.current && absDeltaX > 50) {
        if (deltaX > 0 && currentPage > 0) {
          // Swipe right - previous page
          bookRef.current?.pageFlip().flipPrev();
        } else if (deltaX < 0 && currentPage < totalPages - 1) {
          // Swipe left - next page
          bookRef.current?.pageFlip().flipNext();
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
      isScrolling.current = false;
    };

    flipbookElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    flipbookElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    flipbookElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      flipbookElement.removeEventListener('touchstart', handleTouchStart);
      flipbookElement.removeEventListener('touchmove', handleTouchMove);
      flipbookElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, totalPages]);

  return (
    <div className={`book-container font-size-${fontSize}`}>
      <div className="flipbook-wrapper">
        <HTMLFlipBook
          key={prefaceLanguage}
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
          mobileScrollSupport={false}
          onFlip={onFlip}
          className="flip-book"
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          flippingTime={flippingTime}
          style={{}}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={false}
          swipeDistance={50}
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
            <div className="content-page preface-page">
              <div className="language-toggle">
                <button
                  className={`lang-btn ${prefaceLanguage === 'zh' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('zh')}
                >
                  简体
                </button>
                <button
                  className={`lang-btn ${prefaceLanguage === 'zhTraditional' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('zhTraditional')}
                >
                  繁體
                </button>
                <button
                  className={`lang-btn ${prefaceLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
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

                {/* Author Introduction Entry */}
                <div
                  className="catalog-item author-catalog-item"
                  onClick={() => {
                    // Navigate to author page (second to last page, before back cover)
                    const authorPageIndex = totalPages - 2;
                    bookRef.current?.pageFlip().turnToPage(authorPageIndex);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="chapter-number">📖</span>
                  <div className="chapter-titles">
                    <div className="chapter-title-en">About the Author</div>
                    <div className="chapter-title-zh">{authorData.title}</div>
                  </div>
                  <span className="chapter-page">{totalPages - 1}</span>
                </div>
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
                        pageContent.map((paragraph: string, pIndex: number) => {
                          const isSection = isSectionHeader(paragraph);
                          const sectionTitle = isSection ? extractSectionTitle(paragraph) : '';
                          const sectionContent = isSection ? paragraph.replace(/^▶▶▶\s*.+?\n/, '') : '';

                          // If it's a section header, use the CollapsibleSection component
                          if (isSection) {
                            return (
                              <CollapsibleSection
                                key={pIndex}
                                title={sectionTitle}
                                content={sectionContent}
                              />
                            );
                          }

                          // Regular paragraph (not a section)
                          return (
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
                          );
                        })
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

          {/* Author Introduction Page */}
          <Page number={0}>
            <div className="author-page">
              <h2 className="author-page-title">{authorData.title}</h2>
              <h3 className="author-name">{authorData.name}</h3>

              {authorData.sections.map((section, index) => (
                <div key={index} className="author-intro-section">
                  <h4>{section.heading}</h4>
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              ))}

              <div className="author-conclusion">
                <p className="author-note">
                  <strong>客观评价：</strong>{authorData.conclusion}
                </p>
              </div>
            </div>
          </Page>

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
      <div
        ref={navRef}
        className={`floating-nav ${isNavExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${navPosition.x}px`,
          top: `${navPosition.y}px`
        }}
      >
        <button
          className="nav-toggle"
          onClick={handleToggleClick}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          aria-label="Toggle navigation (drag to move)"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
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
