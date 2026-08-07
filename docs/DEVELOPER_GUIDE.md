# AttendX AI — Developer Guide & Standards

## 1. Local Environment Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/attendx/attendx-ai.git
   cd attendx-ai
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   *Note: Server boots on port 3000.*

5. Run linting & type verification:
   ```bash
   npm run lint
   ```

6. Run build verification:
   ```bash
   npm run build
   ```

---

## 2. Coding Standards & Conventions

### A. TypeScript Discipline
- **Strict Mode**: `strict` TypeScript is enabled. Never use `any` unless explicitly required for external library bridging.
- **Named Exports**: Prefer named exports for components, services, and hooks.
- **Interface Naming**: Always prefix interfaces with descriptive nouns (`User`, `ActiveSession`, `APIResponse`).

### B. Styling Standards
- Use Tailwind CSS utility classes exclusively.
- Color system: Dark mode defaults to `slate-950` canvas, light mode defaults to `slate-50`.
- Use Lucide icons (`lucide-react`) for all visual icons.
- Use `motion` from `motion/react` for smooth transitions.

### C. State Management Guidelines
- Context API for global application state (Auth, Theme, Toast).
- Local React state (`useState`) for component-specific visual states.
- Custom hooks (`/src/hooks/`) for encapsulates business logic.

---

## 3. Verification & Testing

- Run `npm run lint` before committing code to ensure zero TypeScript errors.
- Run `npm run test` for Vitest suite execution.
