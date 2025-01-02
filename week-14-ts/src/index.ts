let x: number = 1;
console.log(x);
// let y = 2 working cause type inferering

function greet1(name: string) {
  console.log("Hello " + name);
}

greet1("suraj");

function sum(a: number, b: number) {
  return a + b;
}
console.log(sum(3, 6));

function islegal(age: number): boolean {
  if (age > 18) return true;
  else return false;
}
let age: boolean = islegal(19);
console.log(age);

function delayedcall(fn: () => void) {
  setTimeout(fn, 1000);
}

delayedcall(() => {
  console.log("Hey this is suraj vishwakarma called after one second");
});
