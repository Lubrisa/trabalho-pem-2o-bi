import Event from "../../utils/Event.js";
import User from "../../data/User.js";
import UsersTableRow from "./UsersTableRow.js";
import Throw from "../../utils/Throw.js";
import UserInsertDTO from "../../data/UserInsertDTO.js";
import UserUpdateDTO from "../../data/UserUpdateDTO.js";

/**
 * Class representing the body of a table that displays information about users.
 * 
 * @remarks
 * This class manages both the data and the DOM representation of the users table body.
 * This isn't the best practice, the data manipulation and the presentation should be separated.
 * However, for the sake of simplicity, this class does both.
 */
export default class UsersTableBody {
    /** @type {number} */
    #sequence = 1;
    /** @type {User[]} */
    #users = [];

    /** @type {HTMLTableSectionElement} */
    #element;

    /** @type {Event<[User]>} */
    #onInsert = new Event();

    /** @type {Event<[User]>} */
    #onEdit = new Event();

    /** @type {Event<[User, User]>} */
    #onUpdate = new Event();

    /** @type {Event<[User]>} */
    #onDelete = new Event();

    /**
     * Creates an instance of UsersTableBody.
     * 
     * @param {HTMLTableSectionElement} element - The table body element to be managed by this class.
     * 
     * @throws {Error} If the element is not an instance of HTMLTableSectionElement.
     */
    constructor(element) {
        Throw.if(!(element instanceof HTMLTableSectionElement),
            'Element must be an instance of HTMLTableSectionElement');

        this.#element = element;
    }

    /**
     * Gets the subscribers for the onInsert event.
     * 
     * @returns {import("../../utils/Event.js").Subscribers<[User]>} The subscribers for the onInsert event.
     */
    get onInsert() {
        return this.#onInsert.subscribers;
    }

    /**
     * Gets the subscriberts for the onEdit event.
     * 
     * @returns {import("../../utils/Event.js").Subscribers<[User]>} The subscribers for the onEdit event.
     */
    get onEdit() {
        return this.#onEdit.subscribers;
    }

    /**
     * Gets the subscribers for the onUpdate event.
     * 
     * @returns {import("../../utils/Event.js").Subscribers<[User, User]>} The subscribers for the onUpdate event.
     */
    get onUpdate() {
        return this.#onUpdate.subscribers;
    }

    /**
     * Gets the subscribers for the onDelete event.
     * 
     * @returns {import("../../utils/Event.js").Subscribers<[User]>} The subscribers for the onDelete event.
     */
    get onDelete() {
        return this.#onDelete.subscribers;
    }

    renderPlaceholder() {
        const placeholder = document.createElement('tr');

        placeholder.classList.add('empty-row');
        placeholder.innerHTML = '<td colspan="8" class="fs-3 text-center">No momento não há usuários cadastrados.</td>';
        
        this.#element.appendChild(placeholder);
    }

    erasePlaceholder() {
        const placeholder = this.#element.querySelector('tr.empty-row');

        if (placeholder)
            this.#element.removeChild(placeholder);
    }

    /**
     * Erases a user from the table body.
     * 
     * @param {number} userId - The ID of the user to be erased. 
     * 
     * @returns {boolean} Returns true if the user was found and erased, false otherwise.
     */
    erase(userId) {
        const userIndex = this.#users.findIndex(user => user.id === userId);

        if (userIndex === -1)
            return false;

        const user = this.#users[userIndex];

        this.#element.removeChild(this.#element.children[userIndex] || Throw.error(`User with ID ${userId} not found in the table body`));
        
        this.#users.splice(userIndex, 1);

        if (this.#users.length === 0)
            this.renderPlaceholder();

        this.#onDelete.notify(user);

        return true;
    }

    /**
     * Creates a new table row for a user and sets up event listeners for edit and delete actions.
     * 
     * @param {User} user - The user object containing user details.
     * 
     * @returns {HTMLElement} The created table row element.
     */
    #createRow(user) {
        const row = UsersTableRow.create(user);
        
        row.onEdit.subscribe(userId => {
            const user = this.#users.find(user => user.id === userId);

            if (user === undefined) return;

            this.#onEdit.notify(user);
        });

        row.onDelete.subscribe(userId => {
            this.erase(userId);
        });

        return row.element;
    }

    /**
     * Adds a new user to the table body.
     * 
     * @param {import("../../data/UserInsertDTO.js").default} userInsertDTO - The data transfer object containing user details to be added.
     * 
     * @returns {User} The newly created user object.
     * 
     * @throws {Error} If `userInsertDTO` is not an instance of `UserInsertDTO`.
     */
    append(userInsertDTO) {
        Throw.if(!(userInsertDTO instanceof UserInsertDTO),
            'userInsertDTO must be an instance of UserInsertDTO');

        const now = new Date();
        const user = userInsertDTO.toUser({
            id: this.#sequence++,
            createdAt: now,
            updatedAt: now
        });

        const row = this.#createRow(user);

        this.#users.push(user);
        this.#element.appendChild(row);
        
        if (this.#users.length === 1)
            this.erasePlaceholder();

        this.#onInsert.notify(user);

        return user;
    }

    /**
     * Updates an existing user in the table body.
     * 
     * @param {number} userId The ID of the user to be updated.
     * @param {UserUpdateDTO} userUpdateDTO The data transfer object containing the updated user details.
     * 
     * @returns A boolean indicating whether the update was successful.
     */
    update(userId, userUpdateDTO) {
        Throw.if(typeof userId !== 'number' || isNaN(userId) || userId <= 0,
            'userId must be a positive number');

        Throw.if(!(userUpdateDTO instanceof UserUpdateDTO),
            'userUpdateDTO must be an instance of UserUpdateDTO');

        const userIndex = this.#users.findIndex(user => user.id === userId);

        if (userIndex === -1)
            return false;

        const userCurrentState = this.#users[userIndex];
        const userUpdated = userUpdateDTO.applyTo(userCurrentState)
        
        this.#element.replaceChild(
            this.#createRow(userUpdated),
            this.#element.children[userIndex] || Throw.error(`User with ID ${userId} not found in the table body`)
        );
        
        this.#users[userIndex] = userUpdated;

        this.#onUpdate.notify(userCurrentState, userUpdated);

        return true;
    }
}
