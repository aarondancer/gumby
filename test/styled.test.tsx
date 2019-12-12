import React from "react";

import { ThemeProvider } from "emotion-theming";
import serializer, { matchers } from "jest-emotion";
import renderer from "react-test-renderer";

import {
  backgrounds,
  BackgroundsProps,
  borders,
  BordersProps,
  createCSS,
  size,
  SizeProps,
  space,
  SpaceProps,
  styled,
  themed,
  typography,
  TypographyProps
} from "../src";
import theme from "./fixtures/theme";

expect.extend(matchers);

expect.addSnapshotSerializer(serializer);

describe("styled", () => {
  const styleProps = [typography, backgrounds, borders, size, space];

  interface BoxProps
    extends TypographyProps,
      BackgroundsProps,
      BordersProps,
      SizeProps,
      SpaceProps {}

  const Box = styled("div", { styleProps })<BoxProps>();

  it("should provide new `displayName`", () => {
    expect(Box.displayName).toBe("gumbyStyled(div)");
  });

  it("should allow overriding the `displayName`", () => {
    Box.displayName = "Box";

    expect(Box.displayName).toBe("Box");
  });

  it("should allow utilization of styled props", () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Box backgroundColor="primary.1" px={2} />
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toHaveStyleRule("background-color", "#58c");
    expect(tree).toHaveStyleRule("padding-left", "12px");
    expect(tree).toHaveStyleRule("padding-right", "12px");
  });

  it("should allow using tagged template literal syntax", () => {
    const Test = styled("div", { styleProps })<BoxProps>`
      background-color: blue;
      color: red;
      padding-left: 100px;
      padding-right: 200px;
    `;

    const plainTree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Test />
        </ThemeProvider>
      )
      .toJSON();

    expect(plainTree).toHaveStyleRule("background-color", "blue");
    expect(plainTree).toHaveStyleRule("color", "red");
    expect(plainTree).toHaveStyleRule("padding-left", "100px");
    expect(plainTree).toHaveStyleRule("padding-right", "200px");

    const propsTree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Test backgroundColor="primary.1" px={2} />
        </ThemeProvider>
      )
      .toJSON();

    expect(propsTree).toHaveStyleRule("background-color", "#58c");
    expect(propsTree).toHaveStyleRule("color", "red");
    expect(propsTree).toHaveStyleRule("padding-left", "12px");
    expect(propsTree).toHaveStyleRule("padding-right", "12px");
  });

  it("should allow changing the element rendered using `as` prop", () => {
    const imgTree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Box as="img" backgroundColor="primary.1" px={2} />
        </ThemeProvider>
      )
      .toJSON();

    expect(imgTree).toMatchInlineSnapshot(`
        .emotion-0 {
          background-color: #58c;
          padding-left: 12px;
          padding-right: 12px;
        }

        <img
          className="emotion-0"
        />
    `);

    const Image = styled(Box)();

    Image.defaultProps = {
      as: "img"
    };

    const imageTree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Image backgroundColor="primary.2" px={3} />
        </ThemeProvider>
      )
      .toJSON();

    expect(imageTree).toMatchInlineSnapshot(`
        .emotion-0 {
          background-color: #47b;
          padding-left: 3px;
          padding-right: 3px;
        }

        <img
          className="emotion-0"
        />
    `);
  });

  it("should only compute and apply style prop values once", () => {
    const Box2 = styled(Box)();
    const Box3 = styled(Box2)();
    const Box4 = styled(Box3)();

    const tree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Box4 backgroundColor="primary.2" px={3} />
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchInlineSnapshot(`
        .emotion-0 {
          background-color: #47b;
          padding-left: 3px;
          padding-right: 3px;
        }

        <div
          className="emotion-0"
        />
    `);
  });

  it("should prioritize styles from style props over theme styles", () => {
    const css = createCSS<
      SpaceProps & TypographyProps & BordersProps & BackgroundsProps & SizeProps
    >(space, typography, borders, backgrounds, size);

    const themeDef = {
      ...theme,
      Button: css({
        borderRadius: 3,
        borderWidth: 1,
        borderStyle: "solid",
        fontSize: 3,
        px: 2,
        py: 1,
        transition:
          "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out"
      })
    };

    interface ButtonProps extends BoxProps {}

    const Button = styled(Box)<ButtonProps>(themed("Button"));

    Button.defaultProps = {
      as: "button"
    };

    const tree = renderer
      .create(
        <ThemeProvider theme={themeDef}>
          <Button borderStyle="dotted" fontSize={2} px={3} />
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchInlineSnapshot(`
      .emotion-0 {
        border-radius: 3px;
        border-width: 1px;
        border-style: solid;
        font-size: 3px;
        px: 2px;
        py: 1px;
        -webkit-transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 12px;
        padding-right: 12px;
        font-size: 20px;
        border-width: 2px;
        border-style: solid;
        border-radius: 4px;
        font-size: 16px;
        border-style: dotted;
        padding-left: 3px;
        padding-right: 3px;
      }

      <button
        className="emotion-0"
        fontSize={2}
      />
    `);
  });

  it(`overrides "as" prop for intrinsic components`, () => {
    const Box = styled("div")();

    const Paragraph = styled("p")();
    Paragraph.defaultProps = { ...Box.defaultProps };

    const Heading = styled("h1")();
    Heading.defaultProps = { ...Paragraph.defaultProps };
  });
});
