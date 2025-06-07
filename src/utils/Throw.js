import evaluate from "./evaluate.js"

/**
 * @template TOut
 * @typedef {import('../types/Lazy.ts').Lazy<[], TOut>} Lazy
 */

export default class Throw {
    /**
     * @template TOut Use this type when you want to throw an error in a expression
     * 
     * @param {Lazy<string>} messageProvider A string or a function that returns
     * a string that will be used as the error message.
     * 
     * @returns {TOut} This method does not return a value, this signature is only
     * used to allow this method to be used in expressions.
     *
     * @throws {Error} Throws an error with the message provided by
     * `messageProvider`.
     */
    static error(messageProvider) {
        throw new Error(evaluate(messageProvider));
    }
    
    /**
     * Throws an error if `predicate` is evaluated to true.
     *
     * @param {Lazy<boolean>} predicate A boolean or function that returns a
     * boolean that indicates if the error should be thrown.
     * @param {Lazy<string>} messageProvider A string or a function that returns
     * a string that will be used as the error message.
     *
     * @returns {typeof Throw} Returns the `Throw` class itself for method
     * chaining.
     *
     * @throws {Error} Throws an error with the message provided by
     * `messageProvider` if `predicate` is true.
     */
    static if(predicate, messageProvider) {
        if (evaluate(predicate))
            Throw.error(messageProvider);

        return Throw;
    }

    /**
     *
     * @param {Lazy<any>} data The value to check.
     * @param {Lazy<string>} messageProvider A string or a function that returns
     * a string that will be used as the error message.
     *
     * @returns {typeof Throw} Returns the `Throw` class itself for method
     * chaining.
     *
     * @throws {Error} Throws an error with the message provided by
     * `messageProvider` if `value` is null or undefined.
     */
    static ifIsNullish(data, messageProvider) {
        const dataProcessed = evaluate(data);

        if (dataProcessed === undefined || dataProcessed === null)
            Throw.error(messageProvider);

        return Throw;
    }
}
