import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ResourceDocument, CATEGORY_LABELS, CategorySlug } from "../types";

export function useSubjectResources(subjectId: string | null) {
    const [resources, setResources] = useState<ResourceDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!subjectId) {
            setResources([]);
            setLoading(false);
            return;
        }

        async function fetchResources() {
            setLoading(true);

            const { data, error } = await supabase
                .from("resources")
                .select(
                    "id, title, file_path, subfolder, year, file_size_bytes, subject_id, subjects(name), categories(slug, name)"
                )
                .eq("subject_id", subjectId)
                .order("year", { ascending: false });

            if (error || !data) {
                console.error("Failed to fetch resources:", error);
                setResources([]);
                setLoading(false);
                return;
            }

            const mapped: ResourceDocument[] = data.map((r: any) => ({
                id: r.id,
                title: r.title,
                filePath: r.file_path,
                subjectId: r.subject_id,
                subjectName: r.subjects?.name ?? "",
                categorySlug: r.categories?.slug as CategorySlug,
                categoryLabel: r.categories?.name ?? CATEGORY_LABELS[r.categories?.slug as CategorySlug],
                subfolder: r.subfolder,
                year: r.year,
                fileSizeBytes: r.file_size_bytes,
                fileType: "PDF",
            }));

            setResources(mapped);
            setLoading(false);
        }

        fetchResources();
    }, [subjectId]);

    return { resources, loading };
}