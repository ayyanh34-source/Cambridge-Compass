import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase env vars. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CANONICAL_CATEGORIES = [
    { name: "Syllabus", slug: "syllabus" },
    { name: "Notes", slug: "notes" },
    { name: "Books", slug: "books" },
    { name: "Practice Materials", slug: "practice_materials" },
    { name: "Helpful Resources", slug: "helpful_resources" },
];

const CATEGORY_EXCLUSIONS: Record<string, string[]> = {
    "Chemistry": ["helpful_resources"],
    "Computer Science": ["helpful_resources"],
    "English": ["notes", "practice_materials"],
    "Environmental Management": ["helpful_resources"],
    "ISL": ["practice_materials"],
    "Maths": [],
    "Pakistan Studies": [],
    "Physics": ["helpful_resources"],
    "Urdu": ["notes", "books"],
};

async function seedCategories() {
    const { data: subjects, error } = await supabase.from("subjects").select("id, name");
    if (error || !subjects) {
        console.error("Failed to fetch subjects:", error);
        return;
    }

    for (const subject of subjects) {
        const excluded = CATEGORY_EXCLUSIONS[subject.name];

        if (excluded === undefined) {
            console.warn(`No exclusion entry for "${subject.name}" — skipping to avoid wrong data. Check name matches exactly.`);
            continue;
        }

        const categoriesToInsert = CANONICAL_CATEGORIES
            .filter((c) => !excluded.includes(c.slug))
            .map((c) => ({ subject_id: subject.id, name: c.name, slug: c.slug }));

        const { error: insertError } = await supabase.from("categories").insert(categoriesToInsert);

        if (insertError) {
            console.error(`Failed for ${subject.name}:`, insertError);
        } else {
            console.log(`Seeded ${categoriesToInsert.length} categories for ${subject.name}`);
        }
    }

    console.log("Category seeding complete.");
}

seedCategories();