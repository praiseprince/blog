<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&amp;family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&amp;family=Geist:wght@300..700&amp;family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&amp;display=swap" rel="stylesheet"/>
        <style>
          :root {
            --paper: #f2ede4;
            --paper-deep: #e7e0d1;
            --ink: #1b1916;
            --ink-soft: #4a463f;
            --ink-fade: #8a8377;
            --rule: #cdc6b6;
            --accent: #8b3a2f;
            --font-display: 'Instrument Serif', Georgia, serif;
            --font-body: 'Newsreader', Georgia, serif;
            --font-sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
            --font-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
          }
          /* Night palette. Like the feed, the sitemap's XSLT output runs no
             JavaScript, so the day/night switch is a pure-CSS toggle: a hidden
             checkbox flips these via :has(). Default is day, matching the site. */
          html:has(#theme-switch:checked) {
            --paper: #0e0d0b;
            --paper-deep: #16140f;
            --ink: #e8e2d3;
            --ink-soft: #b6ad99;
            --ink-fade: #6e6759;
            --rule: #2a2620;
            --accent: #c69b6d;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            background: var(--paper);
            color: var(--ink);
            font-family: var(--font-body);
            font-size: 17px;
            line-height: 1.55;
            -webkit-font-smoothing: antialiased;
            font-feature-settings: 'kern', 'liga', 'onum';
          }
          a { color: inherit; text-decoration: none; }
          .wrap {
            max-width: 720px;
            margin: 0 auto;
            padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px) 64px;
          }
          .masthead {
            border-bottom: 1px solid var(--ink);
            padding-bottom: 18px;
            margin-bottom: 28px;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 24px;
            flex-wrap: wrap;
          }
          .nameplate {
            font-family: var(--font-display);
            font-size: clamp(1.6rem, 4vw, 2.3rem);
            line-height: 0.95;
            letter-spacing: -0.01em;
          }
          .nameplate em { font-style: italic; }
          .masthead .crumb {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-soft);
            display: inline-flex;
            align-items: center;
            gap: 14px;
          }
          .masthead .crumb a { border-bottom: 1px solid var(--rule); padding-bottom: 1px; }
          .masthead .crumb a:hover { border-color: var(--ink); }

          /* Day/night toggle — pure CSS, no JS (see note by the night palette) */
          .theme-checkbox { position: absolute; width: 1px; height: 1px; margin: -1px; opacity: 0; }
          .theme-toggle {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-soft);
            border: 1px solid var(--rule);
            padding: 4px 9px;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
            transition: color .2s, border-color .2s;
          }
          .theme-toggle:hover { color: var(--ink); border-color: var(--ink); }
          .theme-checkbox:focus-visible + .theme-toggle { outline: 2px solid var(--accent); outline-offset: 2px; }
          /* Button shows the mode you'll switch TO: day shows "Night", night shows "Day" */
          .theme-toggle .tt-day { display: none; }
          html:has(#theme-switch:checked) .theme-toggle .tt-night { display: none; }
          html:has(#theme-switch:checked) .theme-toggle .tt-day { display: inline; }

          .eyebrow {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--accent);
            margin: 0 0 8px;
          }
          h1.feed-title {
            font-family: var(--font-display);
            font-size: clamp(2.2rem, 5.5vw, 3.4rem);
            line-height: 1;
            margin: 0 0 18px;
            letter-spacing: -0.015em;
          }
          h1.feed-title em { font-style: italic; }
          .feed-desc {
            font-family: var(--font-body);
            font-size: 17px;
            line-height: 1.55;
            color: var(--ink-soft);
            margin: 0 0 28px;
            max-width: 56ch;
          }

          .explainer {
            font-family: var(--font-sans);
            font-size: 13.5px;
            line-height: 1.6;
            color: var(--ink-soft);
            background: var(--paper-deep);
            border-left: 2px solid var(--accent);
            padding: 14px 18px;
            margin: 0 0 56px;
          }
          .explainer strong { color: var(--ink); font-weight: 500; }
          .explainer code {
            font-family: var(--font-mono);
            font-size: 12.5px;
            background: var(--paper);
            padding: 1px 6px;
            border: 1px solid var(--rule);
            user-select: all;
          }

          .smallcaps {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--ink-fade);
            margin: 0 0 14px;
          }

          ol.items { list-style: none; padding: 0; margin: 0; }
          ol.items > li {
            padding: 16px 0;
            border-top: 1px solid var(--rule);
          }
          ol.items > li:last-child { border-bottom: 1px solid var(--rule); }

          .item-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          .item-title {
            font-family: var(--font-mono);
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            flex: 1 1 auto;
            word-break: break-word;
          }
          .item-title a { border-bottom: 1px solid transparent; padding-bottom: 1px; transition: border-color .2s; }
          .item-title a:hover { border-color: var(--accent); }
          .item-title .slash { color: var(--ink-fade); }
          .item-date {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-fade);
            white-space: nowrap;
            flex: 0 0 auto;
          }

          footer.colophon {
            margin-top: 64px;
            padding-top: 20px;
            border-top: 1px solid var(--rule);
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-fade);
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          footer.colophon a { color: var(--ink-soft); border-bottom: 1px solid transparent; }
          footer.colophon a:hover { color: var(--ink); border-color: var(--ink); }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header class="masthead">
            <div class="nameplate"><a href="/"><em>Postcards</em> from Far Away</a></div>
            <div class="crumb">
              <input type="checkbox" id="theme-switch" class="theme-checkbox" aria-label="Toggle day or night theme"/>
              <label for="theme-switch" class="theme-toggle" title="Toggle day or night theme"><span class="tt-night">☾ Night</span><span class="tt-day">☼ Day</span></label>
              <a href="/">Back to the site →</a>
            </div>
          </header>

          <div class="eyebrow">XML · Sitemap</div>
          <h1 class="feed-title">The <em>sitemap.</em></h1>
          <p class="feed-desc">Every page on this site, listed for search engines. You're seeing a human-readable view; crawlers read the raw XML.</p>

          <div class="explainer">
            <strong>This page is a styled view of an XML sitemap.</strong>
            Search engines fetch the underlying XML to discover and date every URL.
            The same list is advertised to crawlers in&#160;<code>/robots.txt</code>.
          </div>

          <div class="smallcaps">
            <xsl:value-of select="count(s:urlset/s:url)"/>
            <xsl:text> URLs</xsl:text>
          </div>

          <ol class="items">
            <xsl:for-each select="s:urlset/s:url">
              <li>
                <div class="item-head">
                  <div class="item-title">
                    <a>
                      <xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute>
                      <span class="slash">/</span>
                      <xsl:value-of select="substring-after(substring-after(s:loc, '://'), '/')"/>
                    </a>
                  </div>
                  <xsl:if test="s:lastmod">
                    <div class="item-date">
                      <xsl:value-of select="s:lastmod"/>
                    </div>
                  </xsl:if>
                </div>
              </li>
            </xsl:for-each>
          </ol>

          <footer class="colophon">
            <div>Sitemap</div>
            <div><a href="/feed.xml">Feed</a> · <a href="/about/">About →</a></div>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
