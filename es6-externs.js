// Not sure why Closure compiler doesn't recognize Proxy. A more responsible
// person would file a bug instead of just hacking it into the externs...


/**
 * This is way underspecified, but it'll get the compiler to play along for now.
 * @param {!Object} target
 * @param {!Object} handler
 * @constructor
 */
function Proxy(target, handler) {}
