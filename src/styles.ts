import * as CSS from "csstype";

import { composeStyleFns, get, mapProps, px, style } from "./core";
import { StyleFnProps, TLengthStyledSystem } from "./types";

export const getPx = (n: string | number | undefined, scale: any) =>
  px(get(scale, n, n));

// #region space
const spaceScale = [0, 4, 8, 16, 32, 64, 128, 256, 512];

const getSpace = (n: string | number | undefined, scale: any) => {
  if (n === undefined) {
    return;
  }

  if (typeof n === "string") {
    const isNegative = n[0] === "-";
    const key = n.slice(1);
    const value = get(scale, key, n);

    return px(isNegative === true ? "-" + value : value);
  }

  if (typeof n === "number" && isNaN(n) === false) {
    const isNegative = n < 0;
    const absolute = Math.abs(n);
    const value = get(scale, absolute, n);

    if (typeof value === "string") {
      return isNegative === true ? "-" + value : value;
    }

    return px(value * (isNegative === true ? -1 : 1));
  }

  return px(get(scale, n, n));
};

export const margin = style<
  CSS.MarginProperty<TLengthStyledSystem>,
  "margin",
  "m"
>({
  prop: "margin",
  alias: "m",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface MarginProps extends StyleFnProps<typeof margin> {}

export const marginTop = style<
  CSS.MarginTopProperty<TLengthStyledSystem>,
  "marginTop",
  "mt"
>({
  prop: "marginTop",
  alias: "mt",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface MarginTopProps extends StyleFnProps<typeof marginTop> {}

export const marginBottom = style<
  CSS.MarginBottomProperty<TLengthStyledSystem>,
  "marginBottom",
  "mb"
>({
  prop: "marginBottom",
  alias: "mb",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface MarginBottomProps extends StyleFnProps<typeof marginBottom> {}

export const marginLeft = style<
  CSS.MarginLeftProperty<TLengthStyledSystem>,
  "marginLeft",
  "ml"
>({
  prop: "marginLeft",
  alias: "ml",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface MarginLeftProps extends StyleFnProps<typeof marginLeft> {}

export const marginRight = style<
  CSS.MarginRightProperty<TLengthStyledSystem>,
  "marginRight",
  "mr"
>({
  prop: "marginRight",
  alias: "mr",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface MarginRightProps extends StyleFnProps<typeof marginRight> {}

export const padding = style<
  CSS.PaddingProperty<TLengthStyledSystem>,
  "padding",
  "p"
>({
  prop: "padding",
  alias: "p",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface PaddingProps extends StyleFnProps<typeof padding> {}

export const paddingTop = style<
  CSS.PaddingTopProperty<TLengthStyledSystem>,
  "paddingTop",
  "pt"
>({
  prop: "paddingTop",
  alias: "pt",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface PaddingTopProps extends StyleFnProps<typeof paddingTop> {}

export const paddingBottom = style<
  CSS.PaddingBottomProperty<TLengthStyledSystem>,
  "paddingBottom",
  "pb"
>({
  prop: "paddingBottom",
  alias: "pb",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface PaddingBottomProps
  extends StyleFnProps<typeof paddingBottom> {}

export const paddingLeft = style<
  CSS.PaddingLeftProperty<TLengthStyledSystem>,
  "paddingLeft",
  "pl"
>({
  prop: "paddingLeft",
  alias: "pl",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface PaddingLeftProps extends StyleFnProps<typeof paddingLeft> {}

export const paddingRight = style<
  CSS.PaddingRightProperty<TLengthStyledSystem>,
  "paddingRight",
  "pr"
>({
  prop: "paddingRight",
  alias: "pr",
  key: "space",
  transformValue: getSpace,
  scale: spaceScale
});

export interface PaddingRightProps extends StyleFnProps<typeof paddingRight> {}

export interface SpaceBaseProps
  extends MarginProps,
    MarginTopProps,
    MarginBottomProps,
    MarginLeftProps,
    MarginRightProps,
    PaddingProps,
    PaddingTopProps,
    PaddingBottomProps,
    PaddingLeftProps,
    PaddingRightProps {}
interface SpaceMappedProps {
  my?: MarginTopProps["mt"] | MarginBottomProps["mb"];
  mx?: MarginLeftProps["ml"] | MarginRightProps["mr"];
  py?: PaddingTopProps["pt"] | PaddingBottomProps["pb"];
  px?: PaddingLeftProps["pl"] | PaddingRightProps["pr"];
}

export const space = mapProps<SpaceMappedProps & SpaceBaseProps>(
  props => ({
    ...props,
    marginTop:
      props.my === undefined || props.my === null ? props.marginTop : props.my,
    marginBottom:
      props.my === undefined || props.my === null
        ? props.marginBottom
        : props.my,
    marginLeft:
      props.mx === undefined || props.mx === null ? props.marginLeft : props.mx,
    marginRight:
      props.mx === undefined || props.mx === null
        ? props.marginRight
        : props.mx,
    paddingTop:
      props.py === undefined || props.py === null ? props.paddingTop : props.py,
    paddingBottom:
      props.py === undefined || props.py === null
        ? props.paddingBottom
        : props.py,
    paddingLeft:
      props.px === undefined || props.px === null
        ? props.paddingLeft
        : props.px,
    paddingRight:
      props.px === undefined || props.px === null
        ? props.paddingRight
        : props.px
  }),
  composeStyleFns(
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight
  )
);

export interface SpaceProps extends StyleFnProps<typeof space> {}

// #endregion

// #region typography

export const textColor = style<CSS.ColorProperty, "color">({
  prop: "color",
  key: "colors"
});

export interface TextColorProps extends StyleFnProps<typeof textColor> {}

export const fontSize = style<
  CSS.FontSizeProperty<TLengthStyledSystem>,
  "fontSize"
>({
  prop: "fontSize",
  key: "fontSizes",
  transformValue: getPx,
  scale: [12, 14, 16, 20, 24, 32, 48, 64, 72]
});

export interface FontSizeProps extends StyleFnProps<typeof fontSize> {}

export const fontFamily = style<CSS.FontFamilyProperty, "fontFamily">({
  prop: "fontFamily",
  key: "fonts"
});

export interface FontFamilyProps extends StyleFnProps<typeof fontFamily> {}

export const fontWeight = style<CSS.FontWeightProperty, "fontWeight">({
  prop: "fontWeight",
  key: "fontWeights"
});

export interface FontWeightProps extends StyleFnProps<typeof fontWeight> {}

export const lineHeight = style<
  CSS.LineHeightProperty<TLengthStyledSystem>,
  "lineHeight"
>({
  prop: "lineHeight",
  key: "lineHeights"
});

export interface LineHeightProps extends StyleFnProps<typeof lineHeight> {}

export const fontStyle = style<CSS.FontStyleProperty, "fontStyle">({
  prop: "fontStyle"
});

export interface FontStyleProps extends StyleFnProps<typeof fontStyle> {}

export const textAlign = style<CSS.TextAlignProperty, "textAlign">({
  prop: "textAlign"
});

export interface TextAlignProps extends StyleFnProps<typeof textAlign> {}

export const letterSpacing = style<
  CSS.LetterSpacingProperty<TLengthStyledSystem>,
  "letterSpacing"
>({
  prop: "letterSpacing",
  key: "letterSpacings",
  transformValue: getPx
});

export const textDecoration = style<
  CSS.TextDecorationProperty<TLengthStyledSystem>,
  "textDecoration"
>({
  prop: "textDecoration"
});

export interface TextDecorationProps
  extends StyleFnProps<typeof textDecoration> {}

export const whiteSpace = style<CSS.WhiteSpaceProperty, "whiteSpace">({
  prop: "whiteSpace"
});

export interface WhiteSpaceProps extends StyleFnProps<typeof whiteSpace> {}

export interface LetterSpacingProps
  extends StyleFnProps<typeof letterSpacing> {}

export const typography = composeStyleFns(
  textColor,
  fontSize,
  fontFamily,
  fontWeight,
  fontStyle,
  lineHeight,
  textAlign,
  letterSpacing,
  textDecoration,
  whiteSpace
);

export interface TypographyProps
  extends TextColorProps,
    FontSizeProps,
    FontFamilyProps,
    FontWeightProps,
    LineHeightProps,
    TextAlignProps,
    FontStyleProps,
    LetterSpacingProps,
    TextDecorationProps,
    WhiteSpaceProps {}

// #endregion

// #region size

export const getWidth = (n: number | string) =>
  typeof n !== "number" || isNaN(n) === true || n > 1 ? px(n) : `${n * 100}%`;

export const width = style<CSS.WidthProperty<number>, "width">({
  prop: "width",
  key: "widths",
  transformValue: getWidth
});

export interface WidthProps extends StyleFnProps<typeof width> {}

export const maxWidth = style<
  CSS.MaxWidthProperty<TLengthStyledSystem>,
  "maxWidth"
>({
  prop: "maxWidth",
  key: "maxWidths",
  transformValue: getWidth
});

export interface MaxWidthProps extends StyleFnProps<typeof maxWidth> {}

export const minWidth = style<
  CSS.MinWidthProperty<TLengthStyledSystem>,
  "minWidth"
>({
  prop: "minWidth",
  key: "minWidths",
  transformValue: getWidth
});

export interface MinWidthProps extends StyleFnProps<typeof minWidth> {}

export const height = style<CSS.HeightProperty<TLengthStyledSystem>, "height">({
  prop: "height",
  key: "heights",
  transformValue: getPx
});

export interface HeightProps extends StyleFnProps<typeof height> {}

export const maxHeight = style<
  CSS.MaxHeightProperty<TLengthStyledSystem>,
  "maxHeight"
>({
  prop: "maxHeight",
  key: "heights",
  transformValue: getPx
});

export interface MaxHeightProps extends StyleFnProps<typeof maxHeight> {}

export const minHeight = style<
  CSS.MinHeightProperty<TLengthStyledSystem>,
  "minHeight"
>({
  prop: "minHeight",
  key: "heights",
  transformValue: getPx
});

export interface MinHeightProps extends StyleFnProps<typeof minHeight> {}

export const size = composeStyleFns(
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight
);

export interface SizeProps
  extends WidthProps,
    HeightProps,
    MaxWidthProps,
    MinWidthProps,
    MaxHeightProps,
    MinHeightProps {}

// #endregion

// #region flexbox
export const alignItems = style<CSS.AlignItemsProperty, "alignItems">({
  prop: "alignItems"
});

export interface AlignItemsProps extends StyleFnProps<typeof alignItems> {}

export const alignContent = style<CSS.AlignContentProperty, "alignContent">({
  prop: "alignContent"
});

export interface AlignContentProps extends StyleFnProps<typeof alignContent> {}

export const justifyItems = style<CSS.JustifyItemsProperty, "justifyItems">({
  prop: "justifyItems"
});

export interface JustifyItemsProps extends StyleFnProps<typeof justifyItems> {}

export const justifyContent = style<
  CSS.JustifyContentProperty,
  "justifyContent"
>({ prop: "justifyContent" });

export interface JustifyContentProps
  extends StyleFnProps<typeof justifyContent> {}

export const flexWrap = style<CSS.FlexWrapProperty, "flexWrap">({
  prop: "flexWrap"
});

export interface FlexWrapProps extends StyleFnProps<typeof flexWrap> {}

export const flexBasis = style<
  CSS.FlexBasisProperty<TLengthStyledSystem>,
  "flexBasis"
>({ prop: "flexBasis", transformValue: getWidth });

export interface FlexBasisProps extends StyleFnProps<typeof flexBasis> {}

export const flexDirection = style<CSS.FlexDirectionProperty, "flexDirection">({
  prop: "flexDirection"
});

export interface FlexDirectionProps
  extends StyleFnProps<typeof flexDirection> {}

export const flex = style<CSS.FlexProperty<TLengthStyledSystem>, "flex">({
  prop: "flex"
});

export interface FlexProps extends StyleFnProps<typeof flex> {}

export const justifySelf = style<CSS.JustifySelfProperty, "justifySelf">({
  prop: "justifySelf"
});

export interface JustifySelfProps extends StyleFnProps<typeof justifySelf> {}

export const alignSelf = style<CSS.AlignSelfProperty, "alignSelf">({
  prop: "alignSelf"
});

export interface AlignSelfProps extends StyleFnProps<typeof alignSelf> {}

export const order = style<CSS.GlobalsNumber, "order">({ prop: "order" });

export interface OrderProps extends StyleFnProps<typeof order> {}

export const flexBox = composeStyleFns(
  alignItems,
  alignContent,
  justifyItems,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  flex,
  justifySelf,
  alignSelf,
  order
);

export interface FlexBoxProps
  extends AlignItemsProps,
    AlignContentProps,
    JustifyItemsProps,
    JustifyContentProps,
    FlexWrapProps,
    FlexBasisProps,
    FlexDirectionProps,
    FlexProps,
    JustifySelfProps,
    AlignSelfProps,
    OrderProps {}

// #endregion

// #region grid
export const gridGap = style<
  CSS.GridGapProperty<TLengthStyledSystem>,
  "gridGap"
>({
  prop: "gridGap",
  key: "space",
  transformValue: getPx,
  scale: spaceScale
});

export interface GridGapProps extends StyleFnProps<typeof gridGap> {}

export const gridColumnGap = style<
  CSS.GridColumnGapProperty<TLengthStyledSystem>,
  "gridColumnGap"
>({
  prop: "gridColumnGap",
  key: "space",
  transformValue: getPx,
  scale: spaceScale
});

export interface GridColumnGapProps
  extends StyleFnProps<typeof gridColumnGap> {}

export const gridRowGap = style<
  CSS.GridRowGapProperty<TLengthStyledSystem>,
  "gridRowGap"
>({
  prop: "gridRowGap",
  key: "space",
  transformValue: getPx,
  scale: spaceScale
});

export interface GridRowGapProps extends StyleFnProps<typeof gridRowGap> {}

export const gridColumn = style<CSS.GridColumnProperty, "gridColumn">({
  prop: "gridColumn"
});

export interface GridColumnProps extends StyleFnProps<typeof gridColumn> {}

export const gridRow = style<CSS.GridRowProperty, "gridRow">({
  prop: "gridRow"
});

export interface GridRowProps extends StyleFnProps<typeof gridRow> {}

export const gridAutoFlow = style<CSS.GridAutoFlowProperty, "gridAutoFlow">({
  prop: "gridAutoFlow"
});

export interface GridAutoFlowProps extends StyleFnProps<typeof gridAutoFlow> {}

export const gridAutoColumns = style<
  CSS.GridAutoColumnsProperty<TLengthStyledSystem>,
  "gridAutoColumns"
>({ prop: "gridAutoColumns" });

export interface GridAutoColumnsProps
  extends StyleFnProps<typeof gridAutoColumns> {}

export const gridAutoRows = style<
  CSS.GridAutoRowsProperty<TLengthStyledSystem>,
  "gridAutoRows"
>({ prop: "gridAutoRows" });

export interface GridAutoRowsProps extends StyleFnProps<typeof gridAutoRows> {}

export const gridTemplateColumns = style<
  CSS.GridTemplateColumnsProperty<TLengthStyledSystem>,
  "gridTemplateColumns"
>({ prop: "gridTemplateColumns" });

export interface GridTemplateColumnsProps
  extends StyleFnProps<typeof gridTemplateColumns> {}

export const gridTemplateRows = style<
  CSS.GridTemplateRowsProperty<TLengthStyledSystem>,
  "gridTemplateRows"
>({ prop: "gridTemplateRows" });

export interface GridTemplateRowsProps
  extends StyleFnProps<typeof gridTemplateRows> {}

export const gridTemplateAreas = style<
  CSS.GridTemplateAreasProperty,
  "gridTemplateAreas"
>({ prop: "gridTemplateAreas" });

export interface GridTemplateAreasProps
  extends StyleFnProps<typeof gridTemplateAreas> {}

export const gridArea = style<CSS.GridAreaProperty, "gridArea">({
  prop: "gridArea"
});

export interface GridAreaProps extends StyleFnProps<typeof gridArea> {}

export const grid = composeStyleFns(
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea
);

export interface GridProps
  extends GridGapProps,
    GridColumnGapProps,
    GridRowGapProps,
    GridColumnProps,
    GridRowProps,
    GridAutoFlowProps,
    GridAutoColumnsProps,
    GridAutoRowsProps,
    GridTemplateColumnsProps,
    GridTemplateRowsProps,
    GridTemplateAreasProps {}

// #endregion

// #region borders
export const border = style<CSS.BorderProperty<TLengthStyledSystem>, "border">({
  prop: "border",
  key: "borders"
});

export interface BorderProps extends StyleFnProps<typeof border> {}

export const borderWidth = style<
  CSS.BorderWidthProperty<TLengthStyledSystem>,
  "borderWidth"
>({
  prop: "borderWidth",
  key: "borderWidths",
  transformValue: getPx
});

export interface BorderWidthProps extends StyleFnProps<typeof borderWidth> {}

export const borderStyle = style<CSS.BorderStyleProperty, "borderStyle">({
  prop: "borderStyle",
  key: "borderStyles"
});

export interface BorderStyleProps extends StyleFnProps<typeof borderStyle> {}

export const borderColor = style<CSS.BorderColorProperty, "borderColor">({
  prop: "borderColor",
  key: "colors"
});

export interface BorderColorProps extends StyleFnProps<typeof borderColor> {}

export const borderTop = style<
  CSS.BorderTopProperty<TLengthStyledSystem>,
  "borderTop"
>({
  prop: "borderTop",
  key: "borders"
});

export interface BorderTopProps extends StyleFnProps<typeof borderTop> {}

export const borderRight = style<
  CSS.BorderRightProperty<TLengthStyledSystem>,
  "borderRight"
>({
  prop: "borderRight",
  key: "borders"
});

export interface BorderRightProps extends StyleFnProps<typeof borderRight> {}

export const borderBottom = style<
  CSS.BorderBottomProperty<TLengthStyledSystem>,
  "borderBottom"
>({
  prop: "borderBottom",
  key: "borders"
});

export interface BorderBottomProps extends StyleFnProps<typeof borderBottom> {}

export const borderLeft = style<
  CSS.BorderLeftProperty<TLengthStyledSystem>,
  "borderLeft"
>({
  prop: "borderLeft",
  key: "borders"
});

export interface BorderLeftProps extends StyleFnProps<typeof borderLeft> {}

export const borderRadius = style<
  CSS.BorderRadiusProperty<TLengthStyledSystem>,
  "borderRadius"
>({
  prop: "borderRadius",
  key: "radii",
  transformValue: getPx
});

export interface BorderRadiusProps extends StyleFnProps<typeof borderRadius> {}

export const borders = composeStyleFns(
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius
);

export interface BordersProps
  extends BorderProps,
    BorderTopProps,
    BorderRightProps,
    BorderBottomProps,
    BorderLeftProps,
    BorderWidthProps,
    BorderColorProps,
    BorderStyleProps,
    BorderRadiusProps {}

// #endregion

// #region backgrounds
export const background = style<
  CSS.BackgroundProperty<TLengthStyledSystem>,
  "background",
  "bg"
>({ prop: "background", alias: "bg" });

export interface BackgroundProps extends StyleFnProps<typeof background> {}

export const backgroundColor = style<
  CSS.BackgroundColorProperty,
  "backgroundColor",
  "bgColor"
>({
  prop: "backgroundColor",
  alias: "bgColor",
  key: "colors"
});

export interface BackgroundColorProps
  extends StyleFnProps<typeof backgroundColor> {}

export const backgroundImage = style<
  CSS.BackgroundImageProperty,
  "backgroundImage"
>({ prop: "backgroundImage" });

export interface BackgroundImageProps
  extends StyleFnProps<typeof backgroundImage> {}

export const backgroundSize = style<
  CSS.BackgroundSizeProperty<TLengthStyledSystem>,
  "backgroundSize"
>({ prop: "backgroundSize" });

export interface BackgroundSizeProps
  extends StyleFnProps<typeof backgroundSize> {}

export const backgroundPosition = style<
  CSS.BackgroundPositionProperty<TLengthStyledSystem>,
  "backgroundPosition"
>({ prop: "backgroundPosition" });

export interface BackgroundPositionProps
  extends StyleFnProps<typeof backgroundPosition> {}

export const backgroundRepeat = style<
  CSS.BackgroundRepeatProperty,
  "backgroundRepeat"
>({ prop: "backgroundRepeat" });

export interface BackgroundRepeatProps
  extends StyleFnProps<typeof backgroundRepeat> {}

export const backgrounds = composeStyleFns(
  background,
  backgroundColor,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat
);

export interface BackgroundsProps
  extends BackgroundProps,
    BackgroundColorProps,
    BackgroundImageProps,
    BackgroundSizeProps,
    BackgroundPositionProps,
    BackgroundRepeatProps {}

// #endregion

// #region position
export const display = style<CSS.DisplayProperty, "display">({
  prop: "display"
});

export interface DisplayProps extends StyleFnProps<typeof display> {}

export const position = style<CSS.PositionProperty, "position">({
  prop: "position"
});

export interface PositionProps extends StyleFnProps<typeof position> {}

export const zIndex = style<CSS.ZIndexProperty, "zIndex">({
  prop: "zIndex",
  key: "zIndices"
});

export interface ZIndexProps extends StyleFnProps<typeof zIndex> {}

export const top = style<CSS.TopProperty<TLengthStyledSystem>, "top">({
  prop: "top",
  transformValue: getPx
});

export interface TopProps extends StyleFnProps<typeof top> {}

export const right = style<CSS.RightProperty<TLengthStyledSystem>, "right">({
  prop: "right",
  transformValue: getPx
});

export interface RightProps extends StyleFnProps<typeof right> {}

export const bottom = style<CSS.BottomProperty<TLengthStyledSystem>, "bottom">({
  prop: "bottom",
  transformValue: getPx
});

export interface BottomProps extends StyleFnProps<typeof bottom> {}

export const left = style<CSS.LeftProperty<TLengthStyledSystem>, "left">({
  prop: "left",
  transformValue: getPx
});

export interface LeftProps extends StyleFnProps<typeof left> {}

export const positioning = composeStyleFns(
  display,
  position,
  zIndex,
  top,
  right,
  bottom,
  left
);

export interface PositioningProps
  extends DisplayProps,
    PositionProps,
    ZIndexProps,
    TopProps,
    RightProps,
    BottomProps,
    LeftProps {}

// #endregion

// #region table

export const verticalAlign = style<
  CSS.VerticalAlignProperty<TLengthStyledSystem>,
  "verticalAlign"
>({ prop: "verticalAlign" });

export interface VerticalAlignProps
  extends StyleFnProps<typeof verticalAlign> {}

// #endregion

// #region misc

export const boxShadow = style<CSS.BoxShadowProperty | number, "boxShadow">({
  prop: "boxShadow",
  key: "shadows"
});

export interface BoxShadowProps extends StyleFnProps<typeof boxShadow> {}

export const opacity = style<CSS.GlobalsNumber, "opacity">({ prop: "opacity" });

export interface OpacityProps extends StyleFnProps<typeof opacity> {}

export const overflow = style<CSS.OverflowProperty, "overflow">({
  prop: "overflow"
});

export interface OverflowProps extends StyleFnProps<typeof overflow> {}

export const cursor = style<CSS.CursorProperty, "cursor">({
  prop: "cursor"
});

export interface CursorProps extends StyleFnProps<typeof cursor> {}

// #endregion
