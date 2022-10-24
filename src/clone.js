import { isObject } from "./util.js"

export const deepClone = source => {
    if (!isObject(source)) {
        throw Error(`${source} is not object`)
    }
    let target = {}
    let map = new Map
    map.set(source, target)
    let stack = [{source, target}]
    while (stack.length) {
        let {source, target} = stack.pop()
        for (let property in source) {
            if (isObject(source[property])) {
                if (map.has(source[property])) {
                    target[property] = map.get(source[property])
                } else {
                    target[property] = {}
                    stack.push({
                        source: source[property],
                        target: target[property]
                    })
                    map.set(source[property], target[property])
                }
            } else {
                target[property] = source[property]
            }
        }
    }
    return target
}