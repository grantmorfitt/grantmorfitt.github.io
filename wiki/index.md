---
layout: default
title: Wiki
---
<div style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('assets/Washington.png') center/cover no-repeat;
  z-index: -1;
  filter: blur(0);
">
</div>

# Wiki
This "wiki" is more of a collection of snippets and code blocks for people to use as reference. User beware. No guarantees, express or implied, regarding specific outcomes or results, can be expected by using anything you find here.

<ul>
  {% for page in site.pages %}
    {% if page.path contains 'wiki/' and page.name != 'index.md' %}
      <li><a href="{{ page.url | relative_url }}">{{ page.title | default: page.name | replace: '.md', '' }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
