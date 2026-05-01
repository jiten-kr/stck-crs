import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlayCircle, Radio, Star } from "lucide-react";
import { Course } from "@/lib/types";
import { formatPriceInr } from "@/lib/utils";

export type CourseFormat = "live" | "prerecorded";

type RenderCourseListProps = {
  courses: Course[];
  /** Drives colors, badges, and borders so live vs pre-recorded are easy to tell apart. */
  format: CourseFormat;
  title?: string;
  description?: string;
  disableCta?: boolean;
  badgeText?: string;
  /** When true (e.g. inside tabs), skips outer section padding and nested container. */
  embedded?: boolean;
};

const formatStyles = {
  live: {
    sectionPanel: "rounded-2xl border-2 border-blue-100 bg-blue-50/50 p-4 shadow-sm md:p-6",
    card: "border-2 border-blue-100 bg-white shadow-sm sm:flex-row sm:items-stretch",
    thumbBadge: "bg-blue-600 text-white",
    formatPill: "bg-blue-100 text-blue-800",
    iconWrap: "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100",
    iconClass: "h-7 w-7 text-blue-600",
    eyebrow: "text-xs font-medium uppercase tracking-wide text-blue-600",
    ctaEnabled:
      "w-full shrink-0 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto",
    ctaDisabled:
      "w-full shrink-0 border-blue-200 bg-blue-50 text-blue-600 sm:w-auto",
  },
  prerecorded: {
    sectionPanel:
      "rounded-2xl border-2 border-purple-100 bg-purple-50/40 p-4 shadow-sm md:p-6",
    card: "border-2 border-purple-100 bg-white shadow-sm sm:flex-row sm:items-stretch",
    thumbBadge: "bg-purple-600 text-white",
    formatPill: "bg-purple-100 text-purple-800",
    iconWrap:
      "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100",
    iconClass: "h-7 w-7 text-purple-600",
    eyebrow: "text-xs font-medium uppercase tracking-wide text-purple-600",
    ctaEnabled:
      "w-full shrink-0 border-2 border-purple-200 bg-white text-purple-800 hover:bg-purple-50 sm:w-auto",
    ctaDisabled:
      "w-full shrink-0 border-purple-200 bg-purple-50 text-purple-600 sm:w-auto",
  },
} as const;

function formatLabel(f: CourseFormat) {
  return f === "live" ? "Live" : "Pre-recorded";
}

function formatSubtitle(f: CourseFormat) {
  return f === "live"
    ? "Instructor-led sessions in real time"
    : "Learn anytime — structured video courses";
}

function FormatIcon({ format }: { format: CourseFormat }) {
  const cls = formatStyles[format];
  const Icon = format === "live" ? Radio : PlayCircle;
  return (
    <div className={cls.iconWrap}>
      <Icon className={cls.iconClass} aria-hidden />
    </div>
  );
}

function formatUpdatedMonthYear(iso: string): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function lectureCount(course: Course): number {
  return course.curriculum.reduce((n, s) => n + s.lessons.length, 0);
}

/** Live listings use `enrollmentHref` when set; otherwise `/courses/[id]`. */
function resolveCourseHref(course: Course, format: CourseFormat): string {
  if (format === "live") {
    const raw = course.enrollmentHref?.trim();
    if (raw) {
      return raw.startsWith("/") ? raw : `/${raw}`;
    }
  }
  return `/courses/${course.id}`;
}

function RatingStars({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, rating));
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 0; i < 5; i++) {
    if (clamped >= i + 1) stars.push("full");
    else if (clamped >= i + 0.5) stars.push("half");
    else stars.push("empty");
  }
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {stars.map((kind, index) =>
        kind === "full" ? (
          <Star
            key={index}
            className="h-4 w-4 shrink-0 fill-orange-500 text-orange-500"
            aria-hidden
          />
        ) : kind === "half" ? (
          <span key={index} className="relative inline-flex h-4 w-4 shrink-0">
            <Star
              className="absolute inset-0 h-4 w-4 fill-gray-200 text-gray-200"
              aria-hidden
            />
            <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
              <Star className="h-4 w-4 fill-orange-500 text-orange-500" aria-hidden />
            </span>
          </span>
        ) : (
          <Star
            key={index}
            className="h-4 w-4 shrink-0 fill-gray-200 text-gray-200"
            aria-hidden
          />
        )
      )}
    </div>
  );
}

