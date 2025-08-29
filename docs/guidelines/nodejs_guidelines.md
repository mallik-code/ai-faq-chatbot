## Node.js and TypeScript/React Best Practices

### General Node.js
- **Asynchronous Operations:** Embrace the asynchronous nature of Node.js. Use `async/await` for all I/O operations to avoid blocking the event loop.
- **Error Handling:** Use `try...catch` blocks for handling errors in asynchronous code.
- **Dependency Management:** Use `npm` or `yarn` for package management. Keep `package.json` and `package-lock.json` in source control.

### TypeScript/React

#### Component Design
- **Functional Components and Hooks:** All new components must be functional components using Hooks. Class components are considered legacy.
- **Component Size:** Keep components small and focused on a single responsibility. If a component becomes too large, break it down into smaller, reusable components.
- **Props:** Use TypeScript interfaces or types to define component props for strong typing.

#### State Management
- **Local State:** Use the `useState` hook for simple, local component state.
- **Shared State:** For state shared between multiple components, use React Context with the `useContext` hook for simple cases. For more complex, application-wide state, a dedicated library like Zustand or Redux may be considered (as per `architecture.md`).

#### Immutability
- **Never Mutate State Directly:** Treat state and props as immutable. When updating state based on a previous value, use the functional update form of the state setter (e.g., `setCount(c => c + 1)`).
- **Arrays and Objects:** Use non-mutating array methods (`map`, `filter`, `reduce`) and object spread syntax (`{...obj}`) to create new objects and arrays when updating state.
