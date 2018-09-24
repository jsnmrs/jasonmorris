---
layout: post
title: 'Rotating SSH Keys'
offline: true
category: 'til'
category-full: 'today I learned'
tags:
  - osx
  - security
  - setup
  - ssh
---

Rotating your SSH keys every once in a while is good digital hygiene.

Today, I rotated my SSH keys and configured GitHub to use these new keys. There were a few hangups along the way, but I think it was worth the trouble. Here's the process:

## Make a backup

Copy your existing SSH folder to temporary folder for safekeeping.

`cp -a ~/.ssh ~/ssh-backup`

## Create a strong passphrase

Generate a strong passphrase for your new SSH key. I use [1Password](https://agilebits.com/onepassword) to generate a nice, long passphrase with at least 2 digits and 2 symbols.

## Create a new key pair

Create your new SSH key pair. If you already have a key named "id_rsa", this will overwrite it.

`ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -C "comment describing key"`

When prompted, enter the passphrase you generated earlier.

## Change permissions

This was hangup #1. By default, my machine gives this new key permissions of 644 (User read+write, Group read, Other read). I want to change that to 600 (User read+write only) to avoid issues down the road. To change both id_rsa files to 600:

`chmod 600 ~/.ssh/id_rsa*`

## Add new key to SSH agent and OS X Keychain

To make sure the SSH agent is running, first run:

`eval "$(ssh-agent -s)"`

To add the new SSH key pair to the SSH agent and to the Mac OS X [Keychain](<https://en.wikipedia.org/wiki/Keychain_(software)>), run:

`ssh-add -K ~/.ssh/id_rsa`

This was hangup #2. When I ran this, I was greeted with "ssh-add: illegal option -- K". It looks like my default "ssh-add" isn't using the same version bundled with OS X. To get around this, I needed to specify the path to the correct version of "ssh-add":

`/usr/bin/ssh-add -K ~/.ssh/id_rsa`

## Add new key to GitHub

Add the public key to your GitHub account by following their [Adding a new SSH key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) instructions. Essentially, you'll copy your key to your clipboard using:

`pbcopy < ~/.ssh/id_rsa.pub`

Then you'll be able to paste the key into your [GitHub SSH Key page](https://github.com/settings/ssh) to enable your new key.

While you're there, it's a good opportunity to review any other SSH keys you have in GitHub and rotate/remove as needed.

## Test new key's access to GitHub

Verify you can login to Github with the new SSH key.

`ssh -T git@github.com -i ~/.ssh/id_rsa`

If the key works, you'll be greeted with:
"Hi &lt;username&gt;! You've successfully authenticated, but GitHub does not provide shell access."

## Backup folder

The backup folder you created at the start of this process holds your old SSH keys. Until you've confirmed that all of the services you connect to over SSH are working with your new key, I'd keep the backed up keys around to be safe.
