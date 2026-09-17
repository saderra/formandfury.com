const categoryLabels = require("./categoryLabels.json");

const META_DESCRIPTION_MAX = 155;

function truncateDescription(text) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= META_DESCRIPTION_MAX) return clean;
  const head = clean.slice(0, META_DESCRIPTION_MAX);
  // Prefer ending on a full sentence if one fits reasonably.
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentenceEnd >= 80) return head.slice(0, sentenceEnd + 1);
  const wordEnd = head.lastIndexOf(" ");
  return head.slice(0, wordEnd > 0 ? wordEnd : head.length).replace(/[\s,;:\u2013\u2014-]+$/, "") + "\u2026";
}

module.exports = {
  // Precomputed here (rather than left to the `image` shortcode) because
  // Nunjucks doesn't reliably resolve async shortcodes called inside a
  // {% for %} loop's macro/include body — see .eleventy.js's `image`
  // shortcode comment. Card/listing templates use the synchronous
  // `renderImage` filter against this instead.
  imageMetadata: async (data) => {
    if (!data.image) return null;
    const { getImageMetadata } = await import("../../eleventy/image-metadata.mjs");
    return getImageMetadata(data.image, [400, 800, 1200, 1600, 2000, 2560]);
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
    if (data.description) return data.description;
    // Articles: derive the meta description from the excerpt, cut cleanly at
    // a sentence or word boundary (never mid-word) to fit a search snippet.
    if (data.summary) return truncateDescription(data.summary);
    return data.description;
  },
};
