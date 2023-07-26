---
title: PDFcheck
date: 2023-03-01T12:00:00Z
layout: post
tags:
  - post
  - code
has:
  - code
  - video
category: code
permalink: "{{ category }}/{{ title | slug }}/index.html"
meta: "A tool to instantly check a bunch of PDF files for signs of inaccessibility. "
---

[PDFcheck](https://jsnmrs.github.io/pdfcheck/) is a single-purpose online tool I built to instantly check a bunch of PDF files for signs of inaccessibility.

Over the years, I&rsquo;ve inherited maintenance responsibilities for a website. Often the website has a bunch of PDF files. Determining if any PDFs are tagged for accessibility typically involves opening each file in Adobe Acrobat Pro and inspecting the tags panel. This is tedious.

Sitting in my IDE one day, I inspected a PDF file and noticed some text-based metadata in the largely binary file. Items like PDF version, language, number of tags, and a PDF/UA identifier were consistently added to compliant PDFs.

Several hours later, I had a bunch of regex statements looking through a PDF to find as much metadata as possible from a given file.

With some more polishing, a localized (no upload) file `<input>` takes one or more files, runs through the metadata scans, and reports the PDF's settings.

{% youtube "mz3E1LwCVVY", "pdfcheck", "jpg", "800", "456", "PDFcheck demonstration" %}

The end result is a tool that can accept drag and drop of any file, isolate PDF files, and display if any accessibility features exist in the file. While PDFcheck can't verify PDF accessibility, it can quickly find PDF inaccessibility.

Besides scanning many files at once, PDFcheck also makes a basic inspection of PDF accessibility more approachable and avoids the need for an active Adobe Acrobat Pro subscription.

Take a look at the [PDFcheck code over on GitHub](https://github.com/jsnmrs/pdfcheck).
