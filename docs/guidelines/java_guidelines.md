## Java Best Practices

### SOLID Principles
- All Java code must adhere to SOLID principles. See `design_principles.md` for details.

### Streams and Functional Programming
- **Prefer Streams:** Use the Stream API for processing collections. This often leads to more readable and declarative code than traditional loops.
- **Avoid Complex Lambdas:** Keep lambda expressions short and focused on a single task. If a lambda becomes complex, extract it into a private method.
- **Side Effects:** Avoid side effects within stream operations (e.g., modifying external state). Use collectors to produce a new result.

### `Optional` for Null Safety
- **Return `Optional`:** Methods that may not return a value must return an `Optional` instead of `null`. This makes the API contract explicit.
- **Avoid `.get()`:** Do not use `Optional.get()` without a prior `isPresent()` check. Prefer functional methods like `orElse()`, `orElseGet()`, `orElseThrow()`, or `ifPresent()`.

### Exception Handling
- **Specific Exceptions:** Catch specific, checked exceptions rather than a generic `Exception` or `Throwable`.
- **No Empty Catch Blocks:** Never leave a catch block empty. At a minimum, log the exception.
- **Custom Exceptions:** Create custom, unchecked exceptions for specific business rule violations to provide clear error context.
