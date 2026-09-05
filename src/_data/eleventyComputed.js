const categoryLabels = require("./categoryLabels.json");

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

  // Category archive pages (src/resources/categories.njk) are pagination-only
  // templates with no frontmatter of their own, so `title`/`description`
  // would otherwise render empty in <title> and meta tags. Pass through the
  // real title/description everywhere else.
  title: (data) => {
    if (data.catPage) {
      const label = categoryLabels[data.catPage.cat] || data.catPage.cat;
      return `${label} News, Results & Photography`;
    }
    return data.title;
  },

  description: (data) => {
    if (data.catPage) {
      const label = categoryLabels[data.catPage.cat] || data.catPage.cat;
      return `The latest ${label} news, results, and Shot By Women photography from Form & Fury.`;
    }
    return data.description;
  },
};
