const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const now = String(Date.now())
const { minify } = require('html-minifier-terser');
const { DateTime } = require("luxon");
const path = require("path");

module.exports = async function (eleventyConfig) {

  // @11ty/eleventy-plugin-rss and @11ty/eleventy-img are ESM-only; dynamic
  // import keeps the rest of this config file as plain CommonJS.
  const { default: pluginRss } = await import("@11ty/eleventy-plugin-rss");
  const { default: Image } = await import("@11ty/eleventy-img");
  const { getImageMetadata } = await import("./eleventy/image-metadata.mjs");

  // PLUGINS
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);


  // TAILWIND
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./src/assets/css/tailwind.css')

  // PASSTHROUGHS
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/pdf");
  eleventyConfig.addPassthroughCopy("./src/assets/favicons");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy('./src/cms')
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "node_modules/alpinejs/dist/cdn.min.js": "assets/js/alpine.js" });

  // DATE FORMATTING
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  //My methods
  
  eleventyConfig.addFilter("previousArticle", function (url, articleCollection) {
    const idx = articleCollection.findIndex((a) => a.url === url);
    return idx > 0 ? articleCollection[idx - 1] : null;
  });

  eleventyConfig.addFilter("relatedArticles", function (post, articleCollection, limit) {
    const related = articleCollection.filter((a) => {
      if (a.url === post.url) return false;
      return a.data.categories.some((c) => post.data.categories.includes(c));
    });
    return related.reverse().slice(0, limit || 4);
  });

  eleventyConfig.addFilter('articlesByCategory', function(category, articleCollection){
    
    let filter = [];

    articleCollection.forEach(article=>{
      article.data.categories.forEach(cat=>{
        if(category == cat){
          filter.push(article);
        }
      })
    })
    return filter;
  })
  eleventyConfig.addCollection("getCat", function(collectionApi) {
    let collection = collectionApi.getFilteredByTag("articles")
    let categories = [];
    collection.forEach(article=>{
      article.data.categories.forEach(cat=>{
        let find = categories.filter((item) => cat == item)
        if(find.length == 0){
          categories.push(cat)
        }
      })
    })
    return categories;
  });

  // One entry per (category, page-of-results) — lets category archive pages
  // paginate with plain Eleventy pagination instead of the live site's AJAX
  // "Load More" (a static site can't reproduce that server-driven behavior).
  const CATEGORY_PAGE_SIZE = 12;
  eleventyConfig.addCollection("getCatPages", function (collectionApi) {
    const collection = collectionApi.getFilteredByTag("articles");
    const byCat = {};
    collection.forEach((article) => {
      article.data.categories.forEach((cat) => {
        byCat[cat] = byCat[cat] || [];
        byCat[cat].push(article);
      });
    });

    const pages = [];
    Object.keys(byCat).forEach((cat) => {
      const posts = byCat[cat].slice().reverse();
      const totalPages = Math.max(1, Math.ceil(posts.length / CATEGORY_PAGE_SIZE));
      for (let i = 0; i < totalPages; i++) {
        pages.push({
          cat,
          pageIndex: i,
          totalPages,
          posts: posts.slice(i * CATEGORY_PAGE_SIZE, (i + 1) * CATEGORY_PAGE_SIZE),
        });
      }
    });
    return pages;
  });


  // SHORTCODES
  eleventyConfig.addShortcode('version', function () { return now  })
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // IMAGES (@11ty/eleventy-img)
  //
  // getImageMetadata (resolving a local image into @11ty/eleventy-img's
  // metadata object) lives in ./eleventy/image-metadata.mjs, shared with
  // src/_data/eleventyComputed.js.

  // Renders a <picture> (width/height + lazy-loading included) from
  // pre-resolved image metadata. Kept synchronous and separate from image
  // transformation on purpose: Nunjucks doesn't reliably resolve promises
  // returned from shortcodes called inside a {% for %} loop's macro/include
  // body (it silently renders empty output there), so any image used on a
  // listing page should have its metadata precomputed up front (e.g. via
  // `eleventyComputed`) leaving only this synchronous filter to run inside
  // the loop.
  eleventyConfig.addFilter("renderImage", function (metadata, attributes = {}) {
    if (!metadata) return "";
    return Image.generateHTML(metadata, attributes);
  });

  // Same responsive-image output as `renderImage`, for pages that render a
  // local image directly (not from a collection loop), where an async
  // shortcode is safe to call inline.
  eleventyConfig.addNunjucksAsyncShortcode("image", async function (src, alt, options = {}) {
    if (typeof alt !== "string") {
      throw new Error(`Missing \`alt\` text on responsive image for: ${src}`);
    }

    const {
      widths = [400, 800, 1200],
      sizes = "100vw",
      class: className,
      eager = false,
    } = options;

    const metadata = await getImageMetadata(src, widths);

    const imageAttributes = {
      alt,
      sizes,
      loading: eager ? "eager" : "lazy",
      decoding: "async",
    };
    if (className) imageAttributes.class = className;
    if (eager) imageAttributes.fetchpriority = "high";

    return Image.generateHTML(metadata, imageAttributes);
  });

  let markdownIt = require("markdown-it");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  
  eleventyConfig.setLibrary("md", markdownIt(options));


   /* HTML Minifiy */
    eleventyConfig.addTransform('htmlmin', async function (content, outputPath) {
        if (
          process.env.ELEVENTY_PRODUCTION &&
          outputPath &&
          outputPath.endsWith('.html')
        ) {
          return minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
          });
        }

        return content
    })

    return { 
        dir: { 
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes/layouts"
        },
    };
};
