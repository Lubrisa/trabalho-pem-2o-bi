import User from "./User.js";
import Parser from "../utils/Parser.js";
import Throw from "../utils/Throw.js";

/**
 * @typedef {Pick<User, 'name' | 'email' | 'birthdate' | 'isActive'>} UserInsertData
 */

/**
 * @typedef {Pick<User, 'id' | 'createdAt' | 'updatedAt'>} RemainingUserData
 */

export default class UserInsertDTO {
    static #parser = Parser.for('UserInsertDTO')
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
                    return 'email must be a valid non-empty string containing "@"';
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
        });

    /** @type {string} */
    #name;
    /** @type {string} */
    #email;
    /** @type {Date} */
    #birthdate;
    /** @type {boolean} */
    #isActive;

    /**
     * Creates a new `UserInsertDTO` instance.
     * 
     * @param {UserInsertData} data - The user object containing user details.
     */
    constructor(data) {
        this.#name = data.name;
        this.#email = data.email;
        this.#birthdate = data.birthdate;
        this.#isActive = data.isActive;
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
     * Gets the email of the user.
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
     * Converts this `UserInsertDTO` instance to a User instance.
     * 
     * @param {RemainingUserData} userData - An object containing the remaining user data such as id, createdAt, and updatedAt.
     * 
     * @returns {User} A new User instance with the properties from this UserInsertDTO and the provided user data.
     * 
     * @throws {Error} If the userData object is not valid or does not contain the required properties.
     */
    toUser({ id, createdAt, updatedAt }) {
        return User.fromObject({
            id,
            name: this.#name,
            email: this.#email,
            birthdate: this.#birthdate,
            isActive: this.#isActive,
            createdAt: createdAt,
            updatedAt: updatedAt,
        });
    }

    /**
     * Creates a new `UserInsertDTO` instance from a plain object.
     * 
     * @param {UserInsertData} data - The object containing user details.
     * 
     * @returns {UserInsertDTO} A new `UserInsertDTO` instance.
     * 
     * @throws {Error} If the user object is not valid or does not contain the required properties.
     */
    static fromObject(data) {
        Throw.ifIsNullish(data, 'User object cannot be null or undefined');

        UserInsertDTO.#parser.parse(data)
            .on({
                failure(errors) {
                    throw new Error(`Invalid user data: ${errors.join(', ')}`);
                }
            });

        return new UserInsertDTO({
            name: data.name,
            email: data.email,
            birthdate: new Date(data.birthdate),
            isActive: data.isActive,
        });
    }
}