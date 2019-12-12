import {
  InternalStyleFnProps,
  MappedStyleFn,
  ObjectOrArray,
  StyleFn,
  ValidStyleFn
} from "./types";

export const defaultBreakpoints = ["40em", "52em", "64em"];

export function get(
  obj: any,
  key: string | number | undefined,
  defaultValue?: any
) {
  let depth = 0;
  let value = obj;
  const keys = String(key).split(".");
  while (value && depth < keys.length) {
    value = value[keys[depth++]];
  }
  return value === undefined || depth < keys.length ? defaultValue : value;
}

export const themeGet = (path: string, fallback?: string) => (props: any) =>
  get(props.theme, path, fallback);

/**
 * Returns the pixel value of a number or the argument passed
 *
 * @param n
 */
export const px = (n: number | string) =>
  typeof n === "number" && isNaN(n) === false && n !== 0 ? `${n}px` : n;

export const createMediaQuery = (n: number | string) =>
  `@media screen and (min-width: ${px(n)})`;

/**
 * Default transform for style functions.
 * Returns the value within a given scale or a default value.
 *
 * @param n
 * @param scale
 */
const getValue = (n: number | string, scale: any) => get(scale, n, n);

export interface LowLevelStylefunctionArguments {
  /** the name of the style prop to add */
  prop: string;
  /** the name of the CSS property to apply values to */
  cssProperty?: string;
  /** an alias for the style prop */
  alias?: string;
  /** the key to lookup values for within the theme */
  key?: string;
  /** customer getter function */
  getter?: () => any;
  /** custom transform to derive the applied CSS value */
  transformValue?: (n: string | number, scale?: any) => any;
  /** set of values to lookup actual value */
  scale?: ObjectOrArray<string | number>;
}

/**
 * Creates a style function for use in Emotion styled components.
 *
 * The style function will add support to the component for the prop specified.
 *
 * @param {LowLevelStylefunctionArguments} options - Options for initializing style function
 * @returns {Function} - Style function for use with creating styled components
 */
export const style = <
  PropValue,
  PropName extends string,
  AliasName extends string = PropName
>({
  prop,
  cssProperty,
  alias,
  key,
  transformValue = getValue,
  scale: defaultScale = {}
}: LowLevelStylefunctionArguments): StyleFn<PropValue, PropName, AliasName> => {
  const property = cssProperty || prop;
  const func = (
    props: InternalStyleFnProps<PropValue, PropName, AliasName>
  ) => {
    let value = get(props, prop);

    if (value === undefined) {
      value = get(props, alias);
    }

    if (value === undefined) {
      return null;
    }

    const scale = get(props.theme, key, defaultScale);

    const createStyle = (n: string | number) =>
      n !== undefined && n !== null
        ? {
            [property]: transformValue(n, scale)
          }
        : null;

    if (typeof value !== "object" || value === null) {
      return createStyle(value);
    }

    const breakpoints = get(props.theme, "breakpoints", defaultBreakpoints);
    const styles = [];

    if (Array.isArray(value) === true) {
      styles.push(createStyle(value[0]));
      for (let i = 1; i < value.slice(0, breakpoints.length + 1).length; i++) {
        const rule = createStyle(value[i]);
        if (rule) {
          const media = createMediaQuery(breakpoints[i - 1]);
          styles.push({ [media]: rule });
        }
      }
    } else {
      const keys = Object.keys(value);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const breakpoint = breakpoints[key];
        const media = createMediaQuery(breakpoint);
        const rule = createStyle(value[key]);

        if (!breakpoint) {
          styles.unshift(rule);
        } else {
          styles.push({ [media]: rule });
        }
      }
      styles.sort();
    }

    return styles;
  };

  return func;
};

/**
 * Composes a series of style functions into a single style function
 *
 * @name compose
 * @param funcs
 */
export function composeStyleFns<Fn extends ValidStyleFn = any>(
  ...funcs: Fn[]
) {
  const func = (props: any) => {
    const values: ReturnType<Fn>[] = [];

    for (let i = 0; i < funcs.length; i++) {
      const fn = funcs[i];
      const value = fn(props);

      if (
        value !== undefined &&
        value !== null &&
        // TS is incorrectly infering that .length is string | number
        (Array.isArray(value) === true ? (value.length as any) !== 0 : true)
      ) {
        values.push(value as ReturnType<Fn>);
      }
    }

    return values;
  };

  return func;
}

interface Mapper<MappedProps> {
  (props: any): MappedProps;
}

/**
 * Creates a style function that maps props according to a provided mapper
 * and passes the mapped props to the provided style function
 *
 * @param mapper - function that re-maps given props
 * @returns {Function} - style function with properties mapped
 */
export const mapProps = <
  MappedProps = any,
  Fn extends ValidStyleFn = any
>(
  mapper: Mapper<MappedProps>,
  styleFn: Fn
): MappedStyleFn<MappedProps, Fn> => (props: any) => styleFn(mapper(props));

export interface VariantArgs<PropName extends string = "variant"> {
  key: string;
  prop?: PropName;
}

/**
 * Creates style function that enables styled components to support the specified
 * variant prop within the theme
 *
 * @param {VariantArgs}
 * @returns {Function} - styled function
 */
export const variant = <PropValues = any, PropName extends string = "variant">({
  key,
  prop
}: VariantArgs<PropName>): StyleFn<PropValues, PropName> => {
  const fn = (props: InternalStyleFnProps<PropValues, PropName>) =>
    get(props.theme, [key, (props as any)[prop || "variant"]].join("."));

  return fn;
};

/**
 * Returns the styles from the theme for a given key
 *
 * @param key
 */
export const themed = (key: string) => (props: any) =>
  props.theme && props.theme[key];
