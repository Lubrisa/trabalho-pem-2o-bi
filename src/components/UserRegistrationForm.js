import Alert from './Alert.js';
import Event from "../utils/Event.js";
import UserInsertDTO from "../data/UserInsertDTO.js";
import Throw from '../utils/Throw.js';

/**
 * @typedef {object} UserRegistrationFormFields
 * @property {HTMLInputElement} name - The input field for the user's name.
 * @property {HTMLInputElement} email - The input field for the user's email.
 * @property {HTMLInputElement} birthdate - The input field for the user's birthdate.
 * @property {HTMLInputElement} isActive - The checkbox input for the user's active status.
 */

/**
 * UserRegistrationForm class
 * 
 * This class handles the user registration form functionality.
 * It validates the form fields, handles the form submission,
 * and provides an event for when the form is submitted.
 */
export default class UserRegistrationForm {
    /** @type {HTMLFormElement} */
    #element;
    /** @type {Alert} */
    #alert;

    /** @type {Event<[UserInsertDTO]>} */
    #onSubmit = new Event();

    /** @type {UserRegistrationFormFields} */
    #fields;

    /**
     * Creates an instance of UserRegistrationForm.
     * 
     * @param {HTMLFormElement} element - The form element to be managed by this class.
     * 
     * @throws {Error} If the element is not an instance of HTMLFormElement or if any of the fields are not found or not valid.
     */
    constructor(element) {
        Throw.if(!(element instanceof HTMLFormElement),
            'Element must be an instance of HTMLFormElement');

        this.#element = element;

        this.#fields = {
            name: this.#element.querySelector('#user-name-input')
                    || Throw.error('Field user-name-input not found in the form'),
            email: this.#element.querySelector('#user-email-input')
                    || Throw.error('Field user-email-input not found in the form'),
            birthdate: this.#element.querySelector('#user-birthdate-input')
                    || Throw.error('Field user-birthdate-input not found in the form'),
            isActive: this.#element.querySelector('#user-active-input')
                    || Throw.error('Field user-active-input not found in the form'),
        };

        this.#alert = new Alert(this.#element.querySelector('[data-role="validation-warning"')
            || Throw.error('Validation warning element not found in the form'));
        
        this.#element.addEventListener('submit', (event) => {
            event.preventDefault();

            try {
                const newUser = UserInsertDTO.fromObject({
                    name: this.#fields.name.value,
                    email: this.#fields.email.value,
                    birthdate: new Date(this.#fields.birthdate.value),
                    isActive: this.#fields.isActive.checked,
                });
    
                this.#onSubmit.notify(newUser);
                this.#element.reset();
                this.#alert.hide();
            } catch (error) {
                this.#alert.show(
                    error instanceof Error ? error.message : 'An unexpected error occurred.',
                    Alert.types.warning
                );
            }
        });
    }

    /**
     * Gets the subscribers for the onSubmit event.
     * 
     * @returns {import("../utils/Event.js").Subscribers<[UserInsertDTO]>} The subscribers for the onSubmit event.
     */
    get onSubmit() {
        return this.#onSubmit.subscribers;
    }
}