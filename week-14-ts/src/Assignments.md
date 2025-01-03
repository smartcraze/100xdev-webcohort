Here's an assignment to help you solidify your understanding of TypeScript's types and interfaces:  

---

### Assignment: **Build a TypeScript-Based User Management System**

#### Requirements:
1. **Define Types and Interfaces:**
   - Create a `User` interface with the following properties:
     - `id`: a unique string.
     - `name`: a string.
     - `email`: a string.
     - `role`: a union type (`"admin" | "editor" | "viewer"`).
     - `isActive`: a boolean.
   - Create a `Product` type with the following properties:
     - `id`: a unique string.
     - `name`: a string.
     - `price`: a number.
     - `category`: a string.

2. **Functions Using Types and Interfaces:**
   - Create a function `createUser` that takes an object matching the `User` interface and returns the user.
   - Write a function `updateUser` that takes:
     - `userId`: a string.
     - `updatedFields`: a partial version of the `User` interface (use `Partial` utility type).
     - Returns the updated user.
   - Write a function `getUsersByRole` that takes a role (`"admin" | "editor" | "viewer"`) and returns an array of users with that role.

3. **TypeScript Advanced Features:**
   - Ensure the `role` property in `User` has a default value of `"viewer"` if not provided in the `createUser` function.
   - Add a readonly property `createdAt` (date) to the `User` interface that cannot be modified once the user is created.

4. **Test the System:**
   - Create an array of sample users and products.
   - Test each function with realistic data to ensure everything works as expected.

---

This assignment will give you practice with:
- Defining and using interfaces and types.
- Leveraging utility types like `Partial`.
- Working with union types and readonly properties.
- Writing reusable and type-safe functions.

Let me know when you're done or if you need help!