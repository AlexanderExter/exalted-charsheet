# Contributing Guide

Thank you for your interest in improving the **Exalted: Essence Character Manager**! This guide outlines how to contribute, report issues, suggest features, and understand the codebase.

---

## 🐞 Reporting Issues

- Use the **GitHub Issues** tab for bug reports.
- Include clear steps to reproduce the problem.
- Specify your browser and operating system.
- Attach screenshots if they help illustrate the issue.

## 💡 Suggesting Features

- Open a new issue with the `enhancement` label.
- Clearly describe the feature and its benefits.
- Reference relevant game rules if applicable.
- Consider the complexity and possible impact on the app.

---

## 🛠️ Development Guidelines

### Code Style

- Use **functional React components** and hooks.
- Follow **TypeScript** best practices.
- Run `npm run type-check` to ensure the project passes strict type checking.
- Apply **Tailwind CSS** classes consistently.
- Write defensive code (null checks, fallbacks).

### Documentation

- Update `README.md` for new features.
- Document any breaking changes.
- Add examples for complex features.
- Keep all documentation up to date.

---

## 🧩 Codebase Overview

### Game System Integration

This app implements core **Exalted: Essence** mechanics, including:

- Attributes: Fortitude, Finesse, Force
- 14 Abilities (with specializations)
- Essence rating & mote management
- Health levels & damage tracking
- Static values (Defense, Soak, etc.)
- Equipment with tags
- Social mechanics (Virtues, Intimacies)

---

## 🚀 Release & Limitations

**Current limitations:**

- IndexedDB quota limits (browser-dependent)
- Basic markdown rendering (headers, paragraphs, lists)
- Mobile optimization ongoing

---

## 📚 Resources

### Exalted: Essence

- [Official Rulebook](https://www.drivethrurpg.com/product/162759/Exalted-Essence)
- [Onyx Path Publishing](https://www.onyxpathpublishing.com/)
- [Exalted Wiki](https://exalted.fandom.com/)

### Development

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Thank you for helping make this tool better for the Exalted community!** 🎲✨
