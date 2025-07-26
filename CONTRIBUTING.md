# Contributing to Exalted: Essence Character Manager

Thank you for your interest in contributing to the Exalted: Essence Character Manager! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

- Use the GitHub Issues tab to report bugs
- Include steps to reproduce the issue
- Mention your browser and operating system
- Provide screenshots if helpful

### Suggesting Features

- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Reference game rules if applicable
- Consider implementation complexity

### Code Contributions

1. **Fork the Repository**

   ```bash
   git clone https://github.com/yourusername/exalted-character-manager.git
   cd exalted-character-manager
   npm install
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add comments for game rule implementations
   - Test thoroughly across different browsers

4. **Test Your Changes**

   ```bash
   npm run dev    # Test in development
   npm run build  # Ensure it builds
   ```

5. **Submit a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Include screenshots for UI changes

## 🎯 Development Guidelines

### Code Style

- Use functional React components with hooks
- Follow TypeScript best practices
- Use Tailwind CSS classes consistently
- Implement defensive programming (null checks, fallbacks)

### Game Rule Implementation

- Always reference official Exalted: Essence rules
- Comment complex calculations with rule references
- Maintain flexibility for house rules
- Follow game terminology exactly

### Testing

- Test character creation and management
- Verify all calculations are accurate
- Test import/export functionality
- Check mobile responsiveness
- Test with various data edge cases

### Documentation

- Update README.md for new features
- Document any breaking changes
- Include examples for complex features
- Update the complete documentation file

## 🎮 Understanding the Codebase

### Project Structure

```
src/
├── ExaltedCharacterManager.tsx  # Main component
├── main.tsx                     # App entry point
└── index.css                    # Styles

docs/
└── exalted-complete-documentation.md  # Comprehensive docs
```

### Key Components

- **Character Management**: Creation, switching, deletion
- **Tab System**: 8 different character aspects
- **Calculations**: Static values, dice pools, health
- **Data Persistence**: localStorage with migration
- **Import/Export**: JSON-based character sharing

### Game System Integration

The app implements Exalted: Essence mechanics:

- Attributes (Fortitude, Finesse, Force)
- 14 Abilities with specializations
- Essence rating and mote management
- Health levels with damage tracking
- Static values (Defense, Soak, etc.)
- Equipment with tags
- Social mechanics (Virtues, Intimacies)

## 🔄 Release Process

### Version Numbering

- **Major** (1.0.0): Breaking changes or major features
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.1.1): Bug fixes
- **Alpha/Beta**: Pre-release versions

### Current Roadmap

- v0.1.0-alpha: Initial release ✅
- v0.2.0: Additional Exalt types
- v0.3.0: Enhanced dice rolling
- v1.0.0: Stable release

## 💡 Feature Ideas

### High Priority

- Support for other Exalt types (Solar, Dragon-Blooded)
- Enhanced markdown support for descriptions
- Character comparison tools
- Advanced dice probability calculations

### Medium Priority

- Campaign management features
- Character templates and archetypes
- Export to PDF
- Dark mode theme

### Low Priority

- Multi-language support
- Cloud storage integration
- Collaborative character editing
- Mobile app version

## 🐛 Known Issues

Current limitations to be aware of:

- localStorage size constraints
- Basic markdown rendering
- Static combat step guidance
- Limited mobile optimization

## 📚 Resources

### Exalted: Essence

- [Official Rulebook](https://www.drivethrurpg.com/product/162759/Exalted-Essence)
- [Onyx Path Publishing](https://www.onyxpathpublishing.com/)
- [Exalted Wiki](https://exalted.fandom.com/)

### Development

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 🙏 Recognition

Contributors will be:

- Listed in the project README
- Credited in release notes
- Given appropriate GitHub recognition

## 📞 Getting Help

- **Issues**: Technical problems or bugs
- **Discussions**: Feature ideas and questions
- **Discord**: Join the Exalted community
- **Email**: [Project maintainer contact]

---

**Thank you for helping make this tool better for the Exalted community!** 🎲✨
