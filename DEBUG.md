# Debug Guide for Next.js Application

This guide explains how to debug your Next.js application with the authentication middleware system.

## 🚀 Quick Start

### 1. Start Debug Mode

```bash
# Option 1: Using VS Code Debug Panel
# Press F5 or go to Run and Debug panel, select a configuration

# Option 2: Using npm scripts
npm run dev:debug          # Debug server-side
npm run dev:debug-brk      # Debug with breakpoint on start
npm run dev:debug-api      # Debug with API logging enabled
```

### 2. Set Breakpoints

- **Server-side**: Set breakpoints in API routes, middleware, or server components
- **Client-side**: Set breakpoints in React components (requires Chrome debugger)

## 🔧 Debug Configurations

### VS Code Debug Configurations

1. **Next.js: debug server-side**

   - Debugs server-side code (API routes, middleware)
   - Port: 9229 (Node.js inspector)
   - Best for: API route debugging, authentication middleware

2. **Next.js: debug client-side**

   - Debugs client-side React code
   - Opens Chrome with debugging enabled
   - Best for: Component debugging, state management

3. **Next.js: debug full stack**

   - Debugs both server and client
   - Includes output capture
   - Best for: Full application debugging

4. **Debug API Routes**

   - Specialized for API route debugging
   - Enables debug logging
   - Best for: Authentication, database operations

5. **Debug with Environment Variables**
   - Loads environment variables from `.env.local`
   - Best for: Testing with specific configurations

## 📝 Debug Scripts

```bash
# Development with debugging
npm run dev:debug          # Start with Node.js inspector
npm run dev:debug-brk      # Start with breakpoint on first line
npm run dev:debug-api      # Start with API debugging enabled

# Production debugging
npm run start:debug        # Debug production build

# Utility scripts
npm run lint:fix           # Fix linting issues
npm run type-check         # Check TypeScript types
```

## 🐛 Debugging Authentication Middleware

### Enable Debug Logging

Set environment variables to enable specific debug logging:

```bash
# Enable all debug logging
DEBUG=1 npm run dev

# Enable specific debug logging
DEBUG_AUTH=1 npm run dev          # Authentication debugging
DEBUG_API=1 npm run dev           # API route debugging
DEBUG_MIDDLEWARE=1 npm run dev    # Middleware debugging
DEBUG_DB=1 npm run dev            # Database debugging
```

### Debug Authentication Flow

1. **Set breakpoints** in authentication middleware:

   ```typescript
   // lib/middleware/auth.ts
   export function authenticate(request: NextRequest) {
     const token = extractToken(request); // <- Set breakpoint here
     const user = verifyToken(token); // <- Set breakpoint here
     // ...
   }
   ```

2. **Use debug logging**:

   ```typescript
   import { AuthDebugger } from "@/lib/middleware/debug";

   // Log authentication attempts
   AuthDebugger.logAuthAttempt(request, true);
   AuthDebugger.logTokenExtraction(request, true, token.length);
   AuthDebugger.logTokenVerification(true, user.id, user.role);
   ```

### Common Debug Scenarios

#### 1. Debug JWT Token Issues

```typescript
// In your API route
import { AuthDebugger } from "@/lib/middleware/debug";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  AuthDebugger.logTokenExtraction(request, !!authHeader);

  // Your code here...
}
```

#### 2. Debug Role-Based Access

```typescript
// In middleware
import { AuthDebugger } from "@/lib/middleware/debug";

if (requiredRole) {
  const user = authResult.user!;
  const allowed =
    user.role === requiredRole ||
    (requiredRole === "instructor" && user.role === "admin");

  AuthDebugger.logRoleCheck(requiredRole, user.role, allowed);
}
```

#### 3. Debug API Route Performance

```typescript
import { withDebugLogging } from "@/lib/middleware/debug";

const debugHandler = withDebugLogging(async (request: NextRequest) => {
  // Your API logic here
}, "API Route Handler");

export const GET = debugHandler;
```

## 🔍 Debugging Tools

