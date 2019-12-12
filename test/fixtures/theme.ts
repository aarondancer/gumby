const theme = {
  space: [4, 8, 12],
  borders: ["1px solid #333", "1px solid #666"],
  borderStyles: {
    normal: "solid",
    placeholder: "dotted"
  },
  borderWidths: [1, 2, "15rem"],
  shadows: ["", "10px 10px 5px red"],
  radii: [0, 1, 2, 4, "8rem"],
  zIndices: {
    background: -1,
    normal: 0,
    modal: 500,
    alert: 1000
  },
  fonts: {
    display: "Roboto",
    monospace: "FiraCode Light",
    quote: "Georgia"
  },
  fontSizes: [12, 14, 16, 20, 24, 32],
  fontWeights: {
    light: 300,
    normal: 400,
    bold: 700
  },
  lineHeights: {
    normal: 1,
    heading: 1.2
  },
  letterSpacings: [1, 1.1, "1.2rem"],
  colors: {
    primary: ["#69d", "#58c", "#47b"],
    secondary: ["#ddd", "#ccc", "#bbb"],
    info: ["#6b9", "#5a8", "#497"],
    success: ["#4c4", "#3b3", "#2a2"],
    danger: ["#c44", "#b33", "#a22"]
  }
};

export default theme;
