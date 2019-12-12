import {
  backgrounds,
  borders,
  boxShadow,
  composeStyleFns,
  cursor,
  flexBox,
  grid,
  opacity,
  overflow,
  positioning,
  size,
  space,
  typography,
  verticalAlign
} from "../src";
import theme from "./fixtures/theme";

const stylesFromCssProps = (cssProperties: string[], value: any) =>
  cssProperties.map(prop => ({ [prop]: value }));

const expectPassRawValue = (propName: string, styleFn: Function) => {
  it("passes the prop value to the style", () => {
    const a = styleFn({
      theme,
      [propName]: `${propName}-test`
    });

    expect(a).toEqual([{ [propName]: `${propName}-test` }]);
  });
};

describe("space", () => {
  const spaceAssertions = ({
    propName,
    alias = propName,
    cssProperties = [propName]
  }: {
    propName: string;
    alias?: string;
    cssProperties?: string[];
  }) => {
    it("returns 0 when passed 0", () => {
      const assertion = (propName: string) => {
        const a = space({ [propName]: 0 });

        expect(a).toEqual(stylesFromCssProps(cssProperties, 0));
      };

      assertion(propName);
      assertion(alias);
    });

    it("returns negative pixel values from default scale", () => {
      const assertion = (prop: string) => {
        const a = space({ [prop]: -2 });

        expect(a).toEqual(stylesFromCssProps(cssProperties, "-8px"));
      };

      assertion(propName);
      assertion(alias);
    });

    describe("returns negative pixel values from theme scale", () => {
      const assertion = (prop: string) => {
        test("array", () => {
          const a = space({
            theme: {
              space: [0, 80, 23]
            },
            [prop]: -2
          });

          expect(a).toEqual(stylesFromCssProps(cssProperties, "-23px"));
        });

        test("object", () => {
          const a = space({
            theme: {
              space: { sm: "32px", md: "1100rem" }
            },
            [prop]: "-md"
          });

          expect(a).toEqual(stylesFromCssProps(cssProperties, "-1100rem"));
        });
      };

      assertion(propName);
      assertion(alias);
    });

    describe("returns negative values of strings from theme scale", () => {
      const assertion = (prop: string) => {
        test("array", () => {
          const a = space({
            theme: { space: [0, "100rem", "500rem"] },
            [prop]: -1
          });

          expect(a).toEqual(stylesFromCssProps(cssProperties, "-100rem"));
        });

        test("object", () => {
          const a = space({
            theme: { space: { sm: "20px", md: "123rem" } },
            [prop]: "-md"
          });

          expect(a).toEqual(stylesFromCssProps(cssProperties, "-123rem"));
        });
      };

      assertion(propName);
      assertion(alias);
    });

    it("returns positive values from theme scale", () => {
      const assertion = (prop: string) => {
        const a = space({
          theme: {
            space: [0, "1em", "2em"]
          },
          [prop]: 2
        });

        expect(a).toEqual(stylesFromCssProps(cssProperties, "2em"));
      };

      assertion(propName);
      assertion(alias);
    });

    it("returns responsive values", () => {
      const a = space({
        [propName]: [0, 2, 3]
      });

      if (cssProperties.length === 1) {
        expect(a).toEqual([
          [
            { [propName]: 0 },
            {
              "@media screen and (min-width: 40em)": { [propName]: "8px" }
            },
            {
              "@media screen and (min-width: 52em)": { [propName]: "16px" }
            }
          ]
        ]);
      } else {
        expect(a).toEqual(
          cssProperties.map(prop => [
            { [prop]: 0 },
            {
              "@media screen and (min-width: 40em)": { [prop]: "8px" }
            },
            {
              "@media screen and (min-width: 52em)": { [prop]: "16px" }
            }
          ])
        );
      }
    });

    if (propName !== alias) {
      it(`overrides ${alias} prop with ${propName} prop`, () => {
        const a = space({
          [propName]: "3000rem",
          [alias]: "5555555%"
        });

        expect(a).toEqual(stylesFromCssProps(cssProperties, "3000rem"));
      });
    }
  };

  const spaceShorthandAssertion = ({
    propName,
    cssProperties
  }: {
    propName: string;
    cssProperties: string[];
  }) => {
    it(`overrides ${cssProperties.join(
      ", "
    )} prop with ${propName} prop`, () => {
      const a = space({
        [propName]: "elongated muskrat",
        ...cssProperties.reduce(
          (props, name) => ({ ...props, [name]: "🚀" }),
          {}
        )
      });

      expect(a).toEqual(stylesFromCssProps(cssProperties, "elongated muskrat"));
    });
  };

  describe("margin", () => {
    const shorthands = [
      { propName: "mx", cssProperties: ["marginLeft", "marginRight"] },
      { propName: "my", cssProperties: ["marginTop", "marginBottom"] }
    ];

    [
      { propName: "margin", alias: "m" },
      { propName: "marginTop", alias: "mt" },
      { propName: "marginBottom", alias: "mb" },
      { propName: "marginLeft", alias: "ml" },
      { propName: "marginRight", alias: "mr" },
      ...shorthands
    ].forEach(spaceAssertions);

    shorthands.forEach(spaceShorthandAssertion);
  });

  describe("padding", () => {
    const shorthands = [
      { propName: "px", cssProperties: ["paddingLeft", "paddingRight"] },
      { propName: "py", cssProperties: ["paddingTop", "paddingBottom"] }
    ];

    [
      { propName: "padding", alias: "p" },
      { propName: "paddingTop", alias: "pt" },
      { propName: "paddingBottom", alias: "pb" },
      { propName: "paddingLeft", alias: "pl" },
      { propName: "paddingRight", alias: "pr" },
      ...shorthands
    ].forEach(spaceAssertions);

    shorthands.forEach(spaceShorthandAssertion);
  });
});

