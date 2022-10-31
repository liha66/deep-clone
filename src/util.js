export const isObject = object => typeof object === "function" || typeof object === 'object' && object !== null
export const toString = object => Object.prototype.toString.call(object)
export const cloneArrayBuffer = buffer => {
    const result = new ArrayBuffer(buffer.byteLength)
    new Uint8Array(result).set(new Uint8Array(buffer))
    return result
}
