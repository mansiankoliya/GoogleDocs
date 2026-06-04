# AI Workflow Documentation

This document outlines how Artificial Intelligence tools were utilized during the development of the AI Native Collaborative Document Editor. It highlights the synergy between human architectural decisions and AI-assisted execution.

## 1. AI Tools Used

- **Gemini 3.1 Pro**: Utilized as the core reasoning engine for architecture planning, code generation, and troubleshooting.
- **Antigravity IDE**: Provided the agentic coding environment, enabling the AI to interact directly with the local file system, run bash commands, install dependencies, and execute scaffolding tasks autonomously.

## 2. How AI Accelerated Development

- **Rapid Scaffolding**: AI tools were able to instantly bootstrap the React Vite frontend and Express backend, automatically installing and configuring dependencies like TailwindCSS, Mongoose, and Multer.
- **Boilerplate Reduction**: The AI generated repetitive boilerplate code—such as standard CRUD REST APIs, Mongoose schemas with validation, and React custom hooks—in seconds, allowing development to focus on core business logic.
- **Contextual Refactoring**: When transitioning the backend to a strict MVC architecture and the frontend to use custom hooks (`useAuth`, `useDocuments`), the AI seamlessly refactored the entire codebase while maintaining existing functionality.

## 3. AI Generated Outputs That Were Modified

While the AI generated a vast majority of the functional code, several outputs required manual oversight and strategic modification:
- **Rich Text Editor Selection**: The AI initially proposed `TipTap` due to its headless nature. I explicitly instructed a pivot to `React Quill` to prioritize out-of-the-box UI elements and HTML serialization, which better suited the project's strict time constraints.
- **Auth Flow Simplification**: The AI generated standard username/password forms for JWT auth. I modified the architectural approach to use a quick "User Selector" component on the frontend to speed up testing and evaluation of the sharing mechanics.
- **Dependency Alignments**: Commanded the AI to utilize specific flags (e.g., `--legacy-peer-deps`) when integrating robust, older packages like `react-quill` with the cutting-edge React 19 environment.

## 4. Engineering Decisions Made by Me

The AI acted as a pair programmer, but the core architectural decisions remained human-driven:
- **Strict MVC Enforcement**: I mandated the strict separation of concerns (Models, React UI, Controllers, Routes, Middleware) to ensure the backend remained scalable, clean, and production-ready.
- **File Parsing Strategy**: I designed the "Parse-and-Discard" flow for file uploads, ensuring that `.md` and `.txt` files were temporarily streamed, parsed into HTML, hydrated into MongoDB documents, and immediately deleted from disk to prevent storage bloat.
- **Debounce over WebSockets**: I made the conscious tradeoff to rely on debounced API calls for autosaving rather than implementing complex CRDTs/WebSockets, recognizing the realistic 4-6 hour time constraint of the assignment.

## 5. How I Verified Correctness

- **Code Review**: Systematically reviewed all AI-generated code against the project requirements, specifically checking for robust validation and error handling in the Mongoose schemas and Express middleware.
- **Manual End-to-End Testing**: Navigated the complete user journey—logging in as Mansi, creating a document, writing formatted text, uploading a markdown file, sharing a document with Rahul, logging out, and verifying Rahul's access to the shared document.
- **Error Simulation**: Manually tested edge cases, such as attempting to access unauthorized documents and uploading invalid file types, to ensure the global error handler caught and formatted the responses correctly.

## 6. Testing Approach

- **Automated Testing**: Utilized `Jest` and `Supertest` to write an automated test suite (`document.test.js`) validating the core backend functionality (e.g., successful document creation and database mock isolation).
- **Iterative UI Testing**: Used the Vite development server to iteratively verify Tailwind CSS responsiveness and React Quill rendering across different screen sizes.
