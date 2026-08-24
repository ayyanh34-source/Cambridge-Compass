const JSDELIVR_BASE = "https://cdn.jsdelivr.net/gh/ayyanh34-source/Compass-resources@main";

export function getResourceUrl(filePath: string): string {
    return `${JSDELIVR_BASE}/${encodeURI(filePath)}`;
}