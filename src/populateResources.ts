import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase env vars. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GITHUB_OWNER = "ayyanh34-source";
const GITHUB_REPO = "Compass-resources";
const GITHUB_BRANCH = "main";

// Folder name (normalized: lowercase, no spaces/dashes/underscores) -> category slug
const FOLDER_TO_SLUG: Record<string, string> = {
    "syllabus": "syllabus",
    "notes": "notes",
    "books": "books",
    "pp": "practice_materials",
    "importantresources": "helpful_resources",
    "yearlies": "practice_materials",         // Environmental Management naming
    "topicals": "practice_materials",         // Pakistan Studies Geography naming
    "practicematerial": "practice_materials", // Urdu spelled it out in full
};

function normalizeFolderName(name: string): string {
    return name.toLowerCase().replace(/[\s_-]+/g, "");
}

// Strips a leading "Geography " or trailing " geo" from a folder name, so
// "Geography Books" -> "Books" and "Notes geo" -> "Notes" before slug lookup.
function stripGeoLabel(name: string): string {
    const prefixStripped = name.replace(/^geography\s+/i, "");
    if (prefixStripped !== name) return prefixStripped;
    return name.replace(/\s+geo$/i, "");
}

function titleFromFilename(filename: string): string {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const spaced = nameWithoutExt.replace(/[_-]+/g, " ").trim();
    return spaced.replace(/\w\S*/g, (word) => {
        if (word === word.toUpperCase() && word.length <= 4) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function extractYear(filename: string): number | null {
    const match = filename.match(/(20\d{2})/);
    return match ? parseInt(match[1], 10) : null;
}

async function main() {
    console.log("Fetching repo tree from GitHub...");
    const treeRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`
    );
    const treeData = await treeRes.json();

    if (!treeData.tree) {
        console.error("Failed to fetch repo tree:", treeData);
        return;
    }

    const filePaths: string[] = treeData.tree
        .filter((item: any) => item.type === "blob")
        .map((item: any) => item.path)
        .filter((path: string) => path.split("/").length >= 2);

    console.log(`Found ${filePaths.length} candidate files.`);

    const { data: subjects } = await supabase.from("subjects").select("id, name");
    const { data: categories } = await supabase.from("categories").select("id, subject_id, slug");
    const { data: existingResources } = await supabase.from("resources").select("file_path");

    if (!subjects || !categories) {
        console.error("Could not load subjects/categories.");
        return;
    }

    const existingPaths = new Set((existingResources ?? []).map((r) => r.file_path));
    console.log(`${existingPaths.size} resources already in the database — these will be skipped.`);

    let inserted = 0;
    let skipped = 0;
    let alreadyExists = 0;

    for (const path of filePaths) {
        if (existingPaths.has(path)) {
            alreadyExists++;
            continue;
        }

        const parts = path.split("/");
        const subjectFolder = parts[0];

        const subject = subjects.find((s) => s.name === subjectFolder);
        if (!subject) {
            console.warn(`Skipping "${path}" — no matching subject for "${subjectFolder}"`);
            skipped++;
            continue;
        }

        let categoryFolder: string;
        let subfolder: string | null;
        let filename: string;
        let componentPrefix: string | null = null;

        if (parts.length === 2) {
            // Loose file directly in subject folder = syllabus
            categoryFolder = "syllabus";
            subfolder = null;
            filename = parts[1];
        } else if (
            subjectFolder === "Pakistan Studies" &&
            parts.length >= 4 &&
            (parts[1] === "Geography" || parts[1] === "History")
        ) {
            // New structure: Pakistan Studies/Geography|History/<category folder>/[subfolders.../]file
            componentPrefix = parts[1];
            categoryFolder = parts[2];
            filename = parts[parts.length - 1];
            subfolder = parts.length > 4 ? parts.slice(3, -1).join(" / ") : null;
        } else {
            categoryFolder = parts[1];
            filename = parts[parts.length - 1];
            subfolder = parts.length > 3 ? parts.slice(2, -1).join(" / ") : null;
        }

        const cleanedCategoryFolder = stripGeoLabel(categoryFolder);

        let slug: string;
        if (normalizeFolderName(cleanedCategoryFolder) === "examinerreports") {
            slug = "helpful_resources";
            subfolder = subfolder ? `Examiner Reports / ${subfolder}` : "Examiner Reports";
        } else {
            slug =
                parts.length === 2 ? "syllabus" : FOLDER_TO_SLUG[normalizeFolderName(cleanedCategoryFolder)];
        }

        if (!slug) {
            console.warn(`Skipping "${path}" — unrecognized category folder "${categoryFolder}"`);
            skipped++;
            continue;
        }

        if (componentPrefix) {
            subfolder = subfolder ? `${componentPrefix} / ${subfolder}` : componentPrefix;
        }

        const category = categories.find((c) => c.subject_id === subject.id && c.slug === slug);
        if (!category) {
            console.warn(
                `Skipping "${path}" — no "${slug}" category exists for ${subjectFolder} (check exclusion table)`
            );
            skipped++;
            continue;
        }

        const { error } = await supabase.from("resources").insert({
            subject_id: subject.id,
            category_id: category.id,
            title: titleFromFilename(filename),
            file_path: path,
            subfolder: subfolder,
            year: extractYear(filename),
        });

        if (error) {
            console.error(`Failed to insert "${path}":`, error.message);
            skipped++;
        } else {
            inserted++;
        }
    }

    console.log(
        `\nDone. Inserted: ${inserted}, Skipped: ${skipped}, Already existed (untouched): ${alreadyExists}`
    );
}

main();