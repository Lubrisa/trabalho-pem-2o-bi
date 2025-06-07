/**
 * @template {unknown[]} TArgs
 * @template TOut
 * @typedef {import('../types/Lazy.ts').Lazy<TArgs, TOut>} Lazy
 */

/**
 * @template {unknown[]} TArgs
 * @template TOut
 *
 * @param {Lazy<TArgs, TOut>} value A value or a function that returns a value.
 *
 * @returns {value is (...args: TArgs) => TOut} True if the value is a function,
 * false otherwise.
 */
function isCallable(value) {
    return typeof value === 'function';
}

/**
 * @template {unknown[]} TArgs
 * @template TOut
 *
 * @param {Lazy<TArgs, TOut>} expression A value or a function that returns a
 * value.
 * @param {TArgs} args Arguments to pass to `expression` if it is a function.
 *
 * @returns {TOut} The value of `expression` if it is not a function, or the
 * result of calling `expression` with `args` if it is a function.
 */
export default function evaluate(expression, ...args) {
    return isCallable(expression) 
        ? expression(...args) 
        : expression;
}
