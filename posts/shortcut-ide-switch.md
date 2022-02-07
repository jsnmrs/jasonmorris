---
title: "Shortcut: IDE Switching"
slug: "ide-switching"
date: 2022-02-06T14:00:00Z
layout: post
tags: post
has: code
category: code
permalink: "{{ category }}/{{ slug }}/index.html"
---

Avoiding decision fatigue is an aspiration of mine. If my lizard brain is at the wheel, some guardrails can be helpful.

I have used a shell alias to launch my <abbr title="Integrated Development Environment">IDE</abbr> of choice from whatever directory I'm now in for years. If I enter `s`, the current path is opened in [Sublime Text](https://www.sublimetext.com/).

Over time, I've drifted between Sublime Text, [Atom](https://atom.io/), [Nova](https://nova.app/), and [Visual Studio Code](https://code.visualstudio.com/). As I'm trying a new (to me) IDE, I create a similar alias for the new IDE. Typing `a` opens Atom, typing `n` opens Nova, etc.

My `.zshrc` or `.bash_profile`, this looks like this:

```bash
alias a="atom ."
alias c="code ."
alias n="nova ."
alias s="subl ."
```

When I want to give a new IDE a real-world trial, I change the command from the IDE in muscle memory to the new one. This eliminates any hesitation or decision about which IDE to open.

If I'm trying out Nova, typing `a` will open Nova instead of Atom. I notice and appreciate how the switch has become frictionless the first few times. After a few days, I no longer see the change.
