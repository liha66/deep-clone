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