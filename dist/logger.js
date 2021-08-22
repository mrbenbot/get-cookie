import chalk from "chalk";
import ora from "ora";
export var LogTypes;
(function (LogTypes) {
    LogTypes[LogTypes["Info"] = 0] = "Info";
    LogTypes[LogTypes["Error"] = 1] = "Error";
})(LogTypes || (LogTypes = {}));
export function log(message, type) {
    switch (type) {
        case LogTypes.Error:
            console.log(`${chalk.red("ERROR")}: ${message}`);
            break;
        case LogTypes.Info:
            //   console.log(`${chalk.yellow("INFO")}: ${message}`);
            //   spinner.text = message;
            break;
        default:
            console.log(message);
    }
}
export function startSpinner(initialMessage, emoji) {
    return ora({
        text: initialMessage,
        spinner: {
            interval: 150,
            frames: [`${emoji}  `, ` ${emoji} `, `  ${emoji}`, ` ${emoji} `],
        },
    }).start();
}
