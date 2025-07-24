# Technical Requirements and Implementation Guide

## System Requirements

### Runtime Environment
- **Node.js**: 16.0+ (recommended: 18.0+)
- **npm**: 7.0+ (or yarn 1.22+)
- **Browser**: Modern browsers with localStorage support
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

### Development Environment
- **TypeScript**: 5.2.2+
- **React**: 18.2.0+
- **Vite**: 4.5.0+ (build tool)
- **Tailwind CSS**: 3.3.5+ (styling)

## Installation & Setup

### Development Setup
```bash
# Clone repository
git clone https://github.com/AlexanderExter/exalted-charsheet.git
cd exalted-charsheet

# Install dependencies
npm install

# Start development server
npm run dev
# Server starts on http://localhost:3001 (or next available port)
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Serve built files (optional)
npm run serve
```

### Project Structure
```
exalted-charsheet/
├── src/
│   ├── ExaltedCharacterManager.tsx  # Main application component
│   ├── main.tsx                     # React app entry point
│   └── index.css                    # Global styles & Tailwind imports
├── docs/                            # Documentation
├── dist/                            # Production build output
├── public/                          # Static assets (if any)
├── index.html                       # Main HTML template
├── standalone.html                  # Self-contained demo version
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## Architecture Overview

### Component Architecture
- **Monolithic Component**: Single `ExaltedCharacterManager.tsx` component
- **State Management**: React useState hooks for local state
- **Data Persistence**: Browser localStorage
- **No External API**: Fully client-side application

### Key Technical Decisions
- **Single Component Design**: Simplified maintenance for hobby project
- **TypeScript**: Type safety and better development experience  
- **Tailwind CSS**: Utility-first styling for rapid development
- **Vite**: Fast development server and optimized builds
- **localStorage**: Simple persistence without server requirements

### Data Flow
1. **Character Creation**: Creates new character objects with default values
2. **State Updates**: React setState triggers re-renders and auto-saves
3. **Local Storage**: All changes automatically saved to browser storage
4. **Import/Export**: JSON serialization for data portability

## Performance Considerations

### Bundle Size
- **Main Bundle**: ~200KB (uncompressed)
- **Vendor Dependencies**: React, React-DOM, Lucide Icons
- **CSS**: Tailwind CSS (purged, ~20KB)

### Runtime Performance
- **Single Component**: No prop drilling or context complexity
- **Local State**: Fast updates with React useState
- **localStorage**: Synchronous storage operations
- **Calculations**: Real-time static value computations

## Browser Support

### Minimum Requirements
- **localStorage Support**: Essential for data persistence
- **ES6+ Support**: Modern JavaScript features
- **CSS Grid/Flexbox**: For responsive layout
- **JSON Support**: For import/export functionality

### Tested Browsers
- ✅ Chrome 120+ (Windows/Mac/Linux)
- ✅ Firefox 119+ (Windows/Mac/Linux)
- ✅ Safari 17+ (Mac/iOS)
- ✅ Edge 120+ (Windows)

## Security Considerations

### Data Privacy
- **Local Storage Only**: No data sent to external servers
- **No Analytics**: No tracking or telemetry
- **Client-Side Only**: All processing happens in browser
- **JSON Export**: Plain text format, no encryption

### Input Validation
- **Numeric Constraints**: Min/max values enforced
- **Text Fields**: Basic XSS prevention through React
- **File Uploads**: JSON validation on import

## Deployment Options

### Static Hosting
- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Drag-and-drop deployment
- **Vercel**: Git-based deployment
- **Any Static Host**: Works with any web server

### Self-Hosting
- **Single File**: `standalone.html` contains everything
- **File Server**: Can be served from any directory
- **No Backend**: No server-side requirements

## Troubleshooting

### Common Issues
1. **Port 3001 in use**: Vite will automatically find next available port
2. **localStorage Full**: Browser storage limit (~5-10MB)
3. **Import Errors**: Ensure JSON files are valid character exports
4. **Build Failures**: Check Node.js version (16+ required)

### Debug Mode
```bash
# Run with debug info
npm run dev -- --host --port 3001

# Check bundle analysis
npm run build -- --analyze
```

## Future Technical Considerations

### Potential Improvements
- **Component Splitting**: Break down large component for maintainability
- **State Management**: Consider React Context or Redux for complex state
- **Testing**: Add unit tests for calculations and critical paths
- **PWA**: Progressive Web App features for offline use
- **Database**: Optional server-side storage for sharing characters

### Scaling Considerations
- **Multi-user**: Would require backend and authentication
- **Real-time**: WebSocket for shared sessions
- **Mobile App**: React Native port potential
- **Desktop**: Electron wrapper possibility