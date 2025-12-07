import React, { forwardRef } from 'react';

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

export default Page;
