---
layout: home
title: Jason Morris
class: photo
permalink: "/index.html"
---

<ul class="chunk bump">
{%- assign posts = collections.post | reverse -%}
{%- for post in posts -%}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>

<section id="content">
  <article>

## Hi, I&rsquo;m Jason

A surprising number of folks go by the same name. Their friends email me all the time.

I wrote my first bit of HTML in a Notepad window sometime in 1998 and never stopped.

Through a combination of genetics and general curiosity, I tinker. I enjoy taking things apart, learning how they work, and putting them back together.

This is my website. Take a peek under the hood over on [GitHub](https://github.com/jsnmrs/jasonmorris).

  </article>
  <div class="photo">
    <picture>
      <img src="/img/jason-iceland-320.jpg" loading="lazy" alt="Jason in Iceland">
    </picture>
    <p class="caption">Waterfall pitstop off of Route 1 in Iceland</p>
  </div>
</section>