describe("typography", () => {
  describe("textColor", () => {
    it("returns color values from theme", () => {
      const a = typography({
        theme,
        color: "primary.1"
      });

      expect(a).toEqual([{ color: "#58c" }]);
    });

    it("returns raw color values when key is not present in theme", () => {
      const a = typography({
        theme,
        color: "inherit"
      });

      expect(a).toEqual([{ color: "inherit" }]);

      const b = typography({
        theme,
        color: "primary.100"
      });

      expect(b).toEqual([{ color: "primary.100" }]);
    });
  });

  describe("fontSize", () => {
    it("returns a pixel value if given a number outside the font-size scale", () => {
      const a = typography({ fontSize: 48 });

      expect(a).toEqual([{ fontSize: "48px" }]);

      const b = typography({ theme: { fontSizes: [0, 1, 2] }, fontSize: 48 });

      expect(b).toEqual([{ fontSize: "48px" }]);
    });

    it("uses the default font-size scale if scale is not specified", () => {
      const a = typography({ fontSize: 2 });

      expect(a).toEqual([{ fontSize: "16px" }]);

      const b = typography({ theme: {}, fontSize: 2 });

      expect(b).toEqual([{ fontSize: "16px" }]);
    });

    it("returns the passed value if given a string", () => {
      const a = typography({ fontSize: "2em" });

      expect(a).toEqual([{ fontSize: "2em" }]);
    });
  });

  describe("fontFamily", () => {
    it("returns font families from theme", () => {
      const a = typography({
        theme,
        fontFamily: "display"
      });

      expect(a).toEqual([{ fontFamily: "Roboto" }]);

      const b = typography({
        theme,
        fontFamily: "monospace"
      });

      expect(b).toEqual([{ fontFamily: "FiraCode Light" }]);

      const c = typography({
        theme,
        fontFamily: "quote"
      });

      expect(c).toEqual([{ fontFamily: "Georgia" }]);
    });

    it("returns the raw value when key is not found in theme", () => {
      const a = typography({ theme, fontFamily: "San Francisco" });

      expect(a).toEqual([{ fontFamily: "San Francisco" }]);

      const b = typography({ fontFamily: "Wood" });

      expect(b).toEqual([{ fontFamily: "Wood" }]);
    });
  });

  describe("fontWeight", () => {
    it("returns font weights from theme", () => {
      const a = typography({
        theme,
        fontWeight: "light"
      });

      expect(a).toEqual([{ fontWeight: 300 }]);

      const b = typography({
        theme,
        fontWeight: "normal"
      });

      expect(b).toEqual([{ fontWeight: 400 }]);

      const c = typography({
        theme,
        fontWeight: "bold"
      });

      expect(c).toEqual([{ fontWeight: 700 }]);
    });

    it("returns the raw value when key is not found in theme", () => {
      const a = typography({ theme, fontWeight: "Extra Bold" });

      expect(a).toEqual([{ fontWeight: "Extra Bold" }]);

      const b = typography({ fontWeight: 900 });

      expect(b).toEqual([{ fontWeight: 900 }]);
    });
  });

  describe("lineHeight", () => {
    it("returns line heights from theme", () => {
      const a = typography({
        theme,
        lineHeight: "normal"
      });

      expect(a).toEqual([{ lineHeight: 1 }]);

      const b = typography({
        theme,
        lineHeight: "heading"
      });

      expect(b).toEqual([{ lineHeight: 1.2 }]);
    });

    it("returns the raw value when key is not found in theme", () => {
      const a = typography({ theme, lineHeight: "small" });

      expect(a).toEqual([{ lineHeight: "small" }]);

      const b = typography({ lineHeight: 900 });

      expect(b).toEqual([{ lineHeight: 900 }]);
    });
  });

  describe("letterSpacing", () => {
    it("returns letter spacing values from theme", () => {
      const a = typography({
        theme,
        letterSpacing: 0
      });

      expect(a).toEqual([{ letterSpacing: "1px" }]);

      const b = typography({
        theme,
        letterSpacing: 2
      });

      expect(b).toEqual([{ letterSpacing: "1.2rem" }]);
    });

    it("returns the px value when key is a number not found in theme", () => {
      const a = typography({ theme, letterSpacing: 3 });

      expect(a).toEqual([{ letterSpacing: "3px" }]);
    });

    it("returns the raw value when key is a string not found in theme", () => {
      const a = typography({ theme, letterSpacing: "3" });

      expect(a).toEqual([{ letterSpacing: "3" }]);
    });
  });

  ["textAlign", "textDecoration", "whiteSpace"].forEach(propName =>
    describe(propName, () => {
      expectPassRawValue(propName, typography);
    })
  );
});

describe("size", () => {
  describe("width", () => {
    const widthAssertions = (propName: string) => {
      it("returns a percentage based width when passed a value less than or equal to 1", () => {
        const a = size({ [propName]: 1 / 2 });

        expect(a).toEqual([{ [propName]: "50%" }]);

        const b = size({ [propName]: 1 });

        expect(b).toEqual([{ [propName]: "100%" }]);
      });

      it("returns a pixel based width when passed a value greater than 1", () => {
        const a = size({ [propName]: 256 });

        expect(a).toEqual([{ [propName]: "256px" }]);

        const b = size({ [propName]: 1.0001 });

        expect(b).toEqual([{ [propName]: "1.0001px" }]);
      });

      it("returns the value passed when given a string", () => {
        const a = size({ [propName]: "auto" });

        expect(a).toEqual([{ [propName]: "auto" }]);
      });
    };

    widthAssertions("width");

    describe("minWidth", () => {
      widthAssertions("minWidth");
    });

    describe("maxWidth", () => {
      widthAssertions("maxWidth");
    });
  });

  describe("height", () => {
    const heightAssertions = (propName: string) => {
      describe("returns values from the theme", () => {
        test("array", () => {
          const a = size({
            theme: { heights: [0, "112px", "200px", "388px"] },
            [propName]: 2
          });

          expect(a).toEqual([{ [propName]: "200px" }]);
        });

        test("object", () => {
          const theme = { heights: { sm: "13rem", md: "12px", 2: "100%" } };

          const a = size({
            theme,
            [propName]: 2
          });

          expect(a).toEqual([{ [propName]: "100%" }]);

          const b = size({
            theme,
            [propName]: "sm"
          });

          expect(b).toEqual([{ [propName]: "13rem" }]);
        });
      });

      describe("returns alternative values", () => {
        it("returns raw value when passed a string", () => {
          const a = size({
            [propName]: "100rem"
          });

          expect(a).toEqual([{ [propName]: "100rem" }]);
        });

        it("returns px value when passed a number", () => {
          const a = size({
            theme: { heights: [0, 1, 2] },
            [propName]: 100
          });

          expect(a).toEqual([{ [propName]: "100px" }]);
        });
      });
    };

    heightAssertions("height");

    describe("minHeight", () => {
      heightAssertions("minHeight");
    });

    describe("maxHeight", () => {
      heightAssertions("maxHeight");
    });
  });
});

describe("flexbox", () => {
  [
    "alignItems",
    "alignContent",
    "justifyItems",
    "justifyContent",
    "flexWrap",
    "flexBasis",
    "flexDirection",
    "flex",
    "justifySelf",
    "alignSelf",
    "order"
  ].forEach(propName =>
    describe(propName, () => expectPassRawValue(propName, flexBox))
  );
});

