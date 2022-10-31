import deepClone from "../src/index.js"
import assert from "assert"

it("deep clone an ordinary object", function () {
    let x = {a : 1, b: 2}
    let y = deepClone(x)
    assert.notEqual(x, y)
    assert.equal(JSON.stringify(x), JSON.stringify(y))
    let p = {x: 1, y: {z: 2}}
    let q = deepClone(p)
    assert.equal(JSON.stringify(p), JSON.stringify(q))
    assert.notEqual(p.y, q.y)
})
it("deep clone an ordinary object with null property", function () {
    let x = {a : 1, b: null}
    let y = deepClone(x)
    assert.notEqual(x, y)
    assert.equal(JSON.stringify(x), JSON.stringify(y))
})
// v1  RangeError: Maximum call stack size exceeded
it("deep clone an ordinary object with circular reference", function () {
    let x = {a: 1}
    x.b = x
    let y = deepClone(x)
    assert.notEqual(x, y)
    assert.equal(y, y.b)
})
it("deep clone an ordinary object with prototype", function () {
    let x = {a: 1}
    Object.setPrototypeOf(x, {b: 2})
    let y = deepClone(x)
    assert.equal(x.b, y.b)
    assert(!y.hasOwnProperty("b"))
})
it("deep clone an ordinary object with non-enumerable property", function () {
    const x = {}
    Object.defineProperty(x, "a", {
        value: 1,
        writable: true,
        enumerable: false,
        configurable: false
    })
    let y = deepClone(x)
    assert.notEqual(x, y)
    assert(!y.propertyIsEnumerable("a"))
})
it("deep clone an ordinary object with status", function () {
    // frozen
    const x = Object.freeze({a: 1})
    const y = deepClone(x)
    assert(Object.isFrozen(y))
    assert.equal(x.a, y.a)
    // sealed
    const p = Object.seal({a: 1})
    const q = deepClone(p)
    assert(Object.isSealed(q))
    assert(p.a, q.a)
    // non-extensible
    const i = Object.preventExtensions({a: 1})
    const j = deepClone(i)
    assert(!Object.isExtensible(j))
    assert.equal(i.a, j.a)
})
it("clone a Function object", function () {
    function add (a, b) {
        return a + b
    }
    const f = deepClone(add)
    assert.equal(add(1, 2), f(1, 2))
    assert.notEqual(f, add)
})
it("clone a Array object", function () {
    const arr = [{x: 1}, 2]
    const o = deepClone(arr)
    assert.notEqual(o, arr)
    assert.equal(JSON.stringify(arr), JSON.stringify(o))
    assert.notEqual(arr[0], o[0]) 
    assert.equal(arr[1], o[1]) 
})
it("clone a Number object", function () {
    const x = new Number(3)
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.valueOf(), x.valueOf())
})
it("clone a String object", function () {
    const x = new String('3')
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.valueOf(), x.valueOf())
})
it("clone a Boolean object", function () {
    const x = new Boolean(false)
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.valueOf(), x.valueOf())
})
it("clone a Symbol object", function () {
    const x = new Object(Symbol('hello'))
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.valueOf(), x.valueOf())
    assert.equal(o.constructor, Symbol)
})
it("clone a BigInt object", function () {
    const x = new Object(BigInt(123))
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.valueOf(), x.valueOf())
    assert.equal(o.constructor, BigInt)
})
it("clone a Date object", function () {
    const x = new Date("2022/10/24")
    const o = deepClone(x)
    assert.notEqual(o, x)
    assert.equal(o.getTime(), x.getTime())
})
it("clone a Map object", function () {
    const x = new Map
    const o = deepClone(x)
    assert.notEqual(o, x)
})
it("clone a Set object", function () {
    const x = new Set
    const o = deepClone(x)
    assert.notEqual(o, x)
})
it("clone a RegExp object", function () {
    const str = "Abcd"
    const x = /c/g
    const o = deepClone(x)
    assert.notEqual(o, x)
    o.test(str)
    assert.equal(o.lastIndex, 3)
})
it("clone a ArrayBuffer object", function () {
    const buffer = new ArrayBuffer(10)
    let i = 10
    while (i--) {
        buffer[i] = 9 - i
    }
    const x = deepClone(buffer)
    assert.notEqual(buffer, x)
    assert.equal(x.constructor, ArrayBuffer)
    assert.equal(x.byteLength, 10)
    assert.equal(x[0], 9)
    assert.equal(x[9], 0)
})
it("clone a DataView object", function () {
    const buffer = new ArrayBuffer(16)
    const view = new DataView(buffer)
    view.setInt16(2, 100)
    const x = deepClone(view)
    assert.notEqual(view, x)
    assert.notEqual(buffer, x.buffer)
    assert.equal(x.constructor, DataView)
    assert.equal(x.byteLength, 16)
    assert.equal(x.getInt16(2), 100)
})
it("clone a Uint8Array object", function () {
    const uint8 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 0])
    const x = deepClone(uint8)
    assert.notEqual(uint8, x)
    assert.notEqual(uint8.buffer, x.buffer)
    assert.equal(x.constructor, Uint8Array)
    assert.equal(x.byteLength, 8)
    assert.equal(x[0], 1)
    assert.equal(x[7], 0)
})
it("clone a Int16Array object", function () {
    const int16 = new Int16Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
    const x = deepClone(int16)
    assert.notEqual(int16, x)
    assert.notEqual(int16.buffer, x.buffer)
    assert.equal(x.constructor, Int16Array)
    assert.equal(x.length, 10)
    assert.equal(x.byteLength, 20)
    assert.equal(x[0], 1)
    assert.equal(x[7], 8)
})
it("clone a Float32Array object", function () {
    const float32 = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
    const x = deepClone(float32)
    assert.notEqual(float32, x)
    assert.notEqual(float32.buffer, x.buffer)
    assert.equal(x.constructor, Float32Array)
    assert.equal(x.length, 10)
    assert.equal(x.byteLength, 40)
    assert.equal(x[0], 1)
    assert.equal(x[9], 0)
})
it("clone a BigInt64Array object", function () {
    const int64 = new BigInt64Array([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n])
    const x = deepClone(int64)
    assert.notEqual(int64, x)
    assert.notEqual(int64.buffer, x.buffer)
    assert.equal(x.constructor, BigInt64Array)
    assert.equal(x.length, 9)
    assert.equal(x.byteLength, 72)
    assert.equal(x[0], 1n)
    assert.equal(x[8], 9n)
})