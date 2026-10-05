import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

/** Display face: headings and the wordmark. Optical sizing tightens it at large sizes. */
export const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

/** Text face: body copy, UI labels, forms. */
export const fontSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  axes: ["wdth"],
});
