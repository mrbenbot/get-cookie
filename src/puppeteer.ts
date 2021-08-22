import puppeteer, { Browser, KeyInput, Page } from "puppeteer";

type CommandTypes = {
  press: { action: "press"; value: KeyInput };
  type: { action: "type"; value: string };
  waitForSelector: { action: "waitForSelector"; value: string };
  waitForNavigation: { action: "waitForNavigation"; value?: null };
  waitUntil: {
    action: "waitUntil";
    value: "networkidle0" | "networkidle2";
  };
};

export type CommandType =
  | CommandTypes["press"]
  | CommandTypes["type"]
  | CommandTypes["waitForSelector"]
  | CommandTypes["waitForNavigation"]
  | CommandTypes["waitUntil"];

export async function getBrowserAndPage({
  url,
}: { url?: string } = {}): Promise<{
  browser: Browser;
  page: Page;
}> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (url) {
    await page.goto(url);
  }

  return { browser, page };
}

export async function typeCommands(
  page: Page,
  commands: CommandType[]
): Promise<void> {
  for (let i = 0; i < commands.length; i++) {
    const { action, value } = commands[i] as CommandType;
    switch (action) {
      case "press":
        await page.keyboard.press(value as CommandTypes["press"]["value"]);
        break;
      case "type":
        await page.keyboard.type(value as CommandTypes["type"]["value"]);
        break;
      case "waitForSelector":
        await page.waitForSelector(
          value as CommandTypes["waitForSelector"]["value"]
        );
        break;
      case "waitForNavigation":
        await page.waitForNavigation();
        break;
      default:
        break;
    }
  }
}

export async function loginToSite(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  const commands: CommandType[] = [
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

export async function extractCookies(
  page: Page,
  cookiesToFind: { key: string; name: string }[]
): Promise<{ [key: string]: string }> {
  const cookies = await page.cookies();

  return cookiesToFind.reduce((acc, cur) => {
    const { value: cookieValue } =
      cookies.find((cookie) => cookie.name === cur.name) ?? {};
    if (cookieValue === undefined) {
      throw new Error(`could not find cookie named '${cur.name}'`);
    }
    return { ...acc, [cur.key]: cookieValue };
  }, {});
}
