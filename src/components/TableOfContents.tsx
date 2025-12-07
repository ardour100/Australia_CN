import React from 'react';
import Page from './Page';
import bookData from '../data/chapters.json';

interface TableOfContentsProps {
  onChapterClick: (chapterIndex: number) => void;
  getChapterPageIndex: (chapterIndex: number) => number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ onChapterClick, getChapterPageIndex }) => {
  return (
    <Page number={0}>
      <div className="catalog-page">
        <h2 className="catalog-title">Table of Contents<br/>目录 / 目錄</h2>
        <div className="catalog-list">
          {bookData.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="catalog-item"
              onClick={() => onChapterClick(index)}
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
  );
};

export default TableOfContents;
