import puppeteer from "puppeteer";
import { getBrowserAndPage, typeCommands, extractCookies, } from "./puppeteer";
jest.mock("puppeteer");
describe("getBrowserAndPage", () => {
    const mockGoTo = jest.fn();
    const mockBrowser = {
        newPage: async () => mockPage,
    };
    const mockPage = { goto: mockGoTo };
    beforeEach(() => {
        const launch = puppeteer.launch;
        launch.mockImplementation(async () => mockBrowser);
    });
    afterEach(() => {
        const launch = puppeteer.launch;
        launch.mockReset();
        mockGoTo.mockReset();
    });
    test("should return browser and page", async () => {
        const { browser, page } = await getBrowserAndPage();
        expect(browser).toBe(mockBrowser);
        expect(page).toBe(mockPage);
        expect(mockGoTo).not.toHaveBeenCalled();
    });
    test("should navigate to url if provided", async () => {
        const { browser, page } = await getBrowserAndPage({
            url: "http://example.com",
        });
        expect(browser).toBe(mockBrowser);
        expect(page).toBe(mockPage);
        expect(mockGoTo).toHaveBeenCalledWith("http://example.com");
    });
});
describe("typeCommands", () => {
    test("should call the commands the right amount of times", async () => {
        const mockType = jest.fn();
        const mockPress = jest.fn();
        const mockWaitForSelector = jest.fn();
        const mockWaitForNavigation = jest.fn();
        const mockPage = {
            keyboard: { type: mockType, press: mockPress },
            waitForSelector: mockWaitForSelector,
            waitForNavigation: mockWaitForNavigation,
        };
        const testActions = [
            { action: "press", value: "Tab" },
            { action: "press", value: "Tab" },
            { action: "press", value: "Tab" },
            { action: "press", value: "Enter" },
            { action: "waitForSelector", value: "div" },
            { action: "type", value: "YES" },
            { action: "waitForSelector", value: "div" },
            { action: "press", value: "Enter" },
            { action: "waitForNavigation" },
        ];
        await typeCommands(mockPage, testActions);
        expect(mockPress).toHaveBeenCalledTimes(5);
        expect(mockType).toHaveBeenCalledTimes(1);
        expect(mockWaitForSelector).toHaveBeenCalledTimes(2);
        expect(mockWaitForNavigation).toHaveBeenCalledTimes(1);
    });
    test("should call the commands in the right order", async () => {
        const mockFunction = jest.fn();
        const mockPage = {
            keyboard: { type: mockFunction, press: mockFunction },
            waitForSelector: mockFunction,
            waitForNavigation: mockFunction,
        };
        const testActions = [
            { action: "press", value: "Tab" },
            { action: "press", value: "Enter" },
            { action: "waitForSelector", value: "div" },
            { action: "type", value: "YES" },
            { action: "type", value: "NO" },
            { action: "waitForNavigation" },
        ];
        await typeCommands(mockPage, testActions);
        expect(mockFunction).toHaveBeenNthCalledWith(1, "Tab");
        expect(mockFunction).toHaveBeenNthCalledWith(2, "Enter");
        expect(mockFunction).toHaveBeenNthCalledWith(3, "div");
        expect(mockFunction).toHaveBeenNthCalledWith(4, "YES");
        expect(mockFunction).toHaveBeenNthCalledWith(5, "NO");
        expect(mockFunction).toHaveBeenCalledTimes(6);
    });
});
describe("extractCookies", () => {
    test("returns cookies in object when they are present", async () => {
        const mockCookieFunction = jest.fn();
        mockCookieFunction.mockImplementation(async () => [
            {
                name: "NID",
                value: "test-nid-value",
            },
            {
                name: "CONSENT",
                value: "test-consent-value",
            },
        ]);
        const mockPage = {
            cookies: mockCookieFunction,
        };
        const { consent, nid } = await extractCookies(mockPage, [
            { key: "consent", name: "CONSENT" },
            { key: "nid", name: "NID" },
        ]);
        expect(consent).toBe("test-consent-value");
        expect(nid).toBe("test-nid-value");
    });
    test("throws error when cookies are not present", async () => {
        const mockCookieFunction = jest.fn();
        mockCookieFunction.mockImplementation(async () => [
            {
                name: "NIB",
                value: "test-nib-value",
            },
            {
                name: "FLOB",
                value: "test-flob-value",
            },
        ]);
        const mockPage = {
            cookies: mockCookieFunction,
        };
        expect(extractCookies(mockPage, [
            { key: "consent", name: "CONSENT" },
            { key: "nid", name: "NID" },
        ])).rejects.toThrow();
    });
});
