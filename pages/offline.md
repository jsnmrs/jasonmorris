---
layout: page
title: beep boop. you're offline.
permalink: /offline/
---

Seems you're offline. It&rsquo;s ok, it happens to everyone from time to time. I created this page for this exact scenario.

Here are some posts you can read without being online:

<ul class="chunk">
{% for post in collections.post %}
{% if post.data.offline %}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
