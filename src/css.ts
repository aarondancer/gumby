import { get } from "./core";
import { Theme } from "./theme";
import { StyleFnProps, ValidStyleFn } from "./types";

export const createCSS = <
  FnArgs extends StyleFnProps<Fn>,
  Fn extends ValidStyleFn = any
>(
  defaultThemeOrFn: Theme | Fn = {},
  ...funcs: Fn[]
) => {
  type Args = FnArgs & { [cssProperty: string]: any };
  type CssGetFn = (path: string, defaultValue?: any) => ReturnType<typeof get>;
  type DynamicArgsFn = (
    cssGet: CssGetFn,
    subCss: (args: Args) => (themeOrProps: Theme | Args) => any,
    theme: Theme
  ) => Args;

  let defaultTheme: Theme;

  if (typeof defaultThemeOrFn === "function") {
    defaultTheme = {};
    funcs.unshift(defaultThemeOrFn);
  } else {
    defaultTheme = defaultThemeOrFn;
  }

  const css = (argsOrFn: Args | DynamicArgsFn) => (
    themeOrProps: Theme | Args = defaultTheme
  ) => {
    const theme: Theme = (themeOrProps as any).theme || themeOrProps;

    const cssGet = (path: string, defaultValue?: any) =>
      get(theme, path, defaultValue);

    const subCss = (...args: Parameters<typeof css>): any =>
      css(...args)(theme);

    const args: Args =
      typeof argsOrFn === "function"
        ? argsOrFn(cssGet, subCss, theme)
        : argsOrFn;

    const argsWithTheme: Args & {
      theme?: Theme;
    } = { ...args, theme };

    type ValueType = (Fn extends ValidStyleFn ? ReturnType<Fn> : Fn) | Args;

    const values: Array<ValueType | any> = [args];

    // Execute all style functions
    for (let f = 0; f < funcs.length; f++) {
      const fn = funcs[f];
      const value = fn(argsWithTheme);

      if (
        value !== undefined &&
        value !== null &&
        // Filter out empty arrays
        (Array.isArray(value) === true ? (value.length as any) !== 0 : true)
      ) {
        // console.log("Final value", value);
        values.push(value as ValueType);
      }
    }

    // Recurse through objects
    const argKeys = Object.keys(args);

    for (let a = 0; a < argKeys.length; a++) {
      const argName = argKeys[a];
      const argValue = args[argName];

      if (typeof argValue === "object" && Array.isArray(argValue) === false) {
        values.push({ [argName]: subCss(argValue) });
      }
    }

    return values.length === 0 ? values[0] : values;
  };

  return css;
};
