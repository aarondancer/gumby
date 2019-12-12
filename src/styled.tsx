import React, { AllHTMLAttributes } from "react";

import emotionStyled, {
  ComponentSelector,
  Interpolation,
  StyledOptions as EmotionStyledOptions,
  StyledTags as EmotionStyledTags,
  WithTheme
} from "@emotion/styled";
import { PropsOf } from "@emotion/styled-base/types/helper";
import hoistNonReactStatics from "hoist-non-react-statics";

import { composeStyleFns } from "./core";
import { ValidStyleFn } from "./types";
import { Merge } from "./utils";

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

export interface StyledProps<Theme extends object = any> {
  // TODO: Remove once `as` prop is added to @emotion/styled types
  as?: string | React.ComponentType<any>;
  theme?: Theme;
}

// Forked from @emotion/styled-base types
export interface StyledComponent<
  InnerProps extends object,
  StyleProps,
  Theme extends object
>
  extends React.FC<Merge<Merge<InnerProps, StyleProps>, StyledProps<Theme>>>,
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

// Forked from @emotion/styled-base types
export interface CreateStyledComponentBase<
  InnerProps extends object,
  ExtraProps,
  Theme extends object
> {
  <
    StyleProps extends Omit<ExtraProps, ReactClassPropKeys> = Omit<
      ExtraProps,
      ReactClassPropKeys
    >
  >(
    ...styles: Array<Interpolation<WithTheme<StyleProps, Theme>>>
  ): StyledComponent<
    InnerProps,
    /**
     * Ensure that the types for style/custom props take precedence over props
     * previous compositions and the base HTML element
     */
    Omit<Merge<InnerProps, StyleProps>, ReactClassPropKeys>,
    Theme
  >;

  <
    StyleProps extends Omit<ExtraProps, ReactClassPropKeys> = Omit<
      ExtraProps,
      ReactClassPropKeys
    >
  >(
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<WithTheme<StyleProps, Theme>>>
  ): StyledComponent<
    InnerProps,
    Omit<Merge<InnerProps, StyleProps>, ReactClassPropKeys>,
    Theme
  >;
}

// Forked from @emotion/styled-base types
export interface CreateStyledComponentIntrinsic<
  ExtraProps,
  Theme extends object
>
  extends CreateStyledComponentBase<
    Omit<AllHTMLAttributes<any>, keyof ExtraProps>,
    ExtraProps,
    Theme
  > {}

// Forked from @emotion/styled-base types
export interface CreateStyledComponentExtrinsic<
  Tag extends React.ComponentType<any>,
  ExtraProps,
  Theme extends object
> extends CreateStyledComponentBase<PropsOf<Tag>, ExtraProps, Theme> {}

// Forked from @emotion/styled-base types
export interface CreateStyled<Theme extends object = any> {
  <Tag extends React.ComponentType<any>, ExtraProps = {}>(
    tag: Tag,
    options?: StyledOptions
  ): CreateStyledComponentExtrinsic<Tag, ExtraProps, Theme>;

  <Tag extends string, ExtraProps = {}>(
    tag: Tag,
    options?: StyledOptions
  ): CreateStyledComponentIntrinsic<ExtraProps, Theme>;
}

const styledBase: CreateStyled = (Component: any, options?: StyledOptions) => (
  ...args: any[]
) => {
  let styleProps: ValidStyleFn[] = [];

  if (options !== undefined && options.styleProps !== undefined) {
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
      : (React.forwardRef(function(
          props: React.ComponentProps<typeof Component>,
          ref
        ) {
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
  const WithHoistedStatics = hoistNonReactStatics(ComposedComponent, Component);

  WithHoistedStatics.displayName = `gumbyStyled(${
    typeof Component === "string" ? Component : WithHoistedStatics.displayName
  })`;

  return WithHoistedStatics;
};

// call bind to prevent mutation of the original function
export const styled: CreateStyled = (styledBase as any).bind();
