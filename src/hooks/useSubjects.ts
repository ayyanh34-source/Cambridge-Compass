import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Subject, Category, CATEGORY_LABELS, CategorySlug } from "../types";

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubjects() {
            setLoading(true);

            const { data: subjectRows, error: subjectError } = await supabase
                .from("subjects")
                .select("id, name, syllabus_code")
                .order("name");

            const { data: categoryRows, error: categoryError } = await supabase
                .from("categories")
                .select("id, subject_id, slug, name");

            const { data: resourceCounts, error: resourceError } = await supabase
                .from("resources")
                .select("subject_id");

            if (subjectError || categoryError || resourceError || !subjectRows || !categoryRows) {
                setError(subjectError?.message ?? categoryError?.message ?? resourceError?.message ?? "Failed to load subjects");
                setLoading(false);
                return;
            }

            const countsBySubject = new Map<string, number>();
            (resourceCounts ?? []).forEach((r) => {
                countsBySubject.set(r.subject_id, (countsBySubject.get(r.subject_id) ?? 0) + 1);
            });

            const result: Subject[] = subjectRows.map((s) => {
                const categories: Category[] = categoryRows
                    .filter((c) => c.subject_id === s.id)
                    .map((c) => ({
                        id: c.id,
                        subjectId: c.subject_id,
                        slug: c.slug as CategorySlug,
                        name: c.name ?? CATEGORY_LABELS[c.slug as CategorySlug],
                    }));

                return {
                    id: s.id,
                    name: s.name,
                    syllabusCode: s.syllabus_code,
                    documentCount: countsBySubject.get(s.id) ?? 0,
                    categories,
                };
            });

            setSubjects(result);
            setLoading(false);
        }

        fetchSubjects();
    }, []);

    return { subjects, loading, error };
}