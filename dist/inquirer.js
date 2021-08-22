import inquirer from "inquirer";
const questions = [
    { type: "input", name: "email", message: "Email" },
    { type: "password", name: "password", message: "Password" },
];
export function ask(questions) {
    return inquirer.prompt(questions);
}
export function getEmailAndPassword() {
    return ask(questions);
}
