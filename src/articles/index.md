---
title: All Articles
layout: list
eleventyExcludeFromCollections: true
description: "Every story published on Form & Fury."
pagination:
  data: collections.articles
  size: 12
  reverse: true
  alias: pagePosts
permalink: "{% if pagination.pageNumber == 0 %}/articles/{% else %}/articles/page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}"
---
