# AttendX AI — Git Commit Conventions & Workflow

## 1. Commit Message Format

Commit messages must follow the Conventional Commits specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Allowed Types:
- `feat`: A new user-facing feature.
- `fix`: A bug fix or error correction.
- `docs`: Documentation updates only.
- `style`: Code style changes (formatting, spacing) without functional impact.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Performance optimizations.
- `test`: Adding or updating test cases.
- `chore`: Maintenance tasks, dependency updates, or build configuration.

### Examples:
```bash
feat(attendance): add duplicate session prevention and CSV export endpoint
fix(biometrics): resolve camera liveness check retry loop on low lighting
docs(architecture): update folder structure and API schema documentation
refactor(common): extract reusable Modal and DataTable components
```

---

## 2. Branch Naming Strategy

- `main`: Production-ready releases.
- `develop`: Integration branch for feature development.
- `feature/<short-description>`: New feature implementation.
- `fix/<issue-description>`: Targeted bug fix.

---

## 3. Pull Request Checklist

Before submitting a Pull Request (PR):
- [ ] Code passes `npm run lint` with 0 type errors.
- [ ] Code passes `npm run build` without bundling warnings.
- [ ] Responsive design verified across desktop and mobile screen widths.
- [ ] No hardcoded secrets or API keys committed.