describe("grid", () => {
  describe("gridGap", () => {
    it("returns a scalar style", () => {
      const a = grid({
        theme: {
          space: [0, 2, 4, 222]
        },
        gridGap: 3
      });

      expect(a).toEqual([{ gridGap: "222px" }]);
    });

    it("uses the default scale", () => {
      const a = grid({
        theme: {},
        gridGap: 2
      });

      expect(a).toEqual([{ gridGap: "8px" }]);
    });
  });

  describe("gridColumnGap", () => {
    it("returns a scalar style", () => {
      const a = grid({
        theme: {
          space: [0, 2, 4, 444]
        },
        gridColumnGap: 3
      });

      expect(a).toEqual([{ gridColumnGap: "444px" }]);
    });

    it("uses the default scale", () => {
      const a = grid({
        theme: {},
        gridColumnGap: 2
      });

      expect(a).toEqual([{ gridColumnGap: "8px" }]);
    });
  });

  describe("gridRowGap", () => {
    it("returns a scalar style", () => {
      const a = grid({
        theme: {
          space: [0, 2, 4, 333]
        },
        gridRowGap: 3
      });

      expect(a).toEqual([{ gridRowGap: "333px" }]);
    });

    it("uses the default scale", () => {
      const a = grid({
        theme: {},
        gridRowGap: 2
      });

      expect(a).toEqual([{ gridRowGap: "8px" }]);
    });
  });
});

describe("borders", () => {
  it("returns correct sequence", () => {
    const a = borders({
      borderBottom: "1px solid",
      borderWidth: "2px",
      borderStyle: "dashed",
      borderColor: "red"
    });

    expect(a).toStrictEqual([
      { borderBottom: "1px solid" },
      { borderWidth: "2px" },
      { borderStyle: "dashed" },
      { borderColor: "red" }
    ]);
  });

  ["border", "borderTop", "borderRight", "borderLeft", "borderBottom"].forEach(
    propName => {
      describe(propName, () => {
        it("retreives the value from the theme", () => {
          const a = borders({ theme, [propName]: 1 });

          expect(a).toEqual([{ [propName]: "1px solid #666" }]);
        });

        it("uses the raw value when the key is not present in the theme", () => {
          const a = borders({
            theme,
            [propName]: "5px solid #666"
          });

          expect(a).toEqual([{ [propName]: "5px solid #666" }]);
        });
      });
    }
  );

  describe("borderStyle", () => {
    it("retreives the value from the theme", () => {
      const a = borders({ theme, borderStyle: "normal" });

      expect(a).toEqual([{ borderStyle: "solid" }]);

      const b = borders({ theme, borderStyle: "placeholder" });

      expect(b).toEqual([{ borderStyle: "dotted" }]);
    });
  });

  describe("borderColor", () => {
    it("returns color values from theme", () => {
      const a = borders({
        theme,
        borderColor: "primary.1"
      });

      expect(a).toEqual([{ borderColor: "#58c" }]);
    });

    it("returns raw color values when key is not present in theme", () => {
      const a = borders({
        theme,
        borderColor: "inherit"
      });

      expect(a).toEqual([{ borderColor: "inherit" }]);

      const b = borders({
        theme,
        borderColor: "primary.100"
      });

      expect(b).toEqual([{ borderColor: "primary.100" }]);
    });
  });

  describe("borderWidth", () => {
    it("returns px values from theme", () => {
      const a = borders({
        theme,
        borderWidth: 1
      });

      expect(a).toEqual([{ borderWidth: "2px" }]);
    });

    it("returns string values from theme", () => {
      const a = borders({
        theme,
        borderWidth: 2
      });

      expect(a).toEqual([{ borderWidth: "15rem" }]);
    });

    it("returns raw px values when key is not present in theme", () => {
      const a = borders({
        theme,
        borderWidth: 15
      });

      expect(a).toEqual([{ borderWidth: "15px" }]);

      const b = borders({
        borderWidth: 15
      });

      expect(b).toEqual([{ borderWidth: "15px" }]);
    });

    it("returns raw string values when key is not present in theme", () => {
      const a = borders({
        theme,
        borderWidth: "55rem"
      });

      expect(a).toEqual([{ borderWidth: "55rem" }]);

      const b = borders({
        borderWidth: "44rem"
      });

      expect(b).toEqual([{ borderWidth: "44rem" }]);
    });
  });

  describe("borderRadius", () => {
    it("returns px values from theme", () => {
      const a = borders({
        theme,
        borderRadius: 3
      });

      expect(a).toEqual([{ borderRadius: "4px" }]);
    });

    it("returns string values from theme", () => {
      const a = borders({
        theme,
        borderRadius: 4
      });

      expect(a).toEqual([{ borderRadius: "8rem" }]);
    });

    it("returns raw px values when key is not present in theme", () => {
      const a = borders({
        theme,
        borderRadius: 153
      });

      expect(a).toEqual([{ borderRadius: "153px" }]);

      const b = borders({
        borderRadius: 151
      });

      expect(b).toEqual([{ borderRadius: "151px" }]);
    });

    it("returns raw string values when key is not present in theme", () => {
      const a = borders({
        theme,
        borderRadius: "552rem"
      });

      expect(a).toEqual([{ borderRadius: "552rem" }]);

      const b = borders({
        borderRadius: "441rem"
      });

      expect(b).toEqual([{ borderRadius: "441rem" }]);
    });
  });
});

