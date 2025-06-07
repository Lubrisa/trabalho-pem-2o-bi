/**
 * Validation type for representing a successful validation.
 */
export type Success<T> = {
    data: T;
    isSuccess: true;
    isFailure: false;
};

/**
 * Validation type for representing a failed validation.
 */
export type Failure = {
    errors: string[];
    isSuccess: false;
    isFailure: true;
};
