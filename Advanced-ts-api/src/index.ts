interface User {
  name: string;
  age: number;
  email:string;
  phone:string;
  LastName:string;
}

type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type Updatedprops = Pick<User, 'name' | 'age'>;

// Example usage
const partialUser: PartialUser = {
  name: "John"
  // other properties are optional
};

const readonlyUser: ReadonlyUser = {
  name: "Jane",
  age: 30,
  email: "jane@example.com",
  phone: "123-456-7890",
  LastName: "Doe"
};
// readonlyUser.name = "John"; // Error: Cannot assign to 'name' because it is a read-only property.

const updatedProps: Updatedprops = {
  name: "Alice",
  age: 25
  // only 'name' and 'age' are allowed
};
