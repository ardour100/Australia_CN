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
  const totalPages = bookData.chapters.length + 2; // chapters + cover + back cover

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
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

          {/* Dynamic Chapter Pages */}
          {bookData.chapters.map((chapter) => (
            <Page key={chapter.id} number={chapter.pageNumber}>
              <div className="content-page">
                <h2>{chapter.title}</h2>
                {chapter.content.map((paragraph, index) => (
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
