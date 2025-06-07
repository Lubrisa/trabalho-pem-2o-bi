/**
 * @template T
 *
 * The result of a validation process. It holds the data that was validated and
 * any errors that occurred during the validation.
 */
export default class Validation {
    /**
     * Returns whether the validation was successful or not.
     *
     * @returns {this is SuccessfullValidation<T>} True if the validation was
     * successful, false otherwise.
     */
    isSuccess() {
        throw new Error('Method `isSuccess` must be implemented in subclasses.');
    }

    /**
     * Returns whether the validation failed or not.
     *
     * @returns {this is FailedValidation<T>} True if the validation failed,
     * false otherwise.
     */
    isFailure() {
        return !this.isSuccess();
    }

    /**
     * Calls the provided callbacks based on the validation result.
     *
     * @param {object} callbacks
     * @param {(data: T) => void} [callbacks.success] The callback to call if
     * the validation was successful.
     * @param {(errors: string[]) => void} [callbacks.failure] The callback to
     * call if the validation failed.
     */
    on(callbacks) {
        throw new Error('Method `on` must be implemented in subclasses.');
    }

    /**
     * @template T
     *
     * Creates a new `Validation` instance that represents a failed validation.
     *
     * @param  {...string} errors The errors that occurred during validation. 
     *
     * @returns {Validation<T>} A new `Validation` instance with the provided
     * errors.
     */
    static failure(...errors) {
        return new FailedValidation(...errors);
    }

    /**
     * @template T
     *
     * Creates a new `Validation` instance that represents a successful
     * validation.
     *
     * @param {T} data The data that was validated successfully.
     *
     * @returns {Validation<T>} A new `Validation` instance with the provided
     * data. 
     */
    static success(data) {
        return new SuccessfullValidation(data);
    }
}

/**
 * @template T
 *
 * @extends {Validation<T>}
 */
class SuccessfullValidation extends Validation {
    /** @type {T} */
    #data;

    /**
     * Creates a new `Validation` instance that represents a successful
     * validation.
     *
     * @param {T} data The data that was validated successfully. 
     */
    constructor(data) {
        super();
        this.#data = data;
    }

    /**
     * Gets the data that was validated successfully.
     *
     * @returns {T} The data that was validated successfully.
     */
    get data() {
        return this.#data;
    }

    /**
     * @returns {this is SuccessfullValidation<T>}
     */
    isSuccess() {
        return true;
    }

    /**
     * @param {object} callbacks
     * @param {(data: T) => void} [callbacks.success] The callback to call if
     * the validation was successful.
     * @param {(errors: string[]) => void} [callbacks.failure] The callback to
     * call if the validation failed.
     */
    on({ success }) {
        success?.(this.data);
    }
}

/**
 * @template T
 * @extends {Validation<T>}
 */
class FailedValidation extends Validation {
    /** @type {string[]} */
    #errors;

    /**
     * Creates a new `Validation` instance that represents a failed validation.
     *
     * @param  {...string} errors The errors that occurred during validation.
     */
    constructor(...errors) {
        super();
        this.#errors = errors;
    }

    /**
     * Gets the errors that occurred during validation.
     *
     * @returns {string[]} The errors that occurred during validation.
     */
    get errors() {
        return [...this.#errors];
    }

    /**
     * @returns {this is SuccessfullValidation<any>}
     */
    isSuccess() {
        return false;
    }

    /**
     * @param {object} callbacks
     * @param {(data: any) => void} [callbacks.success] The callback to call if
     * the validation was successful.
     * @param {(errors: string[]) => void} [callbacks.failure] The callback to
     * call if the validation failed.
     */
    on({ failure }) {
        failure?.(this.errors);
    }
}
