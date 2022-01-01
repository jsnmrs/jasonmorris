---
layout: home
title: Jason Morris
class: photo
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

I wrote my first bit of HTML in a Notepad window sometime in 1998 and never stopped.

Through a combination of genetics and general curiosity, I tinker. I enjoy taking things apart, learning how they work, and putting them back together.

This is my website. Take a peek under the hood over on [GitHub](https://github.com/jsnmrs/jasonmorris).

  </article>
  <div class="photo">
    <figure>
      <picture>
        <source media="(max-width: 768px)" srcset="/img/jason-640.webp" type="image/webp">
        <source media="(min-width: 769px)" srcset="/img/jason-320.webp" type="image/webp">
        <source media="(min-width: 769px)" srcset="/img/jason-320.jpg">
        <img src="/img/jason-640.jpg" alt="Jason Morris." loading="lazy" width="320" height="320">
      </picture>
    </figure>
  </div>
</section>
