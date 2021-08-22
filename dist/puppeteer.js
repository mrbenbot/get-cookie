import puppeteer from "puppeteer";
export async function getBrowserAndPage({ url, } = {}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    if (url) {
        await page.goto(url);
    }
    return { browser, page };
}
export async function typeCommands(page, commands) {
    for (let i = 0; i < commands.length; i++) {
        const { action, value } = commands[i];
        switch (action) {
            case "press":
                await page.keyboard.press(value);
                break;
            case "type":
                await page.keyboard.type(value);
                break;
            case "waitForSelector":
                await page.waitForSelector(value);
                break;
            case "waitForNavigation":
                await page.waitForNavigation();
                break;
            default:
                break;
        }
    }
}
export async function loginToSite(page, email, password) {
    const commands = [
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Enter" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "press", value: "Tab" },
        { action: "type", value: email },
        { action: "type", value: " => " },
        { action: "type", value: password },
        { action: "press", value: "Enter" },
        { action: "waitForNavigation" },
    ];
    await typeCommands(page, commands);
}
export async function extractCookies(page, cookiesToFind) {
    const cookies = await page.cookies();
    return cookiesToFind.reduce((acc, cur) => {
        const { value: cookieValue } = cookies.find((cookie) => cookie.name === cur.name) ?? {};
        if (cookieValue === undefined) {
            throw new Error(`could not find cookie named '${cur.name}'`);
        }
        return { ...acc, [cur.key]: cookieValue };
    }, {});
}
