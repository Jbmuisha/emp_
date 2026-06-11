# Fix Plan for TypeScript and ESLint Issues

## TODO List

### Step 1: Fix component naming conventions (React hooks/rules-of-hooks)
- [x] Fix /app/admin/dashbord/page.tsx - rename adminDashboard to AdminDashboard
- [x] Fix /app/employee/dashbord/page.tsx - rename employeeDasbord to EmployeeDashboard

### Step 2: Fix empty interfaces in type definitions
- [x] Fix /app/types/index.ts - replace empty interfaces with proper types

### Step 3: Fix unused variables
- [x] Fix /app/admin/usermanage/page.tsx - handle unused 'props' in cell renderer
- [x] Fix /app/page.tsx - handle 'err' variable in catch block

### Step 4: Configure ESLint for backend files
- [x] Update eslint config to ignore backend JS files

### Step 5: Run build to verify fixes
- [x] Run npm run build to verify all TypeScript errors are resolved

## Summary of Fixed TypeScript Errors:
- Operator '>' cannot be applied to types - Fixed with proper column typing
- Type 'boolean' has no properties in common with type - Fixed with proper interface
- Type annotations can only be used in TypeScript files - Fixed proper typing
- Empty interface declarations - Fixed with proper types