function CourseTextBlock({
  course,
  format,
  badgeText,
  updatedLabel,
  lectures,
}: {
  course: Course;
  format: CourseFormat;
  badgeText?: string;
  updatedLabel: string | null;
  lectures: number;
}) {
  const pill = formatStyles[format].formatPill;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${pill}`}
        >
          {formatLabel(format)}
        </span>
        {badgeText ? (
          <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
            {badgeText}
          </span>
        ) : null}
      </div>
      <h2 className="text-balance text-lg font-bold leading-snug text-gray-900 md:text-xl">
        {course.title}
      </h2>
      <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>
      <p className="text-xs text-gray-500">By {course.instructor.name}</p>
      <p className="text-xs text-gray-600">
        {updatedLabel ? (
          <>
            Updated{" "}
            <span className="font-medium text-green-700">{updatedLabel}</span>
          </>
        ) : null}
        {updatedLabel ? <span aria-hidden> • </span> : null}
        <span>{course.duration}</span>
        {lectures > 0 ? (
          <>
            <span aria-hidden> • </span>
            <span>{lectures} lectures</span>
          </>
        ) : null}
        <span aria-hidden> • </span>
        <span>{course.level}</span>
      </p>
      {course.rating > 0 || course.reviewCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {course.rating > 0 ? (
            <>
              <span className="text-sm font-bold tabular-nums">
                {course.rating.toFixed(1)}
              </span>
              <RatingStars rating={course.rating} />
            </>
          ) : null}
          <span className="text-sm text-gray-600">({course.reviewCount})</span>
        </div>
      ) : null}
    </div>
  );
}

const courseThumbSizes = "(max-width: 640px) 100vw, 280px";

function CourseThumbnail({
  course,
  href,
  format,
}: {
  course: Course;
  href?: string;
  format: CourseFormat;
}) {
  const thumbBadge = formatStyles[format].thumbBadge;
  const thumbInner = (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 sm:absolute sm:inset-0 sm:aspect-auto sm:min-h-[160px] sm:h-full sm:w-full">
      <Image
        src={course.image || "/placeholder.svg"}
        alt={course.title}
        fill
        className="object-cover"
        sizes={courseThumbSizes}
      />
      <span
        className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${thumbBadge}`}
      >
        {format === "live" ? "Live" : "Video"}
      </span>
    </div>
  );

  const shellClass =
    "relative w-full shrink-0 sm:w-[38%] sm:min-w-[160px] sm:max-w-[280px] sm:self-stretch sm:min-h-[160px]";

  if (href) {
    return (
      <Link href={href} className={shellClass}>
        {thumbInner}
      </Link>
    );
  }

  return <div className={shellClass}>{thumbInner}</div>;
}

export default function RenderCourseList({
  courses,
  format,
  title = "Explore Our Courses",
  description = "Discover our most popular courses chosen by thousands of students",
  disableCta = false,
  badgeText,
  embedded = false,
}: RenderCourseListProps) {
  const cls = formatStyles[format];

  const sectionClass = embedded ? "w-full" : "w-full py-10 md:py-14";

  const headerAndList = (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <FormatIcon format={format} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className={cls.eyebrow}>{formatSubtitle(format)}</p>
          <h2
            {...(!embedded ? { id: `courses-${format}-heading` } : {})}
            className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-gray-600 sm:mx-0 mx-auto md:text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className={`flex flex-col gap-4 ${cls.sectionPanel}`}>
        {courses.map((course) => {
          const updatedLabel = formatUpdatedMonthYear(course.updatedAt);
          const lectures = lectureCount(course);
          const href = resolveCourseHref(course, format);

          const priceBlock = disableCta ? (
            <span className="font-bold text-gray-500">TBA</span>
          ) : course.discountedPrice ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPriceInr(course.discountedPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPriceInr(course.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPriceInr(course.price)}
            </span>
          );

          const btnVariant = format === "prerecorded" ? "outline" : "default";

          const actions = disableCta ? (
            <Button
              disabled
              variant={btnVariant}
              className={cls.ctaDisabled}
            >
              Coming Soon
            </Button>
          ) : (
            <Button asChild variant={btnVariant} className={cls.ctaEnabled}>
              <Link href={href}>View Course</Link>
            </Button>
          );

          return (
            <Card
              key={course.id}
              className={`flex flex-col overflow-hidden rounded-xl ${cls.card}`}
            >
              <CourseThumbnail
                course={course}
                href={disableCta ? undefined : href}
                format={format}
              />

              <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col p-0">
                {disableCta ? (
                  <div className="flex min-h-full flex-1 flex-col justify-between gap-3 p-4 md:p-5">
                    <CourseTextBlock
                      course={course}
                      format={format}
                      badgeText={badgeText}
                      updatedLabel={updatedLabel}
                      lectures={lectures}
                    />
                    <CardFooter className="flex flex-col gap-3 border-0 p-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {priceBlock}
                      </div>
                      {actions}
                    </CardFooter>
                  </div>
                ) : (
                  <>
                    <Link
                      href={href}
                      className="flex min-h-0 min-w-0 flex-1 flex-col text-left text-gray-900 no-underline hover:opacity-90"
                    >
                      <div className="flex flex-1 flex-col gap-3 p-4 pb-3 md:p-5 md:pb-4">
                        <CourseTextBlock
                          course={course}
                          format={format}
                          updatedLabel={updatedLabel}
                          lectures={lectures}
                        />
                      </div>
                    </Link>
                    <CardFooter className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5 md:py-5">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {priceBlock}
                      </div>
                      {actions}
                    </CardFooter>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );

  return (
    <section
      className={sectionClass}
      {...(embedded
        ? { "aria-label": title }
        : { "aria-labelledby": `courses-${format}-heading` })}
    >
      {embedded ? (
        <div className="mx-auto w-full max-w-5xl">{headerAndList}</div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{headerAndList}</div>
        </div>
      )}
    </section>
  );
}
