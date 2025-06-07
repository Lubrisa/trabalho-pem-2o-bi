import Event from '../../utils/Event.js';
import User from '../../data/User.js';
import Throw from '../../utils/Throw.js';

/**
 * Class representing a row in a users table.
 */
export default class UsersTableRow {
    /** @type {HTMLTableRowElement} */
    #element;

    /** @type {Event<[number]>} */
    #onEdit = new Event();

    /** @type {Event<[number]>} */
    #onDelete = new Event();

    /**
     * Creates an instance of UsersTableRow.
     * 
     * @param {HTMLTableRowElement} element - The table row element to be managed by this class.
     * @param {number} userId - The ID of the user represented by this row.
     */
    constructor(element, userId) {
        this.#element = element;

        /** @type {HTMLButtonElement} */
        const editBtn = this.#element.querySelector('button[data-action="edit"]')
            || Throw.error(`Edit button not found in the row for user ID ${userId}`);

        editBtn.addEventListener('click', _ => this.#onEdit.notify(userId))

        /** @type {HTMLButtonElement} */
        const deleteBtn = this.#element.querySelector('button[data-action="delete"]')
            || Throw.error(`Delete button not found in the row for user ID ${userId}`);

        deleteBtn.addEventListener('click', _ => this.#onDelete.notify(userId));
    }

    /**
     * Gets the element representing this row.
     * 
     * @return {HTMLTableRowElement} The row element.
     */
    get element() {
        return this.#element;
    }

    /**
     * Gets the subscribers for the onEdit event.
     * 
     * @return {import("../../utils/Event.js").Subscribers<[number]>} The subscribers for the onEdit event.
     */
    get onEdit() {
        return this.#onEdit.subscribers;
    }

    /**
     * Gets the subscribers for the onDelete event.
     * 
     * @return {import("../../utils/Event.js").Subscribers<[number]>} The subscribers for the onDelete event.
     */
    get onDelete() {
        return this.#onDelete.subscribers;
    }

    /**
     * Creates a new row element for a user in the users table.
     * 
     * @param {User} user - The object containing user details.
     * 
     * @returns {UsersTableRow} An object containing the created row element and events for edit and delete actions.
     */
    static create(user) {
        const element = document.createElement('tr');

        element.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.birthdate.toLocaleString()}</td>
            <td><input class="form-check-input"
                type="checkbox" disabled ${user.isActive ? 'checked' : ''}></td>
            <td>${user.createdAt.toLocaleString()}</td>
            <td>${user.updatedAt.toLocaleString()}</td>
            <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-action="edit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger" data-action="delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        return new UsersTableRow(element, user.id); 
    }
}