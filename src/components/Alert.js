import Throw from "../utils/Throw.js";

/**
 * @typedef {"primary" | "secondary" | "danger" | "warning" | "info" | "light" | "dark"} AlertType
 */

export default class Alert {
    /**
     * Static property to hold the valid alert types.
     * 
     * @type {Readonly<{
     *  primary: "primary",
     *  secondary: "secondary",
     *  danger: "danger",
     *  warning: "warning",
     *  info: "info",
     *  light: "light",
     *  dark: "dark" 
     * }>}
     */
    static types = Object.freeze({
        primary: 'primary',
        secondary: 'secondary',
        danger: 'danger',
        warning: 'warning',
        info: 'info',
        light: 'light',
        dark: 'dark',
    })

    /**
     * @type {HTMLElement}
     */
    #element;
    /** @type {HTMLElement} */
    #span;
    /** 
     * @type {AlertType}
     */
    #currentType = "primary";

    /**
     * Creates an instance of Alert.
     * 
     * @param {HTMLElement} element - The alert element to be managed by this class.
     * 
     * @throws {Error} If the element is not an instance of HTMLElement or if the element is not a valid Bootstrap alert.
     */
    constructor(element) {
        Throw.if(!(element instanceof HTMLElement), 'Element must be an instance of HTMLElement');

        Throw.if(!element.classList.contains('alert'),
            'Element must be a Bootstrap alert. Ensure it has the "alert" class.');

        this.#element = element;

        this.#span = this.#element.querySelector('span')
            || Throw.error('Alert element must contain a <span> for the message.');

        this.#element.addEventListener('close.bs.alert', event => {
            event.preventDefault();

            this.hide();
        });
    }

    /**
     * Shows the alert with the specified message and type.
     * 
     * @param {string} message - The message to display in the alert.
     * @param {AlertType} [newType = "primary"] - The type of alert (e.g., 'success', 'danger', 'warning').
     * 
     * @throws {Error} If the message or type is not a non-empty string.
     */
    show(message, newType = 'primary') {
        Throw.if(typeof message !== 'string' || !message.trim(),
            'Message must be a non-empty string');
            
        Throw.if(typeof newType !== 'string' || !newType.trim() || Alert.types[newType] === undefined,
            `Type must be one of the following: ${Object.keys(Alert.types).join()}`);

        this.#element.classList.remove(`alert-${this.#currentType}`);
        this.#element.classList.add(`alert-${newType}`);
        
        this.#span.textContent = message;
        
        this.#element.classList.add("show");
        this.#element.classList.remove("d-none");

        this.#currentType = newType;
    }

    /**
     * Hides the alert.
     */
    hide() {
        this.#element.classList.remove("show");
        this.#element.classList.add("d-none");
    }
}