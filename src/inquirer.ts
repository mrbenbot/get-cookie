import inquirer, { Answers, Question } from "inquirer";

const questions: Question[] = [
  { type: "input", name: "email", message: "Email" },
  { type: "password", name: "password", message: "Password" },
];

export function ask(questions: Question[]): Promise<Answers> {
  return inquirer.prompt(questions);
}

export function getEmailAndPassword(): Promise<Answers> {
  return ask(questions);
}
