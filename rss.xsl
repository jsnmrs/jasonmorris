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
        <style>:root{--black:#000;--background:#f9f9f9;--background-border-accent:#ddd;--background-accent:#e6e6e6;--text:#222;--text-accent:#444;--link:#114db6;--link-visited:var(--link);--link-hover:#092e6e;--link-focus:#fd0;--font-family:"Atkinson Hyperlegible","Helvetica","Arial",sans-serif}*,:after,:before{box-sizing:border-box}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-delay:-1ms!important;animation-duration:1ms!important;animation-iteration-count:1!important;background-attachment:scroll!important;scroll-behavior:auto!important;transition-delay:0s!important;transition-duration:0s!important}}html{-webkit-text-size-adjust:none;text-size-adjust:none;font-size:110%;scroll-padding:5rem}@media screen and (width >= 48em){html{font-size:130%}}@media screen and (width >= 64em){html{font-size:150%}}canvas,img,picture,svg,video{display:block}img{max-inline-size:100%}img[width]{inline-size:auto}img[src$=".svg"],img[width][height]{block-size:auto;inline-size:100%}img[src$=".svg"]{max-inline-size:none}.video{block-size:0;padding-block-end:51.9%;padding-block-start:1.5rem;position:relative}.video iframe{block-size:100%;inline-size:100%;inset-block-start:0;inset-inline-start:0;max-block-size:95vb;position:absolute}.skip{inset-inline-start:-999rem;position:absolute}.skip:active,.skip:focus{display:block;inset-inline-start:0;padding-block:.5rem;padding-inline:.75rem;position:fixed;z-index:100}@font-face{font-display:optional;font-family:Atkinson Hyperlegible;font-stretch:normal;font-style:normal;font-weight:400;src:local("Atkinson Hyperlegible"),local("Atkinson-Hyperlegible"),url(/fonts/atkinson-hyperlegible.woff2) format("woff2")}body{background-color:var(--background);color:var(--text);font-family:var(--font-family);font-weight:400;margin-block:0;margin-inline:0}:any-link{-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto}:any-link:link{color:var(--link)}:any-link:visited{color:var(--link-visited)}:any-link:active,:any-link:focus,:any-link:hover{color:var(--link-hover)}:any-link:hover{text-decoration-thickness:.12rem}:any-link:focus-visible{background-color:var(--link-focus);box-shadow:0 -.125rem var(--link-focus),0 .25rem var(--text);color:var(--text);outline:.1875rem solid #0000;outline-offset:0;text-decoration:none}:any-link:focus:not(:focus-visible){outline:none}h1,h2,h3,h4{color:var(--text);font-weight:400}h1{font-size:2.25rem;line-height:1.2;margin-block-end:.25rem;margin-block-start:.5rem;margin-inline:0}.home h1{font-size:3.5rem;text-align:center}h2{font-size:1.8rem;line-height:1.2;margin-block-end:.2rem;margin-block-start:.4rem;margin-inline:0}h3{font-size:1.5rem;line-height:1;margin-block-end:1rem;margin-block-start:0;margin-inline:0}p{font-size:1rem;line-height:1.5;margin-block-end:1rem;margin-block-start:.5rem;margin-inline:0}ol,ul{margin-block-end:1.5rem;margin-block-start:0;margin-inline-end:0;margin-inline-start:2rem;padding-block:0;padding-inline:0}ul{list-style-type:circle}li{line-height:1.5}em{font-style:italic}strong{font-weight:700}code,pre{background-color:var(--background-accent);border-block-color:var(--background-accent);border-block-style:solid;border-block-width:.1rem;border-inline-color:var(--background-accent);border-inline-style:solid;border-inline-width:.1rem;border-radius:.25rem;color:var(--text);font-family:var(--font-family);font-size:1rem;line-height:1.2}code{display:inline-block;padding-block:0;padding-inline:.15rem}pre{overflow-inline:auto;padding-block:.5rem;padding-inline:.75rem}pre>code{background-color:initial;border-block-width:0;border-inline-width:0;padding-block:0;padding-inline:0}.circle{align-items:center;background-color:var(--text-accent);block-size:3rem;border-radius:50%;display:flex;flex-direction:column;font-size:1.5rem;inline-size:3rem;justify-content:center;line-height:1;margin-block-end:.5rem;margin-block-start:1rem;margin-inline:0;padding-block-start:.15rem;transition:background-color .5s ease}.circle:link,.circle:visited{color:var(--background);text-decoration:none}.circle:focus,.circle:hover{background-color:var(--background);background-size:110%;border-block-color:var(--link);border-block-style:solid;border-block-width:.1875rem;border-inline-color:var(--link);border-inline-style:solid;border-inline-width:.1875rem;color:var(--link);transition:background-color .5s ease}.circle:focus{box-shadow:none}.sr:not(:focus-within,:active){-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}.back{padding-block-start:0}.back,.meta{margin-block-end:1rem}.date,.update{color:var(--text-accent);line-height:1.5;margin-block:0}.caption,figcaption{color:var(--text-accent);margin-block-end:1.5rem;margin-block-start:.5rem;margin-inline:0}figcaption{text-align:center}figcaption:empty{margin-block:0;margin-inline:0}.bump{margin-block-start:2rem}.doc{margin-block-end:3rem;margin-block-start:3rem}.doc li,.doc p{max-block-size:var(--small)}.doc h1{font-size:3.3rem}.doc h1+p{margin-block-start:.25rem}.doc h2{margin-block-end:.2rem;margin-block-start:2.5rem;margin-inline:0}.doc h3{font-size:1.4rem;line-height:1.2;margin-block-end:0;margin-block-start:1.5rem;margin-inline:0}.doc h3+h4{font-size:1rem;line-height:1.5;margin-block-end:0;margin-block-start:.25rem;margin-inline:0}.doc ul{margin-block-end:2rem;margin-block-start:.25rem;margin-inline-end:0;margin-inline-start:1.5rem}.doc li{margin-block-end:.25rem}.doc .footnote{margin-block-end:-1.5rem;margin-block-start:3rem}.chunk{list-style-type:none;margin-block-end:2rem;margin-inline-start:0}.chunk li{border-block-end:.1rem solid var(--background-accent)}.chunk li :last-child{border-block-end:0}.chunk a{padding-block-end:.35rem;padding-block-start:.45rem;padding-inline:.5rem}.chunk a,hr{display:block}hr{block-size:.5rem;border-block-end:.5rem solid var(--background-accent);border-block-width:0;border-inline-width:0;box-sizing:initial;margin-block:3rem;margin-inline:2rem;overflow:visible;padding-block:0;padding-inline:0}.block-photo{display:block;margin-block:0;margin-inline:auto}main,nav{grid-column-gap:1rem;display:grid;grid-template-columns:[full-start] minmax(0,1fr) [main-start] minmax(0,40rem) [main-end] minmax(0,1fr) [full-end]}.home nav{grid-column-gap:0}main>*,nav>*{grid-column:main}main>figure{grid-column:full;margin-block-end:.5rem;margin-block-start:1.5rem;margin-inline:auto}section{grid-column-gap:1rem;display:grid;grid-template-columns:2fr 1fr;margin-block-end:2rem}article{grid-column:1/span 2}@media screen and (width >= 48em){article{grid-column:1}}.photo{grid-column:1/span 2}@media screen and (width >= 48em){.photo{grid-column:2;margin-block-start:3.5rem}}.photo figure{margin-block:0;margin-inline:0}.photo figcaption{text-align:start}.facade{margin-block-end:2rem;position:relative}.facade__overlay{background-color:#00000080;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23fff' stroke-width='15'/%3E%3Cpath fill='%23fff' d='M70 55v90l75-45z'/%3E%3C/svg%3E");background-position:50%;background-repeat:no-repeat;background-size:5rem;content:" ";inline-size:100%;inset:0;position:absolute;transition:background-size .3s}.facade__link{display:block;position:relative}.facade__link:focus .facade__overlay,.facade__link:hover .facade__overlay{background-size:6rem;transition:background-size .3s}.facade__link img{display:block}@media print{*{background:#0000;color:var(--black)}a,a:visited{text-decoration:underline}a[href]:after{content:" [" attr(href) "]";font-size:.75rem;font-style:normal}a[href^="#"]:after{content:""}a[href="/"]:after{content:" [aka " attr(title) "]"}img{max-inline-size:100%;page-break-inside:avoid}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}h1{font-size:2.25rem}.back{display:none}}.heading{margin-block:2rem 1rem;}.info{margin-block:1rem 2rem;}.item{margin-block: 0.5rem 0.25rem;}.primary{margin-block: 0 2rem;}</style>
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
