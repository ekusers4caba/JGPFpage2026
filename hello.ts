// hello.ts
interface User {
  name: string;
  email: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  age: 30
};

console.log(greetUser(user));