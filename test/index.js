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