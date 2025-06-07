import Throw from "./Throw.js";

/**
 * @template {unknown[]} T
 * @typedef {import("../types/Event.ts").Subscriber<T>} Subscriber
 */

/**
 * @template {unknown[]} T
 * @typedef {import("../types/Event.ts").Subscribers<T>} Subscribers
 */

/**
 * @template {unknown[]} T A tuple representing the arguments that the
 * subscribers will receive when the event is triggered.
 *
 * Event class for managing subscribers and notifying them of events.
 */
export default class Event {
    /** @type {Subscriber<T>[]} */
    #subscribers = [];

    /**
     * Gets a collection that allows subscribing and unsubscribing to the
     * event.
     *
     * @returns {Subscribers<T>} A view to manage subscribers.
     */
    get subscribers() {
        return {
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this),
            all: () => [...this.#subscribers]
        };
    }

    /**
     * Subscribes a callback function to the event.
     *
     * @param {Subscriber<T>} subscriber The function to be called when the
     * event is triggered.
     *
     * @throws {Error} If `subscriber` is not a function.
     */
    subscribe(subscriber) {
        Throw.if(typeof subscriber !== 'function', 'Callback must be a function');

        this.#subscribers.push(subscriber);
    }

    /**
     * Unsubscribes a callback function from the event.
     *
     * @param {Subscriber<T>} subscriber The function to be removed from the
     * subscribers list.
     *
     * @return {boolean} Returns true if the `subscriber` was successfully
     * removed, false otherwise.
     *
     * @throws {Error} If `subscriber` is not a function.
     */
    unsubscribe(subscriber) {
        Throw.if(typeof subscriber !== 'function', 'Callback must be a function');

        const index = this.#subscribers.indexOf(subscriber);
        
        if (index === -1)
            return false;
            
        this.#subscribers.splice(index, 1);
        return true;
    }   

    /**
     * Notifies all subscribers of the event, passing the provided data to them.
     *
     * @param {T} data The data to be passed to the subscribers.
     *
     * @throws {Error} If an error occurs in a subscriber's callback.
     */
    notify(...data) {
        this.#subscribers.forEach(callback => {
            try {
                callback(...data);
            } catch (error) {
                throw new Error(
                    `Error in subscriber callback: ${error instanceof Error ? error.message : String(error)}
                    Please ensure the callback handles errors gracefully, not allowing then to propagate.`,
                    { cause: error }
                );
            }
        });
    }
}