describe("backgrounds", () => {
  describe("background", () => {
    describe("should allow raw color values to be passed", () => {
      const a = backgrounds({
        theme,
        background: "magenta"
      });

      expect(a).toEqual([{ background: "magenta" }]);

      const b = backgrounds({
        theme,
        bg: "blue"
      });

      expect(b).toEqual([{ background: "blue" }]);
    });

    it("should override bg prop with background prop", () => {
      const a = backgrounds({
        background: "red",
        bg: "blue"
      });

      expect(a).toEqual([{ background: "red" }]);
    });
  });

  describe("backgroundColor", () => {
    it("returns color values from theme", () => {
      const a = backgrounds({
        theme,
        backgroundColor: "primary.2"
      });

      expect(a).toEqual([{ backgroundColor: "#47b" }]);

      const b = backgrounds({
        theme,
        bgColor: "danger.1"
      });

      expect(b).toEqual([{ backgroundColor: "#b33" }]);
    });

    it("returns raw color values when key is not present in theme", () => {
      const a = backgrounds({
        theme,
        backgroundColor: "inherit"
      });

      expect(a).toEqual([{ backgroundColor: "inherit" }]);

      const b = backgrounds({
        theme,
        bgColor: "tomato"
      });

      expect(b).toEqual([{ backgroundColor: "tomato" }]);
    });

    it("overrides bgColor prop with backgroundColor prop", () => {
      const a = backgrounds({
        backgroundColor: "tomato",
        bgColor: "blue"
      });
      expect(a).toEqual([{ backgroundColor: "tomato" }]);
    });
  });

  [
    "backgroundImage",
    "backgroundSize",
    "backgroundPosition",
    "backgroundRepeat"
  ].forEach(propName =>
    describe(propName, () => expectPassRawValue(propName, backgrounds))
  );
});

describe("positioning", () => {
  ["display", "position"].forEach(propName =>
    describe(propName, () => expectPassRawValue(propName, positioning))
  );

  describe("zIndex", () => {
    it("returns values from the theme", () => {
      const a = positioning({
        theme,
        zIndex: "modal"
      });

      expect(a).toEqual([{ zIndex: 500 }]);
    });

    it("returns raw value when key is not present in theme", () => {
      const a = positioning({
        theme,
        zIndex: 12
      });

      expect(a).toEqual([{ zIndex: 12 }]);

      const b = positioning({
        zIndex: 13
      });

      expect(b).toEqual([{ zIndex: 13 }]);
    });
  });

  ["top", "bottom", "right", "left"].forEach(propName => {
    describe(propName, () => {
      it("returns raw value when passed a string value", () => {
        const a = positioning({
          theme,
          [propName]: `${propName}-test`
        });

        expect(a).toEqual([{ [propName]: `${propName}-test` }]);
      });

      it("returns a px string when passed a number value", () => {
        const a = positioning({
          theme,
          [propName]: 123
        });

        expect(a).toEqual([{ [propName]: "123px" }]);
      });
    });
  });
});

describe("boxShadow", () => {
  it("returns values from the theme", () => {
    const a = boxShadow({
      theme,
      boxShadow: 1
    });

    expect(a).toEqual({ boxShadow: "10px 10px 5px red" });
  });

  it("returns raw value when key is not present in theme", () => {
    const a = boxShadow({
      theme,
      boxShadow: "1px 10px 5px #333"
    });

    expect(a).toEqual({ boxShadow: "1px 10px 5px #333" });

    const b = boxShadow({
      boxShadow: "1px 1px 6px #333"
    });

    expect(b).toEqual({ boxShadow: "1px 1px 6px #333" });
  });
});

[
  ["opacity", opacity],
  ["overflow", overflow],
  ["cursor", cursor],
  ["verticalAlign", verticalAlign]
].forEach(([propName, styleFn]: any[]) => {
  describe(propName, () =>
    expectPassRawValue(propName, composeStyleFns(styleFn))
  );
});
