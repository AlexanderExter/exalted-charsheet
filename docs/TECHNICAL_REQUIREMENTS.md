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
- **TypeScript**: 5.0+
- **React**: 19.1.0+
- **Next.js**: 15.4.3+ (full-stack framework)
- **shadcn/ui**: Component library with Radix UI primitives
- **Tailwind CSS**: 4.0+ (styling with CSS variables)
- **Lucide React**: 0.525.0+ (icons)

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
# Server starts on http://localhost:3000 (or next available port)
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Project Structure
```
exalted-charsheet/
├── app/
│   ├── layout.tsx                   # Next.js root layout
│   ├── page.tsx                     # Main page component
│   └── globals.css                  # Tailwind CSS with shadcn/ui variables
├── components/
│   ├── ExaltedCharacterManager.tsx  # Main V0-generated character manager
│   └── ui/                          # shadcn/ui component library
│       ├── button.tsx               # Button primitive
│       ├── card.tsx                 # Card layout components
│       ├── input.tsx                # Form input components
│       ├── select.tsx               # Select dropdown components
│       ├── tabs.tsx                 # Tab navigation components
│       └── ...                      # Additional UI primitives
├── hooks/
│   └── useLocalStorage.tsx          # Custom localStorage hook
├── lib/
│   └── utils.ts                     # Utility functions (cn helper)
├── components.json                  # shadcn/ui configuration
│   └── globals.css                  # Global styles & Tailwind imports
├── components/
│   └── ExaltedCharacterManager.tsx  # Main application component
├── hooks/
│   └── useLocalStorage.ts           # Custom localStorage hook
├── docs/                            # Documentation
├── out/                             # Static export build output
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── next.config.ts                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.mjs               # PostCSS configuration
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
- **Next.js**: Full-stack React framework with static export
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
1. **Port 3000 in use**: Next.js will automatically find next available port
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