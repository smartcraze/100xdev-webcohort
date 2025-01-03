interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
}

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

const userdetails: User[] = [];
const productdetail: Product[] = [];

function createUser(user: User): User {
  userdetails.push(user);
  return user;
}

function updateUser(userId: string, updatedFields: Partial<User>): User | null {
  const userIndex = userdetails.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    console.error("User not found.");
    return null;
  }
  userdetails[userIndex] = { ...userdetails[userIndex], ...updatedFields };
  return userdetails[userIndex];
}

function createProduct(product: Product): Product {
  productdetail.push(product);
  return product;
}

const user1: User = createUser({
  id: "1",
  name: "suraj",
  email: "surajv@gmail.com",
  role: "admin",
  isActive: false,
});

console.log("Created User:", user1);

const updatedUser = updateUser("1", { isActive: true });
console.log("Updated User:", updatedUser);

const product1: Product = createProduct({
  id: "101",
  name: "Laptop",
  price: 1000,
  category: "Electronics",
});

console.log("Created Product:", product1);
console.log("All Users:", userdetails);
console.log("All Products:", productdetail);
