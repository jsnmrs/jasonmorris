<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>Sitemap - Jason Morris</title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/css/style.css"/>
        <style>.heading{margin-block:2rem 1rem;}.info{margin-block:1rem 2rem;}.item{margin-block: 0.5rem 0.25rem;}.primary{margin-block: 0 2rem;}</style>
      </head>
      <body>
        <main>
          <div class="heading">
            <h1>Sitemap</h1>
            <xsl:for-each select="/sitemap:urlset/sitemap:url">
              <div class="item">
                <div>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:attribute>
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </div>
                <div>
                  Last updated:
                  <xsl:value-of select="substring(sitemap:lastmod, 0, 11)" />
                </div>
              </div>
            </xsl:for-each>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
