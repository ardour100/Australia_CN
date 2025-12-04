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
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = bookData.chapters.length + 3; // chapters + cover + catalog + back cover

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const handleChapterClick = (chapterIndex: number) => {
    // Navigate to the chapter page (chapter index + 2 because of cover and catalog)
    const pageIndex = chapterIndex + 2;
    bookRef.current?.pageFlip().flip(pageIndex);
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
          width={650}
          height={850}
          size="stretch"
          minWidth={300}
          maxWidth={800}
          minHeight={400}
          maxHeight={1000}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flip-book"
          usePortrait={false}
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

          {/* Catalog Page */}
          <Page number={0}>
            <div className="catalog-page">
              <h2 className="catalog-title">Table of Contents<br/>目录</h2>
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
                      <div className="chapter-title-zh">{chapter.chineseTitle}</div>
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
    </div>
  );
};

export default Book;
