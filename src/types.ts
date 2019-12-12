import { Theme } from "./theme";
import { Omit } from "./utils";

export type ObjectOrArray<T> = T[] | { [K: string]: T | ObjectOrArray<T> };

export type TLengthStyledSystem = string | 0 | number;

export type ResponsiveValue<T> = T | Array<T | null> | { [key: string]: T };

export type DynamicProp<PropName extends string, PropValue> = {
  [p in PropName]: PropValue
};

export type InternalStyleFnProps<
  PropValue,
  PropName extends string,
  AliasName extends string = PropName
> = Partial<
  DynamicProp<PropName, ResponsiveValue<PropValue>> &
    DynamicProp<AliasName, ResponsiveValue<PropValue>> & { theme?: Theme }
>;

export type MappedStyleFn<
  MappedProps = any,
  Fn extends ValidStyleFn = any
> = (
  props: MappedProps & StyleFnProps<Fn> & { theme?: Theme }
) => ReturnType<StyleFn> | ReturnType<StyleFn>[];

export interface StyleFn<
  PropValue = any,
  PropName extends string = any,
  AliasName extends string = PropName
> {
  (props: InternalStyleFnProps<PropValue, PropName, AliasName>): {
    [cssProp: string]: string;
  } | null;
}

export type ValidStyleFn = MappedStyleFn | StyleFn;

export type StyleFnProps<Fn extends ValidStyleFn> = Omit<
  Parameters<Fn>[0],
  "theme"
>;
