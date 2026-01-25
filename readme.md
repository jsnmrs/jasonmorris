# jasonmorris.com

This is the code repository for my [personal website, jasonmorris.com](https://jasonmorris.com).

## Features

- Built with [Eleventy](https://www.11ty.dev/) static site generator
- Fully responsive design using logical CSS properties
- Strong focus on accessibility (strives for WCAG 2.2 AAA conformance)
- Performance optimized (Lighthouse score of 100 is average)
- Blog with categories and tags
- Built-in media handling for images, videos, and audio
- RSS feed with XSL stylesheet
- Automated accessibility testing in CI/CD pipeline
- Tagged PDF resume generation with DocRaptor
- Comprehensive linting and validation

## Tech Stack

- **Static Site Generator**: Eleventy (11ty)
- **CSS Processing**: PostCSS, Autoprefixer, CSSnano
- **JavaScript**: ESLint, Terser
- **Fonts**: Atkinson Hyperlegible, Source Code Pro
- **Media**: Eleventy-img for image optimization
- **Testing**: HTML-validate, Pa11y, stylelint
- **Version Control**: Git
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js (LTS version)
- npm
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jsnmrs/jasonmorris.git
cd jasonmorris
```

2. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run local
```

This will:

- Start Eleventy in development mode with live reload
- Watch and compile CSS files
- Watch and compile JavaScript files

## Building

Build the site for production:

```bash
npm run build
```

This command:

1. Cleans the output directory
2. Runs all linting tasks
3. Builds CSS and JavaScript
4. Generates the static site
5. Validates the output

## Available Scripts

- `npm run local` - Run full build, tests, then start development server
- `npm run build` - Production build
- `npm run lint` - Run all linters
- `npm run validate` - Validate HTML output
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build directories
- `npm run test` - Muscle memory, same as `npm run build`

## Content Management

### Blog Posts

Create new blog posts in the `posts` directory using Markdown:

```markdown
---
title: Post Title
date: 2024-01-24
layout: post
tags:
  - post
  - category
category: category
permalink: "{{ category }}/{{ title | slug }}/index.html"
meta: "Post description"
---

Content goes here...
```

### Pages

Add new pages in the `pages` directory using either Markdown or HTML.

## Media Handling

### Images

Use the `picture` shortcode for responsive images:

```liquid
{% picture "image-name", "jpg", "240", "320", "1600", "Alt text", "Optional caption" %}
```

### Videos

Embed YouTube videos:

```liquid
{% youtube "VIDEO_ID", "poster-name", "jpg", "800", "450", "Video title" %}
```

Or Vimeo videos:

```liquid
{% vimeo "VIDEO_ID", "poster-name", "jpg", "800", "450", "Video title" %}
```

## Testing

The project includes several types of automated testing:

- Accessibility testing with Pa11y and Accessibility Insights for Web
- HTML validation
- CSS linting with stylelint
- JavaScript linting with ESLint
- Markdown linting with remark

## Deployment

Deployment is handled through GitHub Actions (see `.github/workflows/`):

- Automated builds and tests on pull requests
- Deployment to production on merge to main
- Tagged PDF generation for resume updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm run build`)
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Eleventy](https://www.11ty.dev/) for the static site generator
- [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) font by Braille Institute
- All other open source contributors and maintainers

## Contact

For questions or issues, please [open an issue](https://github.com/jsnmrs/jasonmorris/issues) on GitHub.
