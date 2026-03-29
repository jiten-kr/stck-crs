"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type LiveCourseRow = {
  course_id: number;
  title: string;
  link_id: number | null;
  live_class_url: string | null;
  whatsapp_group_url: string | null;
  updated_at: string | null;
};

type Draft = Record<
  number,
  { liveClassUrl: string; whatsappGroupUrl: string }
>;

export default function ManageLiveClassLinksClient() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<LiveCourseRow[]>([]);
  const [draft, setDraft] = useState<Draft>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/live-class-links", {
        cache: "no-store",
      });
      const data = (await res.json().catch(() => null)) as {
        courses?: LiveCourseRow[];
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load courses");
      }
      const list = data.courses || [];
      setCourses(list);
      const nextDraft: Draft = {};
      for (const c of list) {
        nextDraft[c.course_id] = {
          liveClassUrl: c.live_class_url ?? "",
          whatsappGroupUrl: c.whatsapp_group_url ?? "",
        };
      }
      setDraft(nextDraft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(courseId: number, hasLink: boolean) {
    const row = draft[courseId];
    if (!row) return;

    setSavingId(courseId);
    try {
      const payload = {
        courseId,
        liveClassUrl: row.liveClassUrl.trim() || null,
        whatsappGroupUrl: row.whatsappGroupUrl.trim() || null,
      };

      const res = await fetch("/api/admin/live-class-links", {
        method: hasLink ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as {
        link?: { updated_at?: string };
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data?.error || "Save failed");
      }

      toast({
        title: hasLink ? "Updated" : "Created",
        description: "Live class links saved.",
      });

      await load();
    } catch (e) {
      toast({
        title: "Could not save",
        description: e instanceof Error ? e.message : "Save failed",
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => load()}>
          Retry
        </Button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No live courses found. Mark a course as live in the catalog to manage
        links here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {courses.map((c) => {
        const d = draft[c.course_id] ?? {
          liveClassUrl: "",
          whatsappGroupUrl: "",
        };
        const hasLink = c.link_id != null;

        return (
          <div
            key={c.course_id}
            className="space-y-4 rounded-lg border p-4 md:p-6"
          >
            <div>
              <h2 className="text-lg font-medium">{c.title}</h2>
              <p className="text-sm text-muted-foreground">
                Course ID: {c.course_id}
                {c.updated_at ? (
                  <>
                    {" "}
                    · Last updated: {new Date(c.updated_at).toLocaleString("en-IN")}
                  </>
                ) : null}
                {!hasLink ? (
                  <span className="block text-amber-700">
                    No link record yet — save will create one.
                  </span>
                ) : null}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor={`live-${c.course_id}`}>Live class URL</Label>
                <Input
                  id={`live-${c.course_id}`}
                  type="url"
                  placeholder="https://…"
                  value={d.liveClassUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      [c.course_id]: {
                        ...d,
                        liveClassUrl: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`wa-${c.course_id}`}>WhatsApp group link</Label>
                <Input
                  id={`wa-${c.course_id}`}
                  type="url"
                  placeholder="https://chat.whatsapp.com/…"
                  value={d.whatsappGroupUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      [c.course_id]: {
                        ...d,
                        whatsappGroupUrl: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <Button
              type="button"
              disabled={savingId === c.course_id}
              onClick={() => save(c.course_id, hasLink)}
            >
              {savingId === c.course_id ? "Saving…" : hasLink ? "Save changes" : "Create links"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
