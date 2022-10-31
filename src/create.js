import { toString } from "./util.js"

const classes = []

export const createObjectFromSameClass = source => {
    const toStringTag = toString(source)
    const prototype = Object.getPrototypeOf(source)
    for (let { check, create } of classes) {
        if (check({source, toStringTag, prototype}))
            return create(source)
    }
    return Object.create(prototype)
}

export const registerClass = (check, create) => classes.push({ check, create })
