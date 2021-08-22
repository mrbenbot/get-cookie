export const stubPuppeteer = {
    launch() {
        return Promise.resolve(stubBrowser);
    },
};
export const stubBrowser = {
    newPage() {
        return Promise.resolve(stubPage);
    },
    close() {
        return Promise.resolve();
    },
};
export const stubPage = {
    goto(url) {
        return Promise.resolve();
    },
    $$(selector) {
        return Promise.resolve([]);
    },
    $(selector) {
        return Promise.resolve(stubElementHandle);
    },
    $eval(selector, pageFunction) {
        return Promise.resolve();
    },
};
export const stubElementHandle = {
    $eval() {
        return Promise.resolve();
    },
};
