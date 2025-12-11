import localFont from "next/font/local";

export const gilroy = localFont({
  src: [
    { path: "./fonts/SVN-Gilroy-Thin.otf", weight: "100", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Thin-Italic.otf", weight: "100", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Light-Italic.otf", weight: "300", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Italic.otf", weight: "400", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Medium-Italic.otf", weight: "500", style: "italic" },
    { path: "./fonts/SVN-Gilroy-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/SVN-Gilroy-SemiBold-Italic.otf", weight: "600", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Bold-Italic.otf", weight: "700", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Heavy.otf", weight: "800", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Heavy-Italic.otf", weight: "800", style: "italic" },
    { path: "./fonts/SVN-Gilroy-Black.otf", weight: "900", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Black-Italic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-gilroy",
  display: 'swap',
});

export const bebas = localFont({
    src: [
      { path: "./fonts/SVN-BEBAS-NEUE-BOLD.otf", weight: "900", style: "normal" },
    ],
    variable: "--font-bebas",
    display: 'swap',
  });


