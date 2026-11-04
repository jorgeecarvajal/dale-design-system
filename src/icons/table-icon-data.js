// Substitute glyphs for the `Tables` header / pagination icons.
// The source uses Untitled UI icons (trash-01, filter-lines, download-cloud-02,
// plus, arrow-down, dots-vertical, chevrons) whose vector geometry did not
// survive extraction. These are the closest CDN-available match — Lucide,
// same 24px grid and round 2px stroke. Flagged in readme → Iconography.
const S = (d) => `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
export default {
  "TableTrash": { viewBox: "0 0 24 24", body: S('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>') },
  "TableFilter": { viewBox: "0 0 24 24", body: S('<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>') },
  "TableDownload": { viewBox: "0 0 24 24", body: S('<path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/>') },
  "TablePlus": { viewBox: "0 0 24 24", body: S('<path d="M5 12h14"/><path d="M12 5v14"/>') },
  "TableArrowDown": { viewBox: "0 0 24 24", body: S('<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>') },
  "TableMore": { viewBox: "0 0 24 24", body: S('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>') },
  "TableChevronLeft": { viewBox: "0 0 24 24", body: S('<path d="m15 18-6-6 6-6"/>') },
  "TableChevronRight": { viewBox: "0 0 24 24", body: S('<path d="m9 18 6-6-6-6"/>') },
  "TableCopy": { viewBox: "0 0 24 24", body: S('<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>') },
  "TableCheck": { viewBox: "0 0 24 24", body: S('<path d="M20 6 9 17l-5-5"/>') },
};