### 1. VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint"
  ]
}
```

### 2. Browser DevTools

- **Network Tab**: Monitor API requests and responses
- **Console**: View client-side logs and errors
- **Sources Tab**: Set breakpoints in client-side code
- **Application Tab**: Inspect localStorage, sessionStorage

### 3. Node.js Inspector

Access the Node.js inspector at: `http://localhost:9229`

- **Sources**: Set breakpoints in server-side code
- **Console**: Execute server-side code
- **Memory**: Monitor memory usage
- **Profiler**: Analyze performance

## 📊 Debug Logging

### Log Levels

The debug system supports multiple log levels:

```typescript
import { logger } from "./debug.config";

logger.error("Error message"); // Red
logger.warn("Warning message"); // Yellow
logger.info("Info message"); // Cyan
logger.success("Success message"); // Green
logger.debug("Debug message"); // Magenta
```

### Specialized Loggers

```typescript
import { logger } from "./debug.config";

// API route logging
logger.api("API request received", { method: "GET", path: "/api/users" });

// Authentication logging
logger.auth("User authenticated", { userId: 123, role: "admin" });

// Middleware logging
logger.middleware("Middleware executed", { action: "auth_check" });

// Database logging
logger.db("Query executed", { query: "SELECT * FROM users", duration: "45ms" });
```

## 🚨 Common Issues & Solutions

### 1. Breakpoints Not Working

**Problem**: Breakpoints are not being hit in VS Code

**Solutions**:

- Ensure you're using the correct debug configuration
- Check that the file is saved
- Verify the debugger is attached to the correct process
- Try restarting the debug session

### 2. Source Maps Not Loading

**Problem**: Source maps are not loading correctly

**Solutions**:

- Check `next.config.mjs` has `devtool: 'eval-source-map'`
- Clear `.next` folder and restart
- Ensure TypeScript compilation is working

### 3. Environment Variables Not Loading

**Problem**: Environment variables are undefined

**Solutions**:

- Create `.env.local` file with your variables
- Use the "Debug with Environment Variables" configuration
- Check variable names match exactly

### 4. Database Connection Issues

**Problem**: Database connection fails in debug mode

**Solutions**:

- Check `DATABASE_URL` in environment variables
- Ensure database server is running
- Verify connection string format
- Check firewall settings

### 5. JWT Token Issues

**Problem**: JWT tokens are not being verified correctly

**Solutions**:

- Check `JWT_SECRET` environment variable
- Verify token format in Authorization header
- Check token expiration
- Use debug logging to trace token flow

## 📈 Performance Debugging

### 1. API Route Performance

```typescript
import { AuthDebugger } from "@/lib/middleware/debug";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Your API logic here

  const endTime = Date.now();
  AuthDebugger.logPerformance("API Route", startTime, endTime);
}
```

### 2. Database Query Performance

```typescript
import { logger } from "./debug.config";

const startTime = Date.now();
const result = await pool.query("SELECT * FROM users");
const endTime = Date.now();

logger.db(`Query executed in ${endTime - startTime}ms`);
```

### 3. Memory Usage

Monitor memory usage in Node.js inspector:

- Go to Memory tab
- Take heap snapshots
- Compare snapshots to find memory leaks

## 🔧 Advanced Debugging

### 1. Custom Debug Configurations

Create custom debug configurations in `.vscode/launch.json`:

```json
{
  "name": "Custom Debug Config",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
  "args": ["dev"],
  "env": {
    "NODE_OPTIONS": "--inspect",
    "DEBUG": "1",
    "CUSTOM_VAR": "value"
  }
}
```

### 2. Conditional Breakpoints

Set conditional breakpoints in VS Code:

1. Right-click on breakpoint
2. Select "Edit Breakpoint"
3. Add condition: `userId === 123`

### 3. Logpoints

Use logpoints instead of console.log:

1. Right-click on line
2. Select "Add Logpoint"
3. Enter: `User ID: {userId}, Role: {userRole}`

## 📚 Additional Resources

- [Next.js Debugging Documentation](https://nextjs.org/docs/advanced-features/debugging)
- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Use debug logging to trace the issue
3. Check environment variables
4. Verify database connections
5. Review the authentication flow logs

For persistent issues, check:

- VS Code output panel
- Browser console
- Node.js inspector console
- Network tab in browser devtools
