#!/usr/bin/env bash

set -e

OUT="./css/style.css"
PARTIALS=(
  css/partials/_tokens.css
  css/partials/_layout.css
  css/partials/_sidebar.css
  css/partials/_search.css
  css/partials/_hero.css
  css/partials/_components.css
  css/partials/_pdf-widget.css
  css/partials/_downloads.css
  css/partials/_rtl.css
)

{
  cat <<'HEADER'
/*
   style.css — SEO Reference Guide
   AUTO-GENERATED file.

   Partial index
   ─────────────────────────────────────────────────────────
   _tokens.css      Tokens, reset, base, scrollbar, utils
   _layout.css      App-shell, top-nav, main-content
   _sidebar.css     Sidebar, links, badges, tooltips, drawer
   _search.css      Search overlay + results
   _hero.css        Index hero, chapter hero, pillar grid
   _components.css  All reusable content components
   _pdf-widget.css  Floating progress ring + download button
   _downloads.css   Downloads page
   _rtl.css         All [dir='rtl'] directional overrides
*/

HEADER

  for partial in "${PARTIALS[@]}"; do
    echo ""
    cat "$partial"
    echo ""
  done

} > "$OUT"

echo "✓ Built $OUT ($(wc -l < "$OUT") lines)"
