import * as CSS from "csstype";
import { ObjectOrArray } from "./types";

export interface BaseTheme {
  breakpoints?: ObjectOrArray<number | string>;
  colors?: ObjectOrArray<CSS.ColorProperty>;
  fontSizes?: ObjectOrArray<number | string>;
  space?: ObjectOrArray<number | string>;
}

export interface Theme extends BaseTheme {
  borders?: ObjectOrArray<CSS.BorderProperty<{}>>;
  buttons?: ObjectOrArray<CSS.StandardProperties>;
  colorStyles?: ObjectOrArray<CSS.StandardProperties>;
  fontWeights?: ObjectOrArray<CSS.FontWeightProperty>;
  fonts?: ObjectOrArray<CSS.FontFamilyProperty>;
  heights?: ObjectOrArray<CSS.HeightProperty<{}>>;
  letterSpacings?: ObjectOrArray<CSS.LetterSpacingProperty<{}>>;
  lineHeights?: ObjectOrArray<CSS.LineHeightProperty<{}>>;
  maxHeights?: ObjectOrArray<CSS.HeightProperty<{}>>;
  maxWidths?: ObjectOrArray<CSS.WidthProperty<{}>>;
  minHeights?: ObjectOrArray<CSS.HeightProperty<{}>>;
  minWidths?: ObjectOrArray<CSS.WidthProperty<{}>>;
  opacity?: ObjectOrArray<CSS.GlobalsNumber>;
  radii?: ObjectOrArray<CSS.BorderRadiusProperty<{}>>;
  shadows?: ObjectOrArray<CSS.BoxShadowProperty>;
  textStyles?: ObjectOrArray<CSS.StandardProperties>;
}
