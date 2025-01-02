interface User {
  name: string;
  lastName: string;
  age: number;
  isLegal: boolean;
}
function greet(user: User) {
  console.log(user);
}

let user = {
  name: "suraj",
  lastName: "Vishwkarma",
  age: 20,
  isLegal: true,
};
greet(user);
