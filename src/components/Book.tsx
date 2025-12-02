import React, { useRef, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
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
      <div className="page-number">{number}</div>
    </div>
  );
});

Page.displayName = 'Page';

const Book: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(10);

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <h1 className="book-title">How an Ancient Land Became a Great Democracy</h1>
        <h2 className="book-subtitle">Australia History</h2>
        <p className="page-counter">Page {currentPage + 1} of {totalPages}</p>
      </div>

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
              <div className="cover-content">
                <h1>How an Ancient Land<br/>Became a<br/>Great Democracy</h1>
                <div className="cover-divider"></div>
                <h2>Australia History</h2>
                <p className="cover-subtitle">From Ancient Times to Modern Nation</p>
              </div>
            </div>
          </Page>

          {/* Page 1-2 */}
          <Page number={1}>
            <div className="content-page">
              <h2>Chapter 1: The Ancient Land</h2>
              <p>
                Long before European explorers set foot on its shores, Australia was home to one of
                the world's oldest continuous cultures. For over 65,000 years, Aboriginal and Torres
                Strait Islander peoples have inhabited this ancient continent.
              </p>
              <p>
                The land they called home was vast and varied - from tropical rainforests in the
                north to arid deserts in the center, from snow-capped mountains to endless coastlines.
              </p>
              <div className="page-note">
                <strong>Note:</strong> This content is placeholder. Add your own historical content here.
              </div>
            </div>
          </Page>

          <Page number={2}>
            <div className="content-page">
              <h2>Indigenous Governance</h2>
              <p>
                Indigenous Australians developed sophisticated systems of law, governance, and land
                management. Their connection to country was not merely physical but deeply spiritual.
              </p>
              <p>
                Dreamtime stories passed down through generations contained not just mythology, but
                practical knowledge about navigation, seasons, and sustainable living.
              </p>
              <div className="placeholder-text">
                [Add more content about indigenous governance systems...]
              </div>
            </div>
          </Page>

          {/* Page 3-4 */}
          <Page number={3}>
            <div className="content-page">
              <h2>Chapter 2: European Exploration</h2>
              <p>
                In 1770, Captain James Cook claimed the east coast of Australia for Britain. This
                moment would change the continent forever.
              </p>
              <div className="placeholder-text">
                [Add content about early European exploration...]
              </div>
            </div>
          </Page>

          <Page number={4}>
            <div className="content-page">
              <h2>The First Fleet</h2>
              <p>
                On January 26, 1788, the First Fleet arrived in Port Jackson (Sydney Harbour),
                bringing convicts, marines, and officials to establish a penal colony.
              </p>
              <div className="placeholder-text">
                [Add content about the First Fleet and early settlement...]
              </div>
            </div>
          </Page>

          {/* Page 5-6 */}
          <Page number={5}>
            <div className="content-page">
              <h2>Chapter 3: Path to Federation</h2>
              <div className="placeholder-text">
                [Add content about the movement towards federation...]
              </div>
            </div>
          </Page>

          <Page number={6}>
            <div className="content-page">
              <h2>Birth of a Nation</h2>
              <p>
                On January 1, 1901, the six colonies federated to form the Commonwealth of Australia.
              </p>
              <div className="placeholder-text">
                [Add content about the birth of the Australian nation...]
              </div>
            </div>
          </Page>

          {/* Page 7-8 */}
          <Page number={7}>
            <div className="content-page">
              <h2>Chapter 4: Democracy Evolves</h2>
              <div className="placeholder-text">
                [Add content about the evolution of Australian democracy...]
              </div>
            </div>
          </Page>

          <Page number={8}>
            <div className="content-page">
              <h2>Modern Australia</h2>
              <div className="placeholder-text">
                [Add content about modern Australia and its democratic institutions...]
              </div>
            </div>
          </Page>

          {/* Back Cover */}
          <Page number={9}>
            <div className="back-cover">
              <div className="back-cover-content">
                <h3>Continue Your Journey</h3>
                <p>
                  This book is a work in progress. More chapters and content will be added as we
                  explore the fascinating history of how Australia developed into the democracy it is today.
                </p>
                <p className="back-note">
                  Add your own content to bring this historical narrative to life.
                </p>
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      <div className="book-controls">
        <button
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          disabled={currentPage === 0}
          className="control-btn"
        >
          ← Previous
        </button>
        <button
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          disabled={currentPage >= totalPages - 1}
          className="control-btn"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Book;
