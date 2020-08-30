
export function makeRandomName() {
    return "Bob!?! - Unused";
}

export function lastElementOf2<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[arr.length - 1];
}

