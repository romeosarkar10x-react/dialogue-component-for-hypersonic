export function delay(millis: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, millis);
    });
}
