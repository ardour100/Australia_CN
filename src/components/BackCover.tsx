import React from 'react';
import Page from './Page';
import bookData from '../data/chapters.json';

const BackCover: React.FC = () => {
  return (
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
  );
};

export default BackCover;
