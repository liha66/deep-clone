import { deepClone } from "./clone.js"
import { registerClass } from "./create.js"
import { cloneArrayBuffer, isObject } from "./util.js"

const typedArray = [
    {
        constructor: Uint8Array,
        toString: 'Uint8Array'
    },
    {
        constructor: Int8Array,
        toString: 'Int8Array'
    },
    {
        constructor: Uint16Array,
        toString: 'Uint16Array'
    },
    {
        constructor: Int16Array,
        toString: 'Int16Array'
    },
    {
        constructor: Uint32Array,
        toString: 'Uint32Array'
    },
    {
        constructor: Int32Array,
        toString: 'Int32Array'
    },
    {
        constructor: Float32Array,
        toString: 'Float32Array'
    },
    {
        constructor: BigUint64Array,
        toString: 'BigUint64Array'
    },
    {
        constructor: BigInt64Array,
        toString: 'BigInt64Array'
    },
    {
        constructor: Float64Array,
        toString: 'Float64Array'
    }
]

// register Function
registerClass(({ toStringTag, prototype }) =>
    prototype === Function.prototype && toStringTag === "[object Function]",
    source => function () {
        return source.call(this, ...arguments)
    }
)
// Array
registerClass(({ toStringTag, prototype }) =>
    prototype === Array.prototype && toStringTag === "[object Array]",
    source => source.slice()
)
// Number
registerClass(({ toStringTag, prototype }) =>
    prototype === Number.prototype && toStringTag === "[object Number]",
    source => new Number(source.valueOf())
)
// String
registerClass(({ toStringTag, prototype }) =>
    prototype === String.prototype && toStringTag === "[object String]",
    source => new String(source.valueOf())
)
// Boolean
registerClass(({ toStringTag, prototype }) =>
    prototype === Boolean.prototype && toStringTag === "[object Boolean]",
    source => new Boolean(source.valueOf())
)
// Symbol
registerClass(({ toStringTag, prototype }) =>
    prototype === Symbol.prototype && toStringTag === "[object Symbol]",
    source => new Object(source.valueOf())
)
// BigInt
registerClass(({ toStringTag, prototype }) =>
    prototype === BigInt.prototype && toStringTag === "[object BigInt]",
    source => new Object(source.valueOf())
)
// Date
registerClass(({ toStringTag, prototype }) =>
    prototype === Date.prototype && toStringTag === "[object Date]",
    source => new Date(source.toJSON())
)
// Map
registerClass(({ toStringTag, prototype }) =>
    prototype === Map.prototype && toStringTag === "[object Map]",
    source => {
        const map = new Map
        for (let [key, value] of source) {
            map.set(key, isObject(value) ? deepClone(value) : value)
        }
        return map
    }
)
// Set
registerClass(({ toStringTag, prototype }) =>
    prototype === Set.prototype && toStringTag === "[object Set]",
    source => {
        const set = new Set
        for (let value of source) {
            set.add(isObject(value) ? deepClone(value) : value)
        }
        return set
    }
)
// RegExp
registerClass(({ toStringTag, prototype }) =>
    prototype === RegExp.prototype && toStringTag === "[object RegExp]",
    source => {
        const reg = new RegExp(source.source, /\w*$/.exec(source))
        reg.lastIndex = source.lastIndex
        return reg
    }
)
// ArrayBuffer
registerClass(({ toStringTag, prototype }) =>
    prototype === ArrayBuffer.prototype && toStringTag === "[object ArrayBuffer]",
    source => cloneArrayBuffer(source)
)
// DataView
registerClass(({ toStringTag, prototype }) =>
    prototype === DataView.prototype && toStringTag === "[object DataView]",
    source => {
        const buffer = cloneArrayBuffer(source.buffer)
        return new DataView(buffer, source.byteOffset, source.byteLength)
    }
)
// TypedArray
typedArray.map(typedarray => {
    const { constructor, toString } = typedarray
    registerClass(({ toStringTag, prototype }) => prototype === constructor.prototype && toStringTag === `[object ${toString}]`,
        source => {
            const buffer = cloneArrayBuffer(source.buffer)
            return new constructor(buffer, source.byteOffset, source.length)
        }
    )
})
export default deepClone
