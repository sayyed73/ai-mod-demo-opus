/**
 * Remotion CLI config (applies to `npm run dev`, `render`, `still`).
 * All configuration options: https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("src/index.ts");

// If Remotion can't download its headless Chrome (offline / locked-down network),
// point it at an installed Chrome/Chromium:
//   REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render
// or pass --browser-executable=/path/to/chrome to any render command.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
