# Architecture Decisions

This document outlines the core technical decisions, system design models, and tradeoffs made while building the AI Native Collaborative Document Editor.

## Core Technology Decisions

### Why React Quill?
We chose **React Quill** for the rich text editing interface for the following reasons:
1. **Out-of-the-Box Functionality**: Quill provides robust, ready-to-use formatting tools (bold, italic, lists, headings) without requiring complex underlying state management.
2. **HTML Export**: It natively saves content as clean HTML strings, which drastically simplifies the persistence layer compared to complex JSON-based ASTs (Abstract Syntax Trees).
3. **Maturity**: Quill is a battle-tested library with predictable cross-browser behavior, ensuring high stability within a constrained development timeframe.

### Why MongoDB?
**MongoDB** (via MongoDB Atlas) was chosen as the database layer for:
1. **Document-Oriented Nature**: A text editor's data model maps perfectly to a NoSQL document database, allowing us to store dynamic, unstructured HTML strings effortlessly.
2. **Flexible Schema**: The flexible nature of MongoDB allows for rapid iteration of the `Document` schema (e.g., easily appending a `sharedWith` array) without needing time-consuming SQL migrations.
3. **Speed of Delivery**: Using Mongoose with MongoDB minimizes the friction between the Node.js backend and the database, accelerating the implementation of CRUD endpoints.

## System Design

### Sharing Model Design
The sharing architecture relies on explicit ownership and relationship arrays:
- **`owner` Field**: Every document has a strict 1:1 relationship with its creator (an `ObjectId` referencing the `User` schema).
- **`sharedWith` Field**: An array of user `ObjectId`s. 
- **Workflow**: When an owner shares a document via the UI, the API queries the target user by `username` and appends their `ObjectId` to the document's `sharedWith` array.
- **Authorization**: The API middleware performs a quick inclusion check against the `owner` or the `sharedWith` array before allowing read/write operations.

### File Upload Design
File uploads utilize a "Parse-and-Discard" model rather than permanent disk storage:
1. **Intake**: `multer` temporarily saves incoming `.txt` and `.md` uploads to the server's disk.
2. **Parsing**: The backend reads the file contents. If it is `.md`, the `marked` library converts it to HTML. If `.txt`, it is safely wrapped in standard HTML tags.
3. **Hydration**: The parsed HTML string is immediately hydrated into a new `Document` object and saved to the database.
4. **Cleanup**: The temporary file is immediately unlinked (deleted) from the server to prevent disk bloat and security vulnerabilities.

## Tradeoffs & Constraints

### Tradeoffs Due to Time Constraints
1. **Debounced Saves over WebSockets**: True real-time collaborative editing (where multiple users see live cursors and type simultaneously) requires complex Operational Transformation (OT) or CRDTs via WebSockets. Due to the strict time limit, we opted for a **"Last-Write-Wins"** model using a 1500ms debounced auto-save via standard HTTP PUT requests.
2. **User Identification**: We bypassed complex OAuth, passwords, and email-verification flows in favor of a fast, seeded "User Selector" approach to rapidly prove out the sharing mechanics without getting bogged down in boilerplate auth.

### Features Intentionally Skipped
- **Granular Permissions**: Skipped "Viewer" vs. "Commenter" vs. "Editor" roles. Any user in the `sharedWith` array is granted full write access.
- **Revision History**: Document versioning and rollback capabilities were omitted to keep the database schemas and auto-save logic lightweight.
- **Folder Organization**: Documents exist in a flat workspace hierarchy to reduce routing logic and database relationship complexity.
