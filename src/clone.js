import { isObject } from "./util.js"

export const deepClone = source => {
    if (!isObject(source)) {
        throw Error(`${source} is not object`)
    }
    let target = Object.create(Object.getPrototypeOf(source))
    let map = new Map
    map.set(source, target)
    let stack = [{source, target}]
    while (stack.length) {
        let {source, target} = stack.pop()
        for (let property of Object.getOwnPropertyNames(source)) {
            let descriptor = Object.getOwnPropertyDescriptor(source, property)
            if (descriptor.hasOwnProperty("value")) { // data property
                if (isObject(source[property])) {
                    if (map.has(source[property])) {
                        // target[property] = map.get(source[property])
                        descriptor.value = map.get(source[property])
                    } else {
                        descriptor.value = Object.create(Object.getPrototypeOf(source[property]))
                        stack.push({
                            source: source[property],
                            target: descriptor.value
                        })
                        map.set(source[property], descriptor.value)
                    }
                } else {
                    // target[property] = source[property]
                    descriptor.value = source[property]
                }
                Object.defineProperty(target, property, descriptor)
            } else { // accessor property
                Object.defineProperty(target, property, descriptor)
            }
        }
        if (Object.isFrozen(source)) {
            Object.freeze(target)
        } else if (Object.isSealed(source)) {
            Object.seal(target)
        } else if (!Object.isExtensible(source)) {
            Object.preventExtensions(target)
        }
    }
    return target
}