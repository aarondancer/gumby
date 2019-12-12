import React from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import serializer, { matchers } from "jest-emotion";
import renderer from "react-test-renderer";

import {
  composeStyleFns,
  get,
  style,
  themed,
  themeGet,
  variant
} from "../src";

expect.extend(matchers);

expect.addSnapshotSerializer(serializer);

const width = style({
  prop: "width"
});

const color = style({
  prop: "color",
  key: "colors"
});

const backgroundColor = style({
  prop: "backgroundColor",
  alias: "bg",
  key: "colors"
});

const theme = {
  colors: {
    blue: "#07c",
    black: "#111"
  },
  Button: {
    color: "papayawhip"
  },
  Button2: css({
    color: "dodgerblue",
    "&:hover": {
      color: "red"
    }
  })
};

test("returns a style function", () => {
  const func = style({ prop: "width" });
  expect(typeof func).toBe("function");
});

test("function returns a style object", () => {
  const style = width({ width: "50%" });
  expect(style).toEqual({
    width: "50%"
  });
});

test("returns values from theme", () => {
  const style = color({ theme, color: "blue" });
  expect(style).toEqual({
    color: "#07c"
  });
});

test("handles aliased props", () => {
  const style = backgroundColor({
    theme,
    bg: "blue"
  });
  expect(style).toEqual({
    backgroundColor: "#07c"
  });
});

test("long form prop trumps aliased props", () => {
  const style = backgroundColor({
    theme,
    backgroundColor: "black",
    bg: "blue"
  });
  expect(style).toEqual({
    backgroundColor: "#111"
  });
});

test("returns null", () => {
  const style = color({});
  expect(style).toBeNull();
});

test("returns 0", () => {
  const style = width({ width: 0 });
  expect(style).toEqual({ width: 0 });
});

test("returns an array of responsive style objects", () => {
  const style = width({
    width: ["100%", "50%"]
  });
  expect(style).toStrictEqual([
    { width: "100%" },
    { "@media screen and (min-width: 40em)": { width: "50%" } }
  ]);
});

test("returns an array of responsive style objects for all breakpoints", () => {
  const style = width({
    width: ["100%", "75%", "50%", "33%", "25%"]
  });
  expect(style).toStrictEqual([
    { width: "100%" },
    { "@media screen and (min-width: 40em)": { width: "75%" } },
    { "@media screen and (min-width: 52em)": { width: "50%" } },
    { "@media screen and (min-width: 64em)": { width: "33%" } }
  ]);
});

test("skips undefined responsive values", () => {
  const style = width({
    width: ["100%", , "50%"]
  });
  expect(style).toStrictEqual([
    { width: "100%" },
    { "@media screen and (min-width: 52em)": { width: "50%" } }
  ]);
});

test("parses object values", () => {
  const style = width({
    width: {
      _: "100%",
      2: "50%"
    }
  });
  expect(style).toStrictEqual([
    { width: "100%" },
    { "@media screen and (min-width: 64em)": { width: "50%" } }
  ]);
});

test("get returns a value", () => {
  const a = get({ blue: "#0cf" }, "blue");
  expect(a).toBe("#0cf");
});

test("get returns the undefined if no value is found", () => {
  const a = get(
    {
      blue: "#0cf"
    },
    "green"
  );
  expect(a).toBe(undefined);
});

test("get returns value from array index", () => {
  const b = get({ space: [123, 456] }, "space.0");
  expect(b).toBe(123);
});

test("get returns deeply nested values", () => {
  const props = {
    hi: {
      hello: {
        beep: "boop"
      }
    }
  };

  const a = get(props, "hi.hello.beep");

  expect(a).toBe("boop");
});

test("themeGet returns values from the theme", () => {
  const a = themeGet("colors.blue")({ theme });
  expect(a).toBe("#07c");
});

test("themeGet does not throw when value doesnt exist", () => {
  const a = themeGet("colors.blue.5")({ theme });
  expect(a).toBeUndefined();
});

test("themeGet accepts a fallback", () => {
  const a = themeGet("colors.lightblue", "#0cf")({ theme });
  expect(a).toBe("#0cf");
});

test("composeStyleFns combines style functions", () => {
  const colors = composeStyleFns(color, backgroundColor);
  const styles = colors({
    color: "tomato",
    bg: "black"
  });
  expect(typeof colors).toBe("function");
  expect(styles).toStrictEqual([
    { color: "tomato" },
    { backgroundColor: "black" }
  ]);
});

test("variant returns style objects from theme", () => {
  const buttons = variant({ key: "buttons" });
  const a = buttons({
    theme: {
      buttons: {
        primary: {
          padding: "32px",
          backgroundColor: "tomato"
        }
      }
    },
    variant: "primary"
  });
  expect(a).toEqual({
    padding: "32px",
    backgroundColor: "tomato"
  });
});

test("variant prop can be customized", () => {
  const buttons = variant({ key: "buttons", prop: "type" });
  const a = buttons({
    theme: {
      buttons: {
        primary: {
          padding: "32px",
          backgroundColor: "tomato"
        }
      }
    },
    type: "primary"
  });
  expect(a).toEqual({
    padding: "32px",
    backgroundColor: "tomato"
  });
});

test("array values longer than breakpoints does not reset returned style object", () => {
  const a = width({
    width: ["100%", , , , , "50%", "25%"]
  });
  expect(a).toStrictEqual([{ width: "100%" }]);
});

test("themed applies style values from theme", () => {
  const button = themed("Button")({ theme });

  expect(button).toEqual({
    color: "papayawhip"
  });

  const Button2 = styled.button`
    ${themed("Button2")}
  `;

  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <Button2 />
      </ThemeProvider>
    )
    .toJSON();

  expect(tree).toHaveStyleRule("color", "dodgerblue");
  expect(tree).toHaveStyleRule("color", "red", { target: ":hover" });
});

test("themed returns no styles when specified key is not present in theme", () => {
  const unknown = themed("unknown")({ theme });

  expect(unknown).toBeUndefined();;

  const Unknown = styled.button`
    ${themed("unknown")}
  `;

  const tree = renderer.create(<Unknown />).toJSON();

  expect(tree).toMatchInlineSnapshot(`
<button
  className="emotion-0"
/>
`);
});
