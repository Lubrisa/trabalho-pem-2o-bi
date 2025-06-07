
import User from "./User.js";
import Parser from "../utils/Parser.js";
import Throw from "../utils/Throw.js";

/**
 * @typedef {Pick<User, 'name' | 'email' | 'birthdate' | 'isActive'>} UserUpdateData
 */

/**
 * Class representing a Data Transfer Object (DTO) for updating user information.
 */
export default class UserUpdateDTO {
    static #parser = Parser.for('UserUpdateDTO')
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

    /**
     * @type {string}
     */
    #name;
    /**
     * @type {string}
     */
    #email;
    /**
     * @type {Date}
     */
    #birthdate;
    /**
     * @type {boolean}
     */
    #isActive;

    /**
     * Creates a new `UserUpdateDTO` instance.
     * 
     * @param {UserUpdateData} data - The object containing user details.
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
     * @returns {boolean} True if the user is active, false otherwise.
     */
    get isActive() {
        return this.#isActive;
    }

    /**
     * Applies the update to an existing user instance.
     * 
     * @param {User} user - The user instance to be updated.
     * 
     * @returns {User} A new User instance with the updated details.
     * 
     * @throws {Error} If the user object is not valid or does not contain the required properties.
     */
    applyTo(user) {
        return User.fromObject({
            id: user.id,
            name: this.#name,
            email: this.#email,
            birthdate: this.#birthdate,
            isActive: this.#isActive,
            createdAt: user.createdAt,
            updatedAt: new Date()
        });
    }

    /**
     * Creates a new `UserUpdateDTO` instance from a plain object.
     * 
     * @param {UserUpdateData} data - The object containing user details.
     * 
     * @returns {UserUpdateDTO} A new `UserUpdateDTO` instance.
     * 
     * @throws {Error} If the user object is not valid or does not contain the required properties.
     */
    static fromObject(data) {
        Throw.ifIsNullish(data, 'User object cannot be null or undefined');

        UserUpdateDTO.#parser.parse(data)
            .on({
                failure(errors) {
                    throw new Error(`Invalid user data: ${errors.join(', ')}`);
                }
            });

        return new UserUpdateDTO({
            name: data.name,
            email: data.email,
            birthdate: new Date(data.birthdate),
            isActive: data.isActive,
        });
    }
}