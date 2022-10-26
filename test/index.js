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