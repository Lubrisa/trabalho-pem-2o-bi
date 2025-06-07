import Throw from "./Throw.js";
import Validation from "./Validation.js";

/**
 * @template T
 * @typedef {object} Rule A validation rule for a field in the data.
 * @property {keyof T} field The field in the data to validate.
 * @property {(value: T[keyof T]) => (string | undefined)} [validator] The
 * function that validates the field's value.
 * @property {boolean} [required] Indicates if the field is required.
 * @property {string} [missingMessage] The message to return if the field is
 * required but missing.
 */

/**
 * A class for parsing and validating data against defined rules.
 *
 * @template T - The type of the data to validate.
 */
export default class Parser {
    /** @type {string | undefined} */
    #type;
    /** @type {Rule<T>[]} */
    #rules = [];

    /**
     * Creates an instance of the Parser class.
     *
     * @param {string} [type=undefined] The type that will be parsed by the
     * Parser.
     */
    constructor(type=undefined) {
        this.#type = type;
    }

    /**
     * Defines a new validation rule for a field.
     *
     * @param {Rule<T>} rule The rule to define.
     *
     * @returns {Parser<T>} Returns the Parser instance for method chaining.
     *
     * @throws {Error} If `rule` is not an object with a "field" property
     * @throws {Error} If `rule` does not have a "validator" function and its
     * "required" property is false.
     * @throws {Error} If the "missingMessage" in `rule` is provided but is not
     * a string.
     */
    defineRule(rule) {
        Throw.if(typeof rule !== 'object', 'The parameter `rule` must be an object.');
        
        Throw.ifIsNullish(rule.field, 'The property `field` in the parameter `rule` is required.');

        Throw.if(typeof rule.validator !== 'function' && !rule.required,
            'The property `validator` must be a function or the property `required` must be true in the parameter `rule`.');

        Throw.if(rule.missingMessage !== undefined && typeof rule.missingMessage !== 'string',
            'If the property `missingMessage` in the parameter `rule` is provided, it must be a string');

        this.#rules.push(rule);

        return this;
    }

    /**
     * Parses the provided data against the defined rules.
     *
     * @param {T} data The data to validate.
     *
     * @returns {Validation<T>} A validation object that holds the result of the
     * parsing.
     *
     * @throws {Error} If `data` is not an `object` or is `null`.
     * @throws {Error} If `template` is not a string.
     */
    parse(data) {
        Throw.if(typeof data !== 'object' || data === null,
            `${this.#type || 'Data'} must be a non-null object`);

        const errors = this.#rules.reduce((/** @type {string[]} */ errors, rule) => {
            const value = data[rule.field];

            if (rule.required && (value === undefined || value === null)) {
                errors.push(rule.missingMessage || `${rule.field.toString()} is required`);
                return errors;
            }

            if (!rule.validator)
                return errors;

            const error = rule.validator(value);
            if (error)
                errors.push(error);

            return errors;
        }, []);

        return errors.length > 0 ?
            Validation.failure(...errors) :
            Validation.success(data);
    }

    /**
     * Initializes a new Parser instance for the provided type.
     *
     * @template T The type that will be parsed.
     *
     * @param {string | undefined} type The name of the type that will be
     * parsed.
     *
     * @returns {Parser<T>} The new Parser instance.
     *
     * @throws {Error} If `type`
     */
    static for(type) {
        Throw.if(type !== undefined && typeof type !== 'string',
            'If the parameter `type` is provided it must be a string.')

        return new Parser(type);
    }
}