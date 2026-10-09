import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { brand } from "../config/brand";

/**
 * Loads the local Inter files (public/fonts) before frames render.
 * loadFont() delays rendering until each file is ready.
 */
export const loadBrandFonts = () =>
  Promise.all(
    brand.fonts.files.map((f) =>
      loadFont({
        family: brand.fonts.family,
        url: staticFile(f.file),
        weight: f.weight,
      }),
    ),
  );
