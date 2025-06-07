import Parser from "../utils/Parser.js";
import Throw from "../utils/Throw.js";

/**
 * @typedef {object} UserData
 * @property {number} id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {Date} birthdate - The birthdate of the user.
 * @property {boolean} isActive - Indicates if the user is active.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was last updated.
 */

export default class User {
    /** @type {Parser<UserData>} */
    static #parser = Parser.for('User')
        .defineRule({
            field: 'id',
            validator: id => {
                if (typeof id !== 'number' || isNaN(id) || id <= 0)
                    return 'id must be a positive number';
            },
            required: true,
        })
        .defineRule({
            field: 'name',
            validator: name => {
                if (typeof name !== 'string' || name.trim() === '')
                    return 'name must be a non-empty string';
            },
            required: true,
        })
        .defineRule({
            field: 'email',
            validator: email => {
                if (typeof email !== 'string' || !email.includes('@') || email.trim() === '')
                    return 'email must be a non-empty string containing "@"';
            },
            required: true,
        })
        .defineRule({
            field: 'birthdate',
            validator: birthdate => {
                if (!(birthdate instanceof Date) || isNaN(birthdate.getTime()))
                    return 'birthdate must be a valid Date object';

                if (birthdate > new Date())
                    return 'birthdate cannot be in the future';
            },
            required: true,
        })
        .defineRule({
            field: 'isActive',
            validator: isActive => {
                if (typeof isActive !== 'boolean')
                    return 'isActive must be a boolean value';
            },
            required: true,
        })
        .defineRule({
            field: 'createdAt',
            validator: createdAt => {
                if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()))
                    return 'createdAt must be a valid Date object';

                if (createdAt > new Date())
                    return 'createdAt cannot be in the future';
            },
            required: true,
        })
        .defineRule({
            field: 'updatedAt',
            validator: updatedAt => {
                if (!(updatedAt instanceof Date) || isNaN(updatedAt.getTime()))
                    return 'updatedAt must be a valid Date object';

                if (updatedAt > new Date())
                    return 'updatedAt cannot be in the future';
            },
            required: true,
        });

    /** @type {number} */
    #id;
    /** @type {string} */
    #name;
    /** @type {string} */
    #email;
    /** @type {Date} */
    #birthdate;
    /** @type {boolean} */
    #isActive;
    /** @type {Date} */
    #createdAt;
    /** @type {Date} */
    #updatedAt;

    /**
     * Creates a new `User` instance.
     *
     * @param {UserData} data The user object containing user details.
     */
    constructor(data) {
        this.#id = data.id;
        this.#name = data.name;
        this.#email = data.email;
        this.#birthdate = data.birthdate;
        this.#isActive = data.isActive;
        this.#createdAt = data.createdAt;
        this.#updatedAt = data.updatedAt;
    }

    /**
     * Gets the unique identifier of the user.
     *
     * @returns {number} The unique identifier of the user.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the name of the user.
     *
     * @returns {string} The name of the user.
     */
    get name() {
        return this.#name;
    }

    /**
     * Gets the email address of the user.
     *
     * @returns {string} The email address of the user.
     */
    get email() {
        return this.#email;
    }

    /**
     * Gets the birthdate of the user.
     *
     * @returns {Date} The birthdate of the user.
     */
    get birthdate() {
        return this.#birthdate;
    }

    /**
     * Gets the active status of the user.
     *
     * @returns {boolean} Indicates if the user is active.
     */
    get isActive() {
        return this.#isActive;
    }

    /**
     * Gets the creation date of the user.
     *
     * @returns {Date} The date when the user was created.
     */
    get createdAt() {
        return this.#createdAt;
    }

    /**
     * Gets the last update date of the user.
     *
     * @returns {Date} The date when the user was last updated.
     */
    get updatedAt() {
        return this.#updatedAt;
    }

    /**
     * Calculates the age of the user based on their birthdate.
     * 
     * @returns {number} The age of the user in years.
     */
    get age() {
        const today = new Date();
        
        const yearDiff = today.getFullYear() - this.#birthdate.getFullYear();
        const monthDiff = today.getMonth() - this.#birthdate.getMonth();

        if (monthDiff > 0)
            return yearDiff;

        const dayDiff = today.getDate() - this.#birthdate.getDate();

        if (dayDiff >= 0)
            return yearDiff;
        
        return yearDiff - 1;
    }

    /**
     * Creates a new `User` instance from a plain object.
     *
     * @param {UserData} data The object containing user details.
     *
     * @returns {User} A new `User` instance.
     *
     * @throws {Error} If the user object is not valid or does not contain the
     * required properties.
     */
    static fromObject(data) {
        Throw.ifIsNullish(data, 'User object cannot be null or undefined');

        this.#parser.parse(data)
            .on({
                failure(errors) {
                    throw new Error(`Invalid user object: ${errors.join(', ')}`);
                }
            });

        return new User({
            id: data.id,
            name: data.name,
            email: data.email,
            birthdate: new Date(data.birthdate),
            isActive: data.isActive,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        });
    }
}