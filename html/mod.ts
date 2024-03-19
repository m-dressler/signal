import { isDynamic, OrDynamic } from "@dynamic/core";

/**
 * Parameters for {@link createElement}
 *
 * Allows you to specify initial classes, attribute, styles, all with potentially dynamic values
 * which will automatically get reflected on the element
 */
type CreateParams<
  T extends HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
> = {
  -readonly [K in keyof T]?: OrDynamic<
    K extends "style" ? Partial<T[K]> : T[K]
  >;
};

export const createElement = <T extends keyof HTMLElementTagNameMap>(
  type: T,
  params?: CreateParams<HTMLElementTagNameMap[T]>
): HTMLElementTagNameMap[T] => {
  const element = globalThis.document.createElement(type);
  if (!params) return element;

  for (const key in params) {
    const value = params[key];
    if (key === "style") {
      for (const attributeRaw in value) {
        const attribute = attributeRaw as any;
        const style = value[attribute as keyof typeof value];
        if (isDynamic<string>(style)) {
          element.style[attribute] = style.value;
          style.listen((next) => (element.style[attribute] = next));
        } else element.style[attribute] = style as string;
      }
    } else {
      if (isDynamic<any>(value)) {
        element[key] = value.value;
        value.listen((next) => (element[key] = next));
      } else element[key] = params[key] as any;
    }
  }
  return element;
};
