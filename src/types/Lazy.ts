/**
 * @template TArgs The types of the arguments for the lazy function. Defaults to
 * an empty tuple, meaning the function takes no arguments.
 * @template TOut The type of the output value.
 *
 * Represents a lazy evaluation type. This type can either be a direct value of
 * type `TOut` or a function that takes arguments of type `TArgs` and returns a
 * value of type `TOut`.
 */
export type Lazy<TArgs extends unknown[] = [], TOut = unknown> =
    | TOut
    | ((...args: TArgs) => TOut);
