---
layout: default
title: Wiki
---

# Wiki

<ul>
  {% for page in site.pages %}
    {% if page.path contains 'wiki/' and page.name != 'index.md' %}
      <li><a href="{{ page.url | relative_url }}">{{ page.title | default: page.name | replace: '.md', '' }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
