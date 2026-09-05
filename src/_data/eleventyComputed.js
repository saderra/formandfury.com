module.exports = {
  // Precomputed here (rather than left to the `image` shortcode) because
  // Nunjucks doesn't reliably resolve async shortcodes called inside a
  // {% for %} loop's macro/include body — see .eleventy.js's `image`
  // shortcode comment. Card/listing templates use the synchronous
  // `renderImage` filter against this instead.
  imageMetadata: async (data) => {
    if (!data.image) return null;
    const { getImageMetadata } = await import("../../eleventy/image-metadata.mjs");
    return getImageMetadata(data.image, [400, 800, 1200]);
  },
};
