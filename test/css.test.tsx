/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as system from "../src";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import serializer, { matchers } from "jest-emotion";
import renderer from "react-test-renderer";
import { readableColor, transparentize } from "polished";
import theme from "./fixtures/theme";

expect.extend(matchers);

expect.addSnapshotSerializer(serializer);

describe("createCSS", () => {
  const css = system.createCSS<
    system.SpaceProps &
      system.TypographyProps &
      system.BordersProps &
      system.BackgroundsProps &
      system.SizeProps
  >(
    system.space,
    system.typography,
    system.borders,
    system.backgrounds,
    system.size
  );

  it("should compose style functions and get values from theme", () => {
    expect(
      css({ color: "primary.1", borderTop: 1, fontSize: 1 })(theme)
    ).toStrictEqual([
      { borderTop: 1, color: "primary.1", fontSize: 1 },
      [{ color: "#58c" }, { fontSize: "14px" }],
      [{ borderTop: "1px solid #666" }]
    ]);
  });

  it("subCss", () => {
    expect(
      css((_cssGet, subCss) => ({
        color: "primary.1",
        "&:hover": subCss({ color: "primary.2" })
      }))(theme)
    ).toStrictEqual([
      {
        "&:hover": [{ color: "primary.2" }, [{ color: "#47b" }]],
        color: "primary.1"
      },
      [{ color: "#58c" }]
    ]);
  });

  describe("css prop", () => {
    it("should dynamically assign CSS property values from the theme values", () => {
      const tree = renderer
        .create(
          <ThemeProvider theme={theme}>
            <button
              css={css({
                backgroundColor: "primary.1",
                "&:hover": {
                  backgroundColor: "primary.2"
                },
                "&:active": {
                  backgroundColor: "primary.0"
                }
              })}
            />
          </ThemeProvider>
        )
        .toJSON();

      expect(tree).toHaveStyleRule("background-color", "#58c");
      expect(tree).toHaveStyleRule("background-color", "#47b", {
        target: ":hover"
      });
      expect(tree).toHaveStyleRule("background-color", "#69d", {
        target: ":active"
      });
    });
  });

  describe("styled component", () => {
    it("should dynamically assign CSS property values from the theme values", () => {
      const Button = styled.button(
        css({
          backgroundColor: "primary.1",
          "&:hover": {
            backgroundColor: "primary.2"
          },
          "&:active": {
            backgroundColor: "primary.0"
          }
        })
      );

      const tree = renderer
        .create(
          <ThemeProvider theme={theme}>
            <Button />
          </ThemeProvider>
        )
        .toJSON();

      expect(tree).toHaveStyleRule("background-color", "#58c");
      expect(tree).toHaveStyleRule("background-color", "#47b", {
        target: ":hover"
      });
      expect(tree).toHaveStyleRule("background-color", "#69d", {
        target: ":active"
      });
    });
  });

  describe("theme definition", () => {
    type ButtonVariants =
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "danger";

    const variantKeys: ButtonVariants[] = [
      "primary",
      "secondary",
      "info",
      "success",
      "danger"
    ];

    const themeDef = {
      ...theme,
      buttons: variantKeys.reduce(
        (variants, key) => ({
          ...variants,
          [key]: css(cssGet => ({
            bgColor: `${key}.1`,
            color: readableColor(cssGet(`colors.${key}.1`)),
            borderColor: `${key}.2`,
            "&:hover": {
              bgColor: `${key}.2`
            },
            "&:focus, &:active": {
              bgColor: `${key}.0`,
              boxShadow: `0 0 0 0.2rem ${transparentize(
                0.5,
                cssGet(`colors.${key}.1`)
              )}`,
              outline: 0
            }
          }))
        }),
        {}
      ),
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

    const buttonVariant = system.variant<ButtonVariants>({ key: "buttons" });

    type ButtonVariantProps = system.StyleFnProps<typeof buttonVariant>;

    interface ButtonProps
      extends ButtonVariantProps,
        system.TypographyProps,
        system.BackgroundsProps,
        system.BordersProps,
        system.SizeProps,
        system.SpaceProps {}

    // @ts-ignore HTML color attribute conflict from instrinsic props
    const Button = styled.button<ButtonProps>(
      system.themed("Button"),
      buttonVariant,
      system.typography,
      system.backgrounds,
      system.borders,
      system.size,
      system.space
    );

    Button.defaultProps = {
      variant: "primary",
      width: 1,
      mb: 1
    };

    it("should dynamically assign CSS property values from the theme values", () => {
      const tree = renderer
        .create(
          <ThemeProvider theme={themeDef}>
            <Button />
          </ThemeProvider>
        )
        .toJSON();

      expect(tree).toHaveStyleRule("color", "#000");
      expect(tree).toHaveStyleRule("background-color", "#58c");
      expect(tree).toHaveStyleRule("background-color", "#47b", {
        target: ":hover"
      });
      expect(tree).toHaveStyleRule("background-color", "#69d", {
        target: ":active"
      });
    });

    it("should dynamically assign CSS property values from the theme values for a different variant", () => {
      const tree = renderer
        .create(
          <ThemeProvider theme={themeDef}>
            <Button variant="danger" />
          </ThemeProvider>
        )
        .toJSON();

      expect(tree).toHaveStyleRule("color", "#fff");
      expect(tree).toHaveStyleRule("background-color", "#b33");
      expect(tree).toHaveStyleRule("background-color", "#a22", {
        target: ":hover"
      });
      expect(tree).toHaveStyleRule("background-color", "#c44", {
        target: ":active"
      });
    });
  });
});
