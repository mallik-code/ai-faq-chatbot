## .NET Best Practices

### Style Guide
- **Microsoft C# Coding Conventions:** All C# code must adhere to the [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

### LINQ
- **Use LINQ:** Use Language-Integrated Query (LINQ) for querying collections. It provides a clean, declarative syntax.

### Asynchronous Programming
- **Async/Await:** Use `async` and `await` for all I/O-bound and other long-running operations to ensure the UI remains responsive and to improve scalability.

### Dependency Injection
- **Use Built-in DI:** Leverage the built-in dependency injection container in ASP.NET Core. Register services in `Startup.cs` or `Program.cs` and inject them into your classes.
