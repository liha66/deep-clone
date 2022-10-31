import { isObject } from "./util.js"
import { createObjectFromSameClass } from "./create.js"

export const deepClone = source => {
    if (!isObject(source)) {
        throw Error(`${source} is not object`)
    }
    let target = createObjectFromSameClass(source)
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
                        descriptor.value = map.get(source[property])
                    } else {
                        descriptor.value = createObjectFromSameClass(source[property])
                        stack.push({
                            source: source[property],
                            target: descriptor.value
                        })
                        map.set(source[property], descriptor.value)
                    }
                } else {
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