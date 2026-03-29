"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateLiveClassLinks } from "@/lib/validation/liveClassLinks";
import { cn } from "@/lib/utils";

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

const inputSurfaceClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/35 focus-visible:ring-offset-0";

const inputInvalidClass =
  "border-red-200 focus-visible:border-red-300 focus-visible:ring-red-400/30";

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
    return <p className="text-sm text-gray-600">Loading…</p>;
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-lg border border-red-200/80 bg-white p-4 shadow-sm md:p-6">
        <p className="text-sm text-red-600">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-900 hover:bg-gray-50"
          onClick={() => load()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-gray-600 shadow-sm md:p-8">
        No live courses found. Mark a course as live in the catalog to manage
        links here.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
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
            className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:space-y-5 md:p-6"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900">{c.title}</h2>
              <p className="mt-1 space-y-1 text-sm leading-relaxed text-gray-600">
                <span className="block sm:inline">
                  Course ID: {c.course_id}
                  {" · "}
                  Price: {formatCoursePrice(c.price)}
                  {c.updated_at ? (
                    <>
                      {" "}
                      · Last updated:{" "}
                      {new Date(c.updated_at).toLocaleString("en-IN")}
                    </>
                  ) : null}
                </span>
                {!hasLink ? (
                  <span className="block text-amber-800">
                    No link record yet — save will create one.
                  </span>
                ) : null}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-1">
              <div className="space-y-2">
                <Label
                  htmlFor={`live-${c.course_id}`}
                  className="text-gray-900"
                >
                  Live class URL
                </Label>
                <p className="text-xs text-gray-500">
                  Required. Must be a valid https (or http) meeting link.
                </p>
                <Input
                  id={`live-${c.course_id}`}
                  type="url"
                  placeholder="https://…"
                  value={d.liveClassUrl}
                  aria-invalid={Boolean(validationMessage)}
                  className={cn(inputSurfaceClass, validationMessage && inputInvalidClass)}
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
                <Label htmlFor={`wa-${c.course_id}`} className="text-gray-900">
                  WhatsApp group link
                </Label>
                <p className="text-xs text-gray-500">
                  Required. Use a chat.whatsapp.com or wa.me group/invite URL.
                </p>
                <Input
                  id={`wa-${c.course_id}`}
                  type="url"
                  placeholder="https://chat.whatsapp.com/…"
                  value={d.whatsappGroupUrl}
                  aria-invalid={Boolean(validationMessage)}
                  className={cn(inputSurfaceClass, validationMessage && inputInvalidClass)}
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
              className="bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700"
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
