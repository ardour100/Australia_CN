# Project Overview - Australia History Interactive Book

## Quick Summary
This is an interactive digital book application showcasing "How an Ancient Land Became a Great Democracy: Australia History". Built with modern React, it features realistic page-turning animations using react-pageflip library.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.2.6
- **Key Library**: react-pageflip (for page-turning animations)
- **Styling**: Pure CSS with gradients and responsive design

## Project Structure
```
Australia_CN/
├── src/
│   ├── components/
│   │   ├── Book.tsx                   # Main book orchestrator (~300 lines)
│   │   ├── Book.css                   # Book styling with animations
│   │   ├── Page.tsx                   # Reusable page wrapper component
│   │   ├── Cover.tsx                  # Cover page component
│   │   ├── Preface.tsx                # Preface page component
│   │   ├── TableOfContents.tsx        # Table of contents component
│   │   ├── ChapterPage.tsx            # Individual chapter page component
│   │   ├── BackCover.tsx              # Back cover component
│   │   └── FloatingNavigation.tsx     # Navigation controls component
│   ├── data/
│   │   ├── chapters.json              # Book metadata and chapter index
│   │   └── chapters/
│   │       ├── chapter-01.json        # Chapter 1 content
│   │       ├── chapter-02.json        # Chapter 2 content
│   │       └── ... (chapter-18.json)  # All 18 chapters
│   ├── assets/
│   │   └── cover.png                  # Book cover image
│   ├── App.tsx                        # Root component (imports Book)
│   ├── App.css                        # Minimal app styles
│   ├── index.css                      # Global reset and base styles
│   └── main.tsx                       # React entry point
├── public/                            # Static assets
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── vite.config.ts                     # Vite configuration
├── README.md                          # User documentation
└── PROJECT_OVERVIEW.md                # This file (for AI/developer reference)
```

## Component Architecture

### 1. Book Component (`src/components/Book.tsx`)
**Purpose**: Main orchestrator that manages state and coordinates all sub-components

**Responsibilities**:
- State management (current page, navigation, font size, language)
- Import and map all 18 chapter JSON files
- Calculate total pages dynamically based on content
- Split chapter content into paginated sections
- Render HTMLFlipBook with all page components
- Handle keyboard navigation (arrow keys)

**State**:
- `currentPage`: Tracks current page (0-indexed)
- `goToPageInput`: Page number input value
- `isNavExpanded`: Navigation panel visibility
- `prefaceLanguage`: Selected language ('zh' | 'zhTraditional' | 'en')
- `fontSize`: Selected font size ('small' | 'medium' | 'large')

**Key Functions**:
- `splitContentIntoPages()`: Splits content into 3/5 paragraph chunks
- `calculateTotalPages()`: Dynamically computes total pages
- `getChapterPageIndex()`: Calculates actual page index for each chapter
- `renderChapterPages()`: Generates all chapter page components

**HTMLFlipBook Configuration**:
- Width: 715px (responsive: 330px min, 880px max)
- Height: 935px (responsive: 440px min, 1100px max)
- Portrait mode (single page view)
- Mobile scroll support enabled
- Shadow opacity: 0.5

### 2. Page Component (`src/components/Page.tsx`)
**Purpose**: Reusable wrapper for individual pages with page numbers

**Props**:
- `number`: Page number (0 = no number displayed)
- `children`: Page content

**Features**:
- Uses `forwardRef` for react-pageflip DOM manipulation
- Conditionally displays page numbers (only for content pages)
- Provides consistent page styling

### 3. Cover Component (`src/components/Cover.tsx`)
**Purpose**: Displays the book cover with custom image

**Features**:
- Imports cover image from assets
- Full-bleed cover display (no margins)
- Uses Page component with `number={0}`

### 4. Preface Component (`src/components/Preface.tsx`)
**Purpose**: Displays the preface/introduction

**Features**:
- Displays Chinese simplified preface by default
- Reads from `bookData.preface`
- Shows author signature
- Array validation for safe content rendering

### 5. TableOfContents Component (`src/components/TableOfContents.tsx`)
**Purpose**: Displays clickable table of contents with all 18 chapters

**Props**:
- `onChapterClick`: Handler for chapter navigation
- `getChapterPageIndex`: Function to calculate dynamic page numbers

**Features**:
- Shows English and Chinese (simplified/traditional) titles
- Displays dynamically calculated page numbers
- Click to navigate to specific chapters
- Grid layout with hover effects

### 6. ChapterPage Component (`src/components/ChapterPage.tsx`)
**Purpose**: Renders individual chapter pages with markdown support

**Props**:
- `chapterId`, `chapterTitle`, `chineseTitle`, `chineseTitleTraditional`
- `pageNumber`: Display page number
- `pageContent`: Array of paragraphs to display
- `isFirstPage`: Whether this is the first page of the chapter
- `placeholder`, `note`: Optional content

**Features**:
- Chapter header only on first page
- ReactMarkdown support for rich text
- Image rendering with custom dimensions
- Placeholder text for empty chapters

### 7. BackCover Component (`src/components/BackCover.tsx`)
**Purpose**: Displays the back cover with continuation message

**Features**:
- Reads from `bookData.backCover`
- Shows title, content paragraphs, and note
- Uses Page component with `number={0}`

### 8. FloatingNavigation Component (`src/components/FloatingNavigation.tsx`)
**Purpose**: Provides navigation controls (page counter, go-to-page, font size)

