import { Dynamic, isDynamic, OrDynamic, dynamic } from "@dynamic/core";

/** Variables to be replaced in the translated value which can be specified using {}, e.g.: "Hello {name}!" */
export type Variables = Record<string, OrDynamic<string | number>>;

/**
 * The translate function returned by i18n
 *
 * Returns a string if no dynamic variables are passed or a string which is also a dynamic if a dynamic variable was found.
 */
export type Translate = (
  key: string,
  variables?: Variables
) => string | (string & Dynamic<string>);

/** A mapping from language to translation map */
export type Translations = { [key: string]: Translation };
/** A map of keys and their (dynamic) values in that language */
export type Translation = {
  [key: string]: string | Translation;
};

/** Replaces all the variables in the templated string */
const replaceVariables = (
  str: string,
  variables: Variables
): {
  updated: string;
  dynamics: Set<Dynamic<string | number>>;
} => {
  const dynamics = new Set<Dynamic<string | number>>();

  // A small replace all function since this package will be SUPER famous and used across the oldest browsers in the world
  for (let i = 0; i < str.length; ++i) {
    if (str[i] !== "{") continue;
    for (let j = i + 1; j < str.length; ++j) {
      if (str[j] !== "}") continue;

      const key = str.substring(i + 1, j).trim();
      const value = variables[key];
      // Ignore any "{ABC}" expressions w/o variables
      if (!value) continue;

      if (isDynamic(value)) dynamics.add(value);

      // Convert dynamic to value and value to string
      const stringValue = (isDynamic(value) ? value.value : value) + "";
      // Replace the expressing with the value or the dynamic's value
      str = str.substring(0, i) + stringValue + str.substring(j + 1);
      // We removed j - i characters while adding stringValue.length characters
      i = i - (j - i) + stringValue.length;
    }
  }

  return { updated: str, dynamics };
};

/** Creates a new instance of an internationalization function with the provided language's translations */
export const i18n = (translation: Translation): { t: Translate } => ({
  t: (key, variables) => {
    const path = key.split(".");
    const value = path.reduce<string | Translation | undefined>(
      (scope, key) => {
        if (typeof scope !== "object") return void 0;
        else return scope[key];
      },
      translation
    );
    if (typeof value !== "string") return key;

    if (!variables) return value;

    const { updated, dynamics } = replaceVariables(value, variables);
    // If no dynamics were used return normal string
    if (!dynamics.size) return updated;

    const asDynamic = dynamic(updated);
    // Whenever a dynamic changes, recompute the string and update this dynamic
    dynamics.forEach((dynamic) =>
      dynamic.listen(() => {
        asDynamic.value = replaceVariables(value, variables).updated;
      })
    );
    // Keep it as a string for expected functionality but also make it the
    // dynamic version of the string if the recipient supports it
    return Object.assign(updated, asDynamic);
  },
});
