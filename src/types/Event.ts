/**
 * @template {unknown[]} T The type of the payload that the subscriber will receive.
 *
 * A function that will be called when the event is triggered. It receives the
 * data passed to the event.
 */
export type Subscriber<T extends unknown[]> = (...payload: T) => void;

/**
 * @template {unknown[]} T The type of the payload that the subscriber will receive.
 * 
 * A collection of subscribers to an event.
 */
export type Subscribers<T extends unknown[]> = {
    /**
     * @param {Subscriber<T>} subscriber A function that will be called when the event is triggered. 
     */
    subscribe: (subscriber: Subscriber<T>) => void;
    /**
     * @param {Subscriber<T>} subscriber A function that will be called when the event is triggered.
     * 
     * @returns {boolean} Returns true if the subscriber was successfully removed, false otherwise.
     */
    unsubscribe: (subscriber: Subscriber<T>) => boolean;
    /**
     * Gets all subscribers.
     */
    all: Subscriber<unknown[]>;
};