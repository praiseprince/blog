<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Feed · <xsl:value-of select="/rss/channel/title"/></title>
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
          @media (prefers-color-scheme: dark) {
            :root {
              --paper: #0e0d0b;
              --paper-deep: #16140f;
              --ink: #e8e2d3;
              --ink-soft: #b6ad99;
              --ink-fade: #6e6759;
              --rule: #2a2620;
              --accent: #c69b6d;
            }
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
          }
          .masthead .crumb a { border-bottom: 1px solid var(--rule); padding-bottom: 1px; }
          .masthead .crumb a:hover { border-color: var(--ink); }

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
            padding: 22px 0;
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
            font-family: var(--font-display);
            font-size: clamp(1.25rem, 2.4vw, 1.6rem);
            line-height: 1.2;
            margin: 0;
            flex: 1 1 auto;
          }
          .item-title a { border-bottom: 1px solid transparent; padding-bottom: 1px; transition: border-color .2s; }
          .item-title a:hover { border-color: var(--accent); }
          .item-date {
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-fade);
            white-space: nowrap;
            flex: 0 0 auto;
          }
          .item-desc {
            font-family: var(--font-body);
            font-size: 16px;
            line-height: 1.55;
            color: var(--ink-soft);
            margin: 10px 0 0;
            max-width: 60ch;
          }
          .item-cats {
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .item-cats .cat {
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--ink-soft);
            border: 1px solid var(--rule);
            padding: 3px 7px;
          }
          .item-cats .cat::before { content: '#'; color: var(--accent); margin-right: 1px; }

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
            <div class="crumb"><a href="/">Back to the site →</a></div>
          </header>

          <div class="eyebrow">RSS · Feed</div>
          <h1 class="feed-title"><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="feed-desc"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="explainer">
            <strong>This page is a human-readable preview of an RSS feed.</strong>
            Subscribe by pasting the URL into your feed reader
            (NetNewsWire, Reeder, Feedbin, Inoreader, …):
            &#160;<code><xsl:value-of select="/rss/channel/link"/>feed.xml</code>
          </div>

          <div class="smallcaps">
            <xsl:value-of select="count(/rss/channel/item)"/>
            <xsl:text> entries</xsl:text>
          </div>

          <ol class="items">
            <xsl:for-each select="/rss/channel/item">
              <li>
                <div class="item-head">
                  <h2 class="item-title">
                    <a>
                      <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                      <xsl:value-of select="title"/>
                    </a>
                  </h2>
                  <div class="item-date">
                    <xsl:value-of select="substring(pubDate, 1, 16)"/>
                  </div>
                </div>
                <xsl:if test="description != ''">
                  <p class="item-desc"><xsl:value-of select="description"/></p>
                </xsl:if>
                <xsl:if test="category">
                  <div class="item-cats">
                    <xsl:for-each select="category">
                      <span class="cat"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ol>

          <footer class="colophon">
            <div>Praise Prince</div>
            <div><a href="/about/">About →</a></div>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
