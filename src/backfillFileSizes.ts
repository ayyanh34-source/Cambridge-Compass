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

async function main() {
  console.log("Fetching repo tree from GitHub (includes file sizes)...");
  const treeRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`
  );
  const treeData = await treeRes.json();

  if (!treeData.tree) {
    console.error("Failed to fetch repo tree:", treeData);
    return;
  }

  const sizeByPath = new Map<string, number>();
  for (const item of treeData.tree) {
    if (item.type === "blob" && typeof item.size === "number") {
      sizeByPath.set(item.path, item.size);
    }
  }

  console.log(`Got sizes for ${sizeByPath.size} files from GitHub.`);

  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, file_path, file_size_bytes");

  if (error || !resources) {
    console.error("Failed to fetch resources:", error);
    return;
  }

  let updated = 0;
  let skippedAlreadySet = 0;
  let skippedNoMatch = 0;

  for (const r of resources) {
    if (r.file_size_bytes != null) {
      skippedAlreadySet++;
      continue;
    }

    const size = sizeByPath.get(r.file_path);
    if (size == null) {
      console.warn(`No GitHub size found for "${r.file_path}" — path may have changed.`);
      skippedNoMatch++;
      continue;
    }

    const { error: updateError } = await supabase
      .from("resources")
      .update({ file_size_bytes: size })
      .eq("id", r.id);

    if (updateError) {
      console.error(`Failed to update "${r.file_path}":`, updateError.message);
    } else {
      updated++;
    }
  }

  console.log(
    `\nDone. Updated: ${updated}, Already had a size: ${skippedAlreadySet}, No match found: ${skippedNoMatch}`
  );
}

main();
