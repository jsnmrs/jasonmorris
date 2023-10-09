<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>
          RSS Feed |
          <xsl:value-of select="/atom:feed/atom:title"/>
        </title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/css/style.css"/>
        <style>.heading{margin-block:2rem 1rem;}.info{margin-block:1rem 2rem;}.item{margin-block: 0.5rem 0.25rem;}.primary{margin-block: 0 2rem;}</style>
      </head>
      <body>
        <main>
          <div class="heading">
            <p><strong>This is my RSS feed</strong>. Subscribe by copying
            the URL from the address bar into your newsreader. Visit <a
            href="https://aboutfeeds.com">About Feeds</a> to learn more and get started. It’s free.</p>
          </div>
          <div class="info">
            <h1>RSS Feed Preview</h1>
            <h2>jasonmorris.com</h2>
            <p>The personal website of Jason Morris — an accessibility engineer and a dialer from upstate New York.</p>
            <p>
              <xsl:value-of select="/atom:feed/atom:subtitle"/>
            </p>
            <p><a>
              <xsl:attribute name="href">
                <xsl:value-of select="/atom:feed/atom:link[2]/@href"/>
              </xsl:attribute>
              Visit Website &#x2192;
            </a></p>
          </div>
          <div class="primary">
            <h2>Recent blog posts</h2>
            <xsl:for-each select="/atom:feed/atom:entry">
              <div class="item">
                <div>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="atom:link/@href"/>
                    </xsl:attribute>
                    <xsl:value-of select="atom:title"/>
                  </a>
                </div>

                <div>
                  Published on
                  <xsl:value-of select="substring(atom:published, 0, 11)" />
                </div>
              </div>
            </xsl:for-each>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
