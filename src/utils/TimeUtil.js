import moment from "moment"

export function getTimeLength(t) {
    const v = t / 1000
    const h = Math.floor(v / 3600)
    const m = Math.floor((v % 3600) / 60)
    const s = (v % 3600) % 60
    return `${h}:${m}:${s}`
}

export function getTimeObject(t) {
    const v = t / 1000
    const h = Math.floor(v / 3600)
    const m = Math.floor((v % 3600) / 60)
    const s = (v % 3600) % 60
    return {
        hour: h,
        minute: m,
        second: s
    }
}

export function getTime2Length(start, end) {
    const t1 = moment(start).valueOf()
    const t2 = moment(end).valueOf()
    return getTimeLength(t1 - t2)
}