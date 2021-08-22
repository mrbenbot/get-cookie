import chalk from "chalk";
import ora, { Ora, Spinner } from "ora";

export enum LogTypes {
  Info,
  Error,
}

export function log(message: string, type?: LogTypes): void {
  switch (type) {
    case LogTypes.Error:
      console.log(`${chalk.red("ERROR")}: ${message}`);
      break;
    case LogTypes.Info:
      console.log(`${chalk.yellow("INFO")}: ${message}`);
      break;
    default:
      console.log(message);
  }
}

export function startSpinner(initialMessage: string, emoji: string): Ora {
  return ora({
    text: initialMessage,
    spinner: {
      interval: 150, // Optional
      frames: [`${emoji}  `, ` ${emoji} `, `  ${emoji}`, ` ${emoji} `],
    },
  }).start();
}
