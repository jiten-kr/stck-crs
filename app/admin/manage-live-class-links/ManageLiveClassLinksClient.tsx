"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateLiveClassLinks } from "@/lib/validation/liveClassLinks";

type LiveCourseRow = {
  course_id: number;
  title: string;
  price: string;
  link_id: number | null;
  live_class_url: string | null;
  whatsapp_group_url: string | null;
  updated_at: string | null;
};

function formatCoursePrice(price: string): string {
  const n = Number.parseFloat(price);
  if (!Number.isFinite(n)) return price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

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
  const [validationByCourse, setValidationByCourse] = useState<
    Record<number, string | null>
  >({});

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

    const validated = validateLiveClassLinks(
      row.liveClassUrl,
      row.whatsappGroupUrl,
    );
    if (!validated.ok) {
      setValidationByCourse((prev) => ({
        ...prev,
        [courseId]: validated.error,
      }));
      toast({
        title: "Check the links",
        description: validated.error,
        variant: "destructive",
      });
      return;
    }

    setValidationByCourse((prev) => ({ ...prev, [courseId]: null }));
    setSavingId(courseId);
    try {
      const payload = {
        courseId,
        liveClassUrl: validated.value.liveClassUrl,
        whatsappGroupUrl: validated.value.whatsappGroupUrl,
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
        const validationMessage = validationByCourse[c.course_id];

        return (
          <div
            key={c.course_id}
            className="space-y-4 rounded-lg border p-4 md:p-6"
          >
            <div>
              <h2 className="text-lg font-medium">{c.title}</h2>
              <p className="text-sm text-muted-foreground">
                Course ID: {c.course_id}
                {" · "}
                Price: {formatCoursePrice(c.price)}
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
                <p className="text-xs text-muted-foreground">
                  Required. Must be a valid https (or http) meeting link.
                </p>
                <Input
                  id={`live-${c.course_id}`}
                  type="url"
                  placeholder="https://…"
                  value={d.liveClassUrl}
                  aria-invalid={Boolean(validationMessage)}
                  onChange={(e) => {
                    setValidationByCourse((prev) => ({
                      ...prev,
                      [c.course_id]: null,
                    }));
                    setDraft((prev) => ({
                      ...prev,
                      [c.course_id]: {
                        ...d,
                        liveClassUrl: e.target.value,
                      },
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`wa-${c.course_id}`}>WhatsApp group link</Label>
                <p className="text-xs text-muted-foreground">
                  Required. Use a chat.whatsapp.com or wa.me group/invite URL.
                </p>
                <Input
                  id={`wa-${c.course_id}`}
                  type="url"
                  placeholder="https://chat.whatsapp.com/…"
                  value={d.whatsappGroupUrl}
                  aria-invalid={Boolean(validationMessage)}
                  onChange={(e) => {
                    setValidationByCourse((prev) => ({
                      ...prev,
                      [c.course_id]: null,
                    }));
                    setDraft((prev) => ({
                      ...prev,
                      [c.course_id]: {
                        ...d,
                        whatsappGroupUrl: e.target.value,
                      },
                    }));
                  }}
                />
              </div>
            </div>

            {validationMessage ? (
              <p className="text-sm text-red-600" role="alert">
                {validationMessage}
              </p>
            ) : null}

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
