# Australia History - Interactive Book

An interactive digital book showcasing Australia's history from ancient times to modern democracy, built with modern front-end technologies.

## Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **react-pageflip** - Realistic page-turning animations

## Features

- Realistic page-turning animation with physics
- Responsive design that works on desktop and mobile
- Beautiful gradient backgrounds and typography
- Interactive navigation controls
- Page counter showing current progress

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173/` to see the application.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Book.tsx      # Main book component with page-flip functionality
│   └── Book.css      # Book styling and animations
├── App.tsx           # Main application component
├── App.css           # App-level styles
├── index.css         # Global styles
└── main.tsx          # Application entry point
```

## Adding Content

The book currently has placeholder content. To add your own historical content:

1. Open `src/components/Book.tsx`
2. Find the `<Page>` components inside the `<HTMLFlipBook>` wrapper
3. Replace the placeholder text in the `.placeholder-text` divs with your own content
4. Add more pages by creating additional `<Page number={X}>` components

### Example: Adding a New Page

```tsx
<Page number={10}>
  <div className="content-page">
    <h2>Chapter Title</h2>
    <p>
      Your content here...
    </p>
  </div>
</Page>
```

Don't forget to update the `totalPages` state variable when adding or removing pages.

## Customization

### Changing Book Dimensions

Edit the `HTMLFlipBook` props in `Book.tsx`:

```tsx
<HTMLFlipBook
  width={550}        // Page width
  height={733}       // Page height
  minWidth={315}     // Minimum width (responsive)
  maxWidth={1000}    // Maximum width
  // ... other props
>
```

### Styling

- **Book pages**: Edit `src/components/Book.css` - `.book-page` class
- **Cover design**: Edit `.cover-page` class
- **Background**: Edit `.book-container` gradient
- **Typography**: Modify font families in `.page-content`

## Browser Support

Works on all modern browsers that support:
- CSS Grid and Flexbox
- ES6+ JavaScript
- CSS Custom Properties

## License

MIT

## Contributing

Feel free to add more content about Australia's fascinating history!
