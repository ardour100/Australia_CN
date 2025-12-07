import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import bookData from '../data/chapters.json';
import './Book.css';

// Import components
import Page from './Page';
import Cover from './Cover';
import Preface from './Preface';
import TableOfContents from './TableOfContents';
import ChapterPage from './ChapterPage';
import BackCover from './BackCover';
import FloatingNavigation from './FloatingNavigation';

// Import chapter files
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

const Book: React.FC = () => {
  // Detect mobile device
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(!isMobile()); // Collapsed on mobile by default
  const [prefaceLanguage] = useState<'zh' | 'zhTraditional' | 'en'>('zh');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Split chapter content into pages
  const splitContentIntoPages = (content: string[], firstPageParagraphs: number = 3, otherPageParagraphs: number = 5) => {
    const pages: string[][] = [];

    if (content.length === 0) {
      return [[]];
    }

    pages.push(content.slice(0, firstPageParagraphs));

    for (let i = firstPageParagraphs; i < content.length; i += otherPageParagraphs) {
      pages.push(content.slice(i, i + otherPageParagraphs));
    }

    return pages;
  };

  // Calculate total pages dynamically
  const calculateTotalPages = () => {
    let pageCount = 4; // cover + blank + preface + catalog

    bookData.chapters.forEach((chapter: any) => {
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
        pageCount += 1;
      }
    });

    pageCount += 1; // back cover
    return pageCount;
  };

  const totalPages = calculateTotalPages();

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  // Calculate the actual page index for each chapter
  const getChapterPageIndex = (chapterIndex: number) => {
    let pageIndex = 4; // Start after cover + blank + preface + catalog

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
        pageIndex += 1;
      }
    }

    return pageIndex;
  };

  const handleChapterClick = (chapterIndex: number) => {
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
    if (value === '' || /^\d+$/.test(value)) {
      setGoToPageInput(value);
    }
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  // Keyboard arrow key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (currentPage > 0) {
          bookRef.current?.pageFlip().flipPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (currentPage < totalPages - 1) {
          bookRef.current?.pageFlip().flipNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Render chapter pages
  const renderChapterPages = () => {
    let currentPageNumber = 1;
    const pages: React.ReactElement[] = [];

    bookData.chapters.forEach((chapter: any) => {
      const fullChapter = chapterContents[chapter.id];

      let content: string[] = [];
      if (prefaceLanguage === 'zh' && fullChapter?.contentZh) {
        content = fullChapter.contentZh;
      } else if (prefaceLanguage === 'zhTraditional' && fullChapter?.contentZhTraditional) {
        content = fullChapter.contentZhTraditional;
      } else if (prefaceLanguage === 'en' && fullChapter?.content) {
        content = fullChapter.content;
      }

      const contentPages = content && content.length > 0 ? splitContentIntoPages(content) : [[]];

      contentPages.forEach((pageContent: string[], pageIndex: number) => {
        const isFirstPage = pageIndex === 0;

        pages.push(
          <ChapterPage
            key={`${chapter.id}-${pageIndex}`}
            chapterId={chapter.id}
            chapterTitle={chapter.title}
            chineseTitle={chapter.chineseTitle}
            chineseTitleTraditional={chapter.chineseTitleTraditional}
            pageNumber={currentPageNumber}
            pageContent={pageContent}
            isFirstPage={isFirstPage}
            placeholder={fullChapter?.placeholder}
            note={fullChapter?.note}
          />
        );

        currentPageNumber++;
      });
    });

    return pages;
  };

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
          <Cover />

          <Page number={0}>
            <div className="blank-page"></div>
          </Page>

          <Preface />

          <TableOfContents
            onChapterClick={handleChapterClick}
            getChapterPageIndex={getChapterPageIndex}
          />

          {renderChapterPages()}

          <BackCover />
        </HTMLFlipBook>
      </div>

      <FloatingNavigation
        isExpanded={isNavExpanded}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPageInput={goToPageInput}
        fontSize={fontSize}
        onToggle={toggleNav}
        onGoToPage={handleGoToPage}
        onPageInputChange={handlePageInputChange}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
};

export default Book;
