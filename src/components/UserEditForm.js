import User from "../data/User.js";
import UserUpdateDTO from "../data/UserUpdateDTO.js";
import Event from "../utils/Event.js";
import Throw from "../utils/Throw.js";
import Alert from "./Alert.js";

/**
 * @typedef {object} UserEditModalFormFields
 * @property {HTMLInputElement} name - The input field for the user's name.
 * @property {HTMLInputElement} email - The input field for the user's email.
 * @property {HTMLInputElement} birthdate - The input field for the user's birthdate.
 * @property {HTMLInputElement} isActive - The checkbox input for the user's active status.
 */

/**
 * Class representing a user edit modal form.
 */
export default class UserEditModalForm {
    /** @type {HTMLFormElement} */
    #element;
    /** @type {Alert} */
    #alert;

    /** @type {Event<[number, UserUpdateDTO]>} */
    #onSave = new Event();

    /** @type {UserEditModalFormFields} */
    #fields;

    /** @type {number | undefined} */
    #userUpdatingId;

    /**
     * Creates an instance of UserEditModalForm.
     * 
     * @param {HTMLFormElement} element The form element to be managed by this class.
     * 
     * @throws {Error} If the element is not an instance of HTMLFormElement.
     * @throws {Error} If any of the required fields are not found in the modal or are not instances of HTMLInputElement.
     */
    constructor(element) {
        Throw.if(!(element instanceof HTMLFormElement),
            'Element must be an instance of HTMLFormElement');

        this.#element = element;

        this.#fields = {
            name: this.#element.querySelector('input#edit-user-name-input')
                    || Throw.error('Field edit-user-name-input not found in the modal'),
            email: this.#element.querySelector('input#edit-user-email-input')
                    || Throw.error('Field edit-user-email-input not found in the modal'),
            birthdate: this.#element.querySelector('input#edit-user-birthdate-input')
                    || Throw.error('Field edit-user-birthdate-input not found in the modal'),
            isActive: this.#element.querySelector('input#edit-user-active-input')
                    || Throw.error('Field edit-user-active-input not found in the modal'),
        };

        this.#alert = new Alert(
            this.#element.querySelector('[data-role="validation-warning"')
            || Throw.error('Validation warning element not found in the modal')
        );

        this.#element.addEventListener('submit', event => {
            event.preventDefault();

            if (this.#userUpdatingId === undefined) {
                this.#alert.show('No user is being updated.', Alert.types.warning);
                return;
            }

            try {
                const updatedUser = UserUpdateDTO.fromObject({
                    name: this.#fields.name.value,
                    email: this.#fields.email.value,
                    birthdate: new Date(this.#fields.birthdate.value),
                    isActive: this.#fields.isActive.checked,
                });

                this.#onSave.notify(this.#userUpdatingId, updatedUser);
                this.#alert.hide();
            } catch (error) {
                this.#alert.show(
                    error instanceof Error ? error.message : String(error),
                    Alert.types.warning
                );
            }
        });
    }

    /**
     * Gets the subscribers for the onSave event.
     * 
     * @returns {import("../utils/Event.js").Subscribers<[number, UserUpdateDTO]>} The subscribers for the onSave event.
     */
    get onSave() {
        return this.#onSave.subscribers;
    }

    /**
     * @param {User} user - The user data to load into the form.
     */ 
    load(user) {
        Throw.if(!(user instanceof User), 'User must be an instance of User');

        this.#alert.hide();

        this.#userUpdatingId = user.id;
        this.#fields.name.value = user.name;
        this.#fields.email.value = user.email;
        this.#fields.birthdate.value = user.birthdate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        this.#fields.isActive.checked = user.isActive;
    }
}