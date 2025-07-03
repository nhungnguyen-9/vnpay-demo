export function pad(n: number) {
    return n.toString().padStart(2, '0')
}

export function sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {}
    const keys = Object.keys(obj).sort()
    for (const key of keys) {
        sorted[key] = obj[key]
    }
    return sorted
}