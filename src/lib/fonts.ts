import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { brand } from "../config/brand";

/**
 * Loads the local Inter files (public/fonts) before frames render.
 * loadFont() delays rendering until each file is ready.
 */
export const loadBrandFonts = () =>
  Promise.all([
    ...brand.fonts.files.map((f) =>
      loadFont({
        family: brand.fonts.family,
        url: staticFile(f.file),
        weight: f.weight,
      }),
    ),
    // Serif used by the narrated explainer captions (SIL OFL).
    loadFont({ family: "Libre Baskerville", url: staticFile("fonts/LibreBaskerville-Regular.woff2"), weight: "400" }),
    loadFont({ family: "Libre Baskerville", url: staticFile("fonts/LibreBaskerville-Bold.woff2"), weight: "700" }),
  ]);
