// Switched from jsDelivr to raw.githubusercontent.com — jsDelivr enforces a hard
// 20MB per-file limit when serving from GitHub repos, which was causing large
// PDFs to fail (or worse, silently download as a corrupted error-text file).
// Raw GitHub has no such cap and still supports cross-origin fetch requests.
const RAW_GITHUB_BASE = "https://raw.githubusercontent.com/ayyanh34-source/Compass-resources/main";
export function getResourceUrl(filePath: string): string {
    return `${RAW_GITHUB_BASE}/${encodeURI(filePath)}`;
}