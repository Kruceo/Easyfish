export default function beautyNumber(value: number) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2,maximumFractionDigits:2 })
}