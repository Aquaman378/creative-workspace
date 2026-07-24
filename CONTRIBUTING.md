# Contributing to Creative Workspace 🤝

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/creative-workspace.git
   cd creative-workspace
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   - See [SETUP.md](docs/SETUP.md) for detailed instructions

## Development Workflow

### Before you start coding

- Check existing issues and pull requests
- Create an issue if your contribution is significant
- Discuss major changes in the issue before starting work

### Code Style

- **JavaScript/Node.js**: Use ESLint (configured in project)
- **React Native**: Follow React best practices
- **Naming**: Use descriptive names for variables, functions, and files

### Commit Messages

Write clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: Add client proofing portal feedback submission"
git commit -m "fix: Resolve Firebase auth initialization error"
git commit -m "docs: Update API documentation for invoices"

# Bad
git commit -m "fix stuff"
git commit -m "update"
```

Use conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build process, dependencies

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR

```bash
# Backend
cd backend
npm test

# Mobile
cd mobile
npm test
```

### Linting

Fix linting issues before submitting:

```bash
npm run lint:fix
```

## Pull Request Process

1. **Update documentation** if needed
2. **Run tests and linting**
3. **Create descriptive PR title and description**
   - Reference related issues (#123)
   - Explain what and why
   - Include screenshots for UI changes

4. **PR title format**
   ```
   [AREA] Brief description
   
   Examples:
   [Backend] Add invoice payment webhook handling
   [Mobile] Implement client proofing gallery
   [Docs] Update database schema documentation
   ```

5. **Wait for review** - Maintainers will review and provide feedback

## Code Review Guidelines

When submitting code:
- Keep PRs focused and manageable
- Explain complex logic with comments
- Follow existing code patterns
- Update tests and documentation

When reviewing:
- Be respectful and constructive
- Ask questions for clarity
- Suggest improvements, don't demand
- Approve and merge when satisfied

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior vs actual behavior
- System info (OS, Node version, etc.)
- Error logs or screenshots

### Feature Requests

Include:
- Description of the feature
- Use case/problem it solves
- Proposed solution (if any)
- Alternative solutions

## Project Structure

Keep contributions organized:

```
backend/
├── src/
│   ├── routes/       # API endpoints
│   ├── controllers/  # Business logic
│   ├── services/     # External service integration
│   └── middleware/   # Express middleware
└── tests/

mobile/
├── src/
│   ├── screens/      # Screen components
│   ├── components/   # Reusable components
│   ├── services/     # API & Firebase services
│   └── redux/        # State management
└── tests/
```

## Useful Resources

- [React Native Docs](https://reactnative.dev)
- [Express.js Guide](https://expressjs.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)

## Questions?

Feel free to:
- Open an issue for questions
- Ask in pull request comments
- Check existing discussions

---

**Thank you for contributing!** 🎉
