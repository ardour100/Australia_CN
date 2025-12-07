import React from 'react';
import ReactMarkdown from 'react-markdown';
import Page from './Page';

interface ChapterPageProps {
  chapterId: number;
  chapterTitle: string;
  chineseTitle: string;
  chineseTitleTraditional: string;
  pageNumber: number;
  pageContent: string[];
  isFirstPage: boolean;
  placeholder?: string;
  note?: string;
}

const ChapterPage: React.FC<ChapterPageProps> = ({
  chapterId,
  chapterTitle,
  chineseTitle,
  chineseTitleTraditional,
  pageNumber,
  pageContent,
  isFirstPage,
  placeholder,
  note,
}) => {
  return (
    <Page number={pageNumber}>
      <div className="content-page">
        {isFirstPage && (
          <div className="chapter-header">
            <div className="chapter-number">Chapter {chapterId}</div>
            <h2>{chapterTitle}</h2>
            <div className="chapter-title-cn">{chineseTitle} / {chineseTitleTraditional}</div>
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
          placeholder && (
            <div className="placeholder-text">{placeholder}</div>
          )
        )}

        {isFirstPage && note && (
          <div className="page-note">
            <strong>Note:</strong> {note}
          </div>
        )}
      </div>
    </Page>
  );
};

export default ChapterPage;
