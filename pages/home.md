---
layout: home
title: Jason Morris
class: photo
meta: "This is the personal website of Jason Morris — an accessibility engineer and a dialer from upstate New York"
permalink: "/index.html"
---

<nav>
<ul class="chunk bump">
{%- assign posts = collections.post | reverse -%}
{%- for post in posts -%}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>
</nav>

<section id="content" tabindex="-1">
  <article>

## Hi, I&rsquo;m Jason

A surprising number of folks go by the same name. Their friends email me all the time.

I live in upstate New York with my [talented significant other](https://katydecorah.com) and our 4-year-old kiddo.

I’m a [WAS-certified](https://www.credly.com/badges/d58371ca-e424-4a18-bc4c-41177b02a7d4/) Accessibility Engineer at [CommunicateHealth](https://communicatehealth.com) and co-tinkerer at [doublegreat.dev](https://doublegreat.dev/). I typed my first bit of HTML in a Notepad window sometime in 1998 and never stopped [writing code](https://github.com/jsnmrs).

  </article>
  <div class="photo">
    <picture>
      <source media="(max-width: 768px)" srcset="/img/jason-640.webp" type="image/webp">
      <source media="(min-width: 769px)" srcset="/img/jason-320.webp" type="image/webp">
      <source media="(min-width: 769px)" srcset="/img/jason-320.jpg">
      <img src="/img/jason-640.jpg" alt="Jason Morris." loading="lazy" width="320" height="320">
    </picture>
  </div>
</section>
