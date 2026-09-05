import Image from "@11ty/eleventy-img";
import path from "node:path";

// Shared by .eleventy.js (the `image` async shortcode, for pages that render
// a single image inline) and src/_data/eleventyComputed.js (which needs to
// resolve card/listing images ahead of time — see the note in .eleventy.js
// about async shortcodes not resolving inside for-loops).
export async function getImageMetadata(src, widths) {
  const inputPath = src.startsWith("/assets") ? `./src${src}` : src;
  const ext = path.extname(inputPath).slice(1).toLowerCase();
  const originalFormat = ext === "jpg" ? "jpeg" : ext;
  const formats = originalFormat === "png"
    ? ["webp", "png"]
    : ["avif", "webp", originalFormat];

  return Image(inputPath, {
    widths: [...widths, null],
    formats,
    outputDir: "./_site/assets/images/optimized/",
    urlPath: "/assets/images/optimized/",
    sharpJpegOptions: { quality: 80 },
    sharpWebpOptions: { quality: 80 },
    sharpAvifOptions: { quality: 60 },
  });
}