**Props**:
- `isExpanded`, `currentPage`, `totalPages`, `goToPageInput`, `fontSize`
- `onToggle`, `onGoToPage`, `onPageInputChange`, `onFontSizeChange`

**Features**:
- Collapsible navigation panel
- Current page display
- "Go to page" input with numeric validation
- Font size control (3 sizes)
- Usage instructions
- Australian theme colors (teal/cyan)

### Styling (`src/components/Book.css`)

**Design System**:
- **Background**: Purple gradient (from #667eea to #764ba2)
- **Page Color**: Cream (#fffef0) with subtle grid pattern
- **Cover/Back Cover**: Blue gradient (#1e3c72 to #2a5298)
- **Typography**: Georgia serif for content, system fonts for UI
- **Responsive**: Breakpoint at 768px for mobile

**Key Classes**:
- `.book-container`: Main wrapper with gradient background
- `.book-page`: Individual page styling with paper texture
- `.cover-page`: Front cover with centered title
- `.content-page`: Chapter content pages
- `.placeholder-text`: Dashed border boxes for content to be added
- `.page-note`: Yellow highlighted notes
- `.control-btn`: Navigation buttons with gradient

## Benefits of Component Architecture

### Modularity & Maintainability
- **Single Responsibility**: Each component has one clear purpose
- **Easy to Test**: Components can be tested in isolation
- **Code Reusability**: Page component used throughout the book
- **Clear Dependencies**: Props make data flow explicit

### Scalability
- **Easy to Add Features**: New components don't affect existing ones
- **Simple to Modify**: Changes to one component don't break others
- **Team-Friendly**: Multiple developers can work on different components
- **Type Safety**: TypeScript props ensure correct usage

### Developer Experience
- **Smaller Files**: Each component is ~20-70 lines instead of 500+ lines
- **Clear Structure**: Easy to find and modify specific features
- **Hot Module Replacement**: Faster development with targeted updates
- **Better IDE Support**: TypeScript autocomplete for all props

### Performance
- **Tree Shaking**: Unused components can be eliminated in builds
- **Code Splitting**: Potential for lazy loading components
- **Optimized Re-renders**: React can optimize component updates

## How to Extend

### Adding New Components
1. Create a new component file in `src/components/`
2. Import and use the `Page` component if needed
3. Define TypeScript props interface
4. Import and use in `Book.tsx`

Example:
```tsx
// src/components/Glossary.tsx
import React from 'react';
import Page from './Page';

const Glossary: React.FC = () => {
  return (
    <Page number={0}>
      <div className="content-page">
        <h2>Glossary</h2>
        <p>Your content...</p>
      </div>
    </Page>
  );
};

export default Glossary;
```

Then in `Book.tsx`:
```tsx
import Glossary from './Glossary';

// Inside HTMLFlipBook:
<Glossary />
```

### Adding New Content
- Replace `.placeholder-text` divs with actual content
- Each page has ~733px height, ~550px width
- Use `<p>` tags for paragraphs
- Use `<h2>` for chapter titles

### Styling Modifications
- **Colors**: Edit gradients in `.book-container`, `.cover-page`
- **Fonts**: Change font-family in `.page-content`
- **Page texture**: Modify background-image in `.book-page`
- **Button styles**: Update `.control-btn` class

## Development Commands

```bash
# Start dev server (already running on http://localhost:5173/)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Key Features Implemented

✅ Realistic page-turning physics
✅ Click and drag to flip pages
✅ Previous/Next button controls
✅ Page counter (shows "Page X of Y")
✅ Responsive design (mobile & desktop)
✅ Beautiful visual design with gradients
✅ Placeholder content structure for easy editing
✅ Smooth animations and transitions
✅ Touch support for mobile devices

## Content Status

**Complete Pages** (with content):
- Cover page
- Chapter 1: The Ancient Land (Page 1)
- Indigenous Governance (Page 2)
- Chapter 2: European Exploration (Page 3)
- The First Fleet (Page 4)
- Birth of a Nation (Page 6)
- Back cover

**Placeholder Pages** (need content):
- Path to Federation (Page 5)
- Democracy Evolves (Page 7)
- Modern Australia (Page 8)

## Notes for Future Development

1. **Content Expansion**: Pages 5, 7, 8 have placeholder content marked with `[Add content about...]`
2. **Images**: Can add images to pages using `<img>` tags within `.content-page`
3. **Page Count**: Easy to expand beyond 10 pages - just add more `<Page>` components
4. **Animations**: Can customize page-flip animation speed/style in HTMLFlipBook props
5. **Accessibility**: Consider adding keyboard navigation (arrow keys for page turns)
6. **SEO**: Add proper meta tags in index.html for better search visibility

## Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-pageflip": "^2.0.3"
}
```

## Browser Compatibility
- Modern browsers with ES6+ support
- Mobile Safari, Chrome, Firefox
- Requires CSS Grid, Flexbox support
- Touch events for mobile page turning

## Current State
- ✅ Development server running on port 5173
- ✅ No build errors
- ✅ Ready for content addition
- ✅ Fully functional page-turning interface

---

**Last Updated**: 2025-12-07
**Status**: Refactored with modular component architecture
**Recent Changes**:
- Split Book.tsx into 8 smaller, focused components
- Improved code maintainability and scalability
- Better TypeScript type safety with explicit props
- Easier to test and extend individual features

**Next Steps**:
- Add content to remaining chapters (3-18)
- Consider adding search functionality
- Potential for language toggle in navigation (instead of just preface)
