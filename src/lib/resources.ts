// jsDelivr previews PDFs inline in the browser but caps files at 20MB.
// raw.githubusercontent.com has no size cap but forces a download (Content-Disposition: attachment).
// So: use jsDelivr when the file is small enough to qualify, fall back to raw GitHub otherwise.
const JSDELIVR_BASE = "https://cdn.jsdelivr.net/gh/ayyanh34-source/Compass-resources@main";
const RAW_GITHUB_BASE = "https://raw.githubusercontent.com/ayyanh34-source/Compass-resources/main";

// Slightly under the real 20MB limit as a safety margin.
const JSDELIVR_SIZE_LIMIT = 19 * 1024 * 1024;

export function getResourceUrl(filePath: string, fileSizeBytes?: number | null): string {
    const base =
        fileSizeBytes != null && fileSizeBytes < JSDELIVR_SIZE_LIMIT ? JSDELIVR_BASE : RAW_GITHUB_BASE;
    return `${base}/${encodeURI(filePath)}`;
}

// True if this file will preview inline in the browser rather than force a download.
export function canPreviewInline(fileSizeBytes?: number | null): boolean {
    return fileSizeBytes != null && fileSizeBytes < JSDELIVR_SIZE_LIMIT;
}