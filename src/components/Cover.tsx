import React from 'react';
import Page from './Page';
import coverImage from '../assets/cover.png';

const Cover: React.FC = () => {
  return (
    <Page number={0}>
      <div className="cover-page">
        <img src={coverImage} alt="Book Cover" className="cover-image" />
      </div>
    </Page>
  );
};

export default Cover;
