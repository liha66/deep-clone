import { isObject } from "./util.js"

export const deepClone = source => {
    if (!isObject(source)) {
        throw Error(`${source} is not object`)
    }
    let target = {}
    for (let property in source) {
        if (isObject(source[property])) {
            target[property] = deepClone(source[property])
        } else {
            target[property] = source[property]
        }
    }
    return target
}