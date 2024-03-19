/**
 * A function that is called with the new value whenever a dynamic value updates
 */
// deno-lint-ignore no-explicit-any
type ChangeListener<T> = (next: T) => any;

/** A dynamic value which you can listen on for changes */
export type Dynamic<T> = {
  /** Symbol to identify dynamic values */
  [dynamicSymbol]: true;
  /** The current value of the dynamic value. Can be retrieved and updated normally */
  value: T;
  /** Listen to changes on the value */
  listen: (listener: ChangeListener<T>) => void;
  /** Derives another dynamic value from this one. This of this as creating a dependent value */
  derive: <U>(map: (value: T) => U) => Dynamic<U>;
};

/** Signals a value could be dynamic */
export type OrDynamic<T> = T | Dynamic<T>;

/** Symbol to identify dynamic values */
const dynamicSymbol = Symbol("dynamic");

/** Makes a value dynamic */
export const dynamic = <T>(initial: T): Dynamic<T> => {
  /** The current value stored inaccessibly so we can see whenever it gets updated */
  let value: T = initial;

  /** All the subscribers to the value */
  const listeners: ChangeListener<T>[] = [];

  return {
    [dynamicSymbol]: true,
    get value() {
      return value;
    },
    set value(next: T) {
      value = next;
      // Update all listers with the new value
      listeners.forEach((listener) => listener(next));
    },
    listen: (listener: (typeof listeners)[number]) => listeners.push(listener),
    derive: (map) => {
      const derivative = dynamic(map(value));
      // Listen to when this value changes to update dependent value
      listeners.push((next) => (derivative.value = map(next)));
      return derivative;
    },
  };
};

/** Checks if a value is dynamic */
export const isDynamic = <T>(value: unknown): value is Dynamic<T> =>
  typeof value === "object" && value !== null && dynamicSymbol in value;
