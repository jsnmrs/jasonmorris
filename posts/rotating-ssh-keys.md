---
title: Rotating SSH Keys
date: 2016-02-15T12:00:00Z
updated: 2022-01-08T09:28:00Z
layout: post
tags:
  - post
  - code
has: code
category: code
permalink: "{{ category }}/{{ title | slug }}/index.html"
---

Rotating your SSH keys every once in a while is good digital hygiene.

Today, I rotated my SSH keys and configured GitHub to use these new keys. There were a few hangups along the way, but it was worth the trouble. Here&rsquo;s the process:

## Make a backup

Copy your existing SSH folder to temporary folder for safekeeping.

`cp -a ~/.ssh ~/ssh-backup`

## Create a strong passphrase

Generate a strong passphrase for your new SSH key. I use [1Password](https://1password.com/) to generate and store a nice, long passphrase. The [1Password online password generator](https://1password.com/password-generator/) is handy for this, too.

## Create a new key pair

Create your new SSH key pair. If you already have a key named `id_rsa`, this will overwrite it. When prompted, enter the passphrase you generated earlier.

`ssh-keygen -t rsa -b 4096 ~/.ssh/id_rsa -C "comment describing key"`

## Change permissions

By default, my machine gives this new key permissions of 644 (user read+write, group read, world read). I want to change that to 600 (user read+write only) to avoid issues down the road. SSH connections may fail if the key files have permissions that are too loose. To change the private and public key files to 600:

`chmod 600 ~/.ssh/id_rsa*`

## Add new key to SSH agent and macOS Keychain

To make sure the SSH agent is running, first run:

`eval "$(ssh-agent -s)"`

To add the new SSH key pair to the SSH agent and to the macOS [Keychain](<https://en.wikipedia.org/wiki/Keychain_(software)>), run:

`ssh-add --apple-use-keychain ~/.ssh/id_rsa`

## Add new key to GitHub

Add the public key to your GitHub account by following [these instructions from GitHub](https://docs.github.com/articles/adding-a-new-ssh-key-to-your-github-account/). You&rsquo;ll copy your key to your clipboard using:

`pbcopy < ~/.ssh/id_rsa.pub`

In the event that `pbcopy` isn&rsquo;t available, print the public key to the console for copy/pasting with:

`cat ~/.ssh/id_rsa.pub`

Then you&rsquo;ll be able to paste the key into your [GitHub SSH Key page](https://github.com/settings/keys) to enable your new key.

While you&rsquo;re there, it&rsquo;s a good opportunity to review any other SSH keys you have in GitHub. Rotate or remove as needed.

## Test new key&rsquo;s access to GitHub

Verify you can login to GitHub with the new SSH key.

`ssh -T git@github.com -i ~/.ssh/id_rsa`

If the key works, you&rsquo;ll see a message confirming authentication (and that GitHub doesn&rsquo;t allow shell access).

## Backup folder

The backup folder you created at the start of this process holds your old SSH keys. Hang onto the backup until you confirm that the services you connect to over SSH are working with your new key.
