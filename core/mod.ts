/**
 * A function that is called with the new value whenever a Signal's value updates
 */
// deno-lint-ignore no-explicit-any
type ChangeListener<T> = (next: T) => any;

/** A Signal which you can listen on for changes */
export type Signal<T> = {
  /** Symbol to identify Signals */
  [signalSymbol]: true;
  /** The current value of the Signal. Can be retrieved and updated normally */
  value: T;
  /** Listen to changes on the value */
  listen: (listener: ChangeListener<T>) => void;
  /** Derives another Signal from this one. This of this as creating a dependent value */
  derive: <U>(map: (value: T) => U) => Signal<U>;
};

/** Signals a value could be a Signal */
export type OrSignal<T> = T | Signal<T>;

/** Symbol to identify Signals */
const signalSymbol = Symbol("Signal");

/** Creates a new Signal */
export const Signal = <T>(initial: T): Signal<T> => {
  /** The current value stored inaccessibly so we can see whenever it gets updated */
  let value: T = initial;

  /** All the subscribers to the value */
  const listeners: ChangeListener<T>[] = [];

  return {
    [signalSymbol]: true,
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
      const derivative = Signal(map(value));
      // Listen to when this value changes to update dependent value
      listeners.push((next) => (derivative.value = map(next)));
      return derivative;
    },
  };
};

/** Checks if a value is a Signal */
export const isSignal = <T>(value: unknown): value is Signal<T> =>
  typeof value === "object" && value !== null && signalSymbol in value;
