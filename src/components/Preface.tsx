import React from 'react';
import Page from './Page';
import bookData from '../data/chapters.json';

const Preface: React.FC = () => {
  // Note: Language is handled in the parent Book component
  // This component displays Chinese (simplified) preface by default
  const prefaceLanguage = 'zh';

  return (
    <Page number={0}>
      <div className="content-page preface-page">
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
  );
};

export default Preface;
