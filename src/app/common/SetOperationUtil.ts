
export const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
    return new Set([...setA, ...setB]);
}

export const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
    return new Set([...setA].filter(item => setB.has(item)));
}

export const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
    return new Set([...setA].filter(item => !setB.has(item)));
}