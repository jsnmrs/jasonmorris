---
title: Wordup
date: 2018-11-05T12:00:00Z
layout: post
tags:
  - post
  - code
has: code
category: code
permalink: "{{ category }}/{{ title | slug }}/index.html"
meta: "A tool to paste messy Word document text, then convert to clean HTML and Markdown."
---

[Wordup](https://code.jasonmorris.com/wordup/) is a single-purpose online tool I built to convert content from Word documents into HTML or Markdown.

First, it uses the built-in paste tools of [CKEditor 4](https://ckeditor.com/ckeditor-4/). Second, it passes through vanilla JS to clean up spacing and replaces some strings. Finally, it spits out clean HTML. Check a box and [Turndown.js](https://github.com/mixmark-io/turndown) converts to Markdown.

{% picture "wordup", "png", "240", "141", "1600", "Wordup screenshot.", "" %}

But converting Word documents to HTML is a solved problem, right?

1. Search for &ldquo;Word to HTML conversion&rdquo;
2. Search for &ldquo;Word to _clean_ HTML conversion&rdquo;
3. Consider pasting Word document contents into mystery text boxes on several online conversion tools
4. Wonder how these tools actually work
5. Wonder about the privacy policies of these tools
6. Close browser, open Word document
7. Copy content, paste into text editor
8. Begin wrapping text in HTML tags
9. Give up
10. Open Word document, save as HTML
11. Open HTML in text editor
12. Cry a little
13. Start using find and replace to remove extra markup
14. Graduate to regex searches
15. Eventually arrive at relatively clean HTML
16. Realize that someone sent an updated version of the Word document while working through steps 1-15
17. Cry a little

WYSIWYG editors in most CMS platforms deal with pasting Word documents, right?

1. Search for JavaScript-based WYSIWYG editors
1. Pick one
1. Create an HTML page with two `<textarea>` fields
1. Hook WYSIWYG editor into first `<textarea>`
1. Read documentation
1. Figure out how to get converted text out of WYSIWYG `<textarea>` and into second `<textarea>` as HTML
1. Notice _converted_ HTML still needs some love
1. Write extra white space and string replacement rules to send converted text through
1. End up with really clean HTML in the second `<textarea>`
1. Cry a little
1. Wonder what else you can do
1. Add markdown conversion and link helpers
1. Tell people about it

Take a look at the [Wordup code over on GitHub](https://github.com/jsnmrs/wordup).
