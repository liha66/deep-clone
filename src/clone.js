import { isObject } from "./util.js"

export const deepClone = source => {
    if (!isObject(source)) {
        throw Error(`${source} is not object`)
    }
    let target = Object.create(Object.getPrototypeOf(source))//{}
    let map = new Map
    map.set(source, target)
    let stack = [{source, target}]
    while (stack.length) {
        let {source, target} = stack.pop()
        for (let property /*in source*/ of Object.getOwnPropertyNames(source)) {
            if (isObject(source[property])) {
                if (map.has(source[property])) {
                    target[property] = map.get(source[property])
                } else {
                    target[property] = Object.create(Object.getPrototypeOf(source[property]))//{}
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