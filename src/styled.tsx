import React, {
  AllHTMLAttributes,
  ComponentPropsWithRef,
  ComponentType,
  forwardRef,
  FunctionComponent,
  Ref
} from "react";

import emotionStyled, {
  ComponentSelector,
  Interpolation,
  StyledOptions as EmotionStyledOptions,
  StyledTags as EmotionStyledTags
} from "@emotion/styled";
import hoistNonReactStatics from "hoist-non-react-statics";

import { composeStyleFns } from "./core";
import { ValidStyleFn } from "./types";
import { Merge, Omit } from "./utils";

type ReactClassPropKeys = keyof React.ClassAttributes<any>;

export interface StyledOptions extends EmotionStyledOptions {
  /**
   * @desc An array of style functions to apply to the top-most component in the composition.
   *
   * If not specified, `styleProps` will be automatically inherited from
   * the component it is composing from.
   */
  styleProps?: ValidStyleFn[];
}

export interface StyledProps {
  // TODO: Remove once `as` prop is added to @emotion/styled types
  as?: string | ComponentType<any>;
  ref?: Ref<any>;
  theme?: any;
}

export interface StyledComponent<Props extends Object>
  extends FunctionComponent<
      Merge<
        /**
         * Ensure that the types for style/custom props take precedence over props
         * previous compositions and the base HTML element
         */
        Omit<Props, ReactClassPropKeys>,
        StyledProps
      >
    >,
    ComponentSelector {
  /**
   * @desc An array of style functions to apply to the top-most component in the composition.
   *
   * ! Used during composition and should not be modified directly.
   *
   * Unless overridden via `styled` options, `styleProps` will be automatically
   * inherited from the component it is composing from.
   */
  styleProps?: ValidStyleFn[];
}

export interface CreateStyledComponentBase<InnerProps extends object> {
  <
    ExtraProps extends object,
    Props extends object = Merge<InnerProps, ExtraProps>
  >(
    ...styles: Array<Interpolation<Props>>
  ): StyledComponent<Props>;

  <
    ExtraProps extends object,
    Props extends object = Merge<InnerProps, ExtraProps>
  >(
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<Props>>
  ): StyledComponent<Props>;
}

/**
 * Extracts the props of a `StyledComponent` without `StyledProps`, `ref`, etc.
 */
export type PropsOf<Component> = Component extends StyledComponent<infer Props>
  ? Props
  : Component extends ComponentType<any>
  ? ComponentPropsWithRef<Component>
  : never;

/**
 * Similar to `ComponentPropsWithRef` included with @types/react
 * Extracts props from a component including `StyledProps` and `ref`.
 */
export type StyledComponentProps<Component> = Merge<
  PropsOf<Component>,
  StyledProps
>;

export interface CreateStyled {
  <Component extends ComponentType<any>>(
    Component: Component,
    options?: StyledOptions
  ): CreateStyledComponentBase<PropsOf<Component>>;

  <Tag extends string>(
    tag: Tag,
    options?: StyledOptions
  ): CreateStyledComponentBase<AllHTMLAttributes<any>>;
}

const styledBase: CreateStyled = (Component: any, options?: StyledOptions) => (
  ...args: any[]
) => {
  let styleProps: ValidStyleFn[] = [];

  if (options !== undefined && options.styleProps) {
    // If the user specifies styleProps in the options, use them
    ({ styleProps } = options);
  } else if (Component.styleProps !== undefined) {
    // else try to inherit the from the component it is composing
    ({ styleProps } = Component);
  }

  /**
   * Compose the style functions into a single style function
   */
  const composedStyleProps = composeStyleFns(...styleProps);

  const ForwardedRefComponent =
    typeof Component === "string"
      ? (Component as keyof EmotionStyledTags<any>)
      : (forwardRef<any, any>(function(props, ref) {
          /**
           * The `composed` prop needs to be set on all components below the
           * top-most component in the composition. This ensures that
           * `styleProps` aren't applied to them
           */
          return <Component {...props} ref={ref} composed />;
        }) as typeof Component);

  const ComposedComponent = emotionStyled(ForwardedRefComponent, options)(
    ...args,
    // If a component is a composition, only apply styleProps to the top-level component
    // Appending styleProps to the end ensures that style props take precedence
    props =>
      (props as any).composed === true ? null : composedStyleProps(props)
  );

  (ComposedComponent as any).styleProps = styleProps;

  /**
   * Hoist non-react statics to ensure that properties like `styleProps` or those
   * required by some 3rd party components are preserved
   */
  hoistNonReactStatics(ComposedComponent, Component);

  ComposedComponent.displayName = `DSLibStyled(${
    typeof Component === "string" ? Component : Component.displayName
  })`;

  return ComposedComponent;
};

// call bind to prevent mutation of the original function
export const styled: CreateStyled = (styledBase as any).bind();
