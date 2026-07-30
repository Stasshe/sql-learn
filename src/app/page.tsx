import Link from "next/link";

import { topics } from "@/lib/topics";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-2">SQL 講座</h1>
        <p className="text-muted-foreground mb-16">
          手を動かしながらSQLの概念を学ぶ、インタラクティブな講座一覧。
        </p>

        <ol className="border-t border-b border-border divide-y divide-border">
          {topics.map((topic, index) => {
            const content = (
              <>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-medium">{topic.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-9">{topic.description}</p>
                </div>
                <span
                  className={
                    topic.status === "available"
                      ? "text-sm text-primary flex items-center gap-1 shrink-0"
                      : "text-sm text-muted-foreground shrink-0"
                  }
                >
                  {topic.status === "available" ? (
                    <>
                      始める
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </>
                  ) : (
                    "準備中"
                  )}
                </span>
              </>
            );

            return (
              <li key={topic.slug}>
                {topic.status === "available" ? (
                  <Link
                    href={`/${topic.slug}`}
                    className="group flex items-start justify-between gap-6 py-6 -mx-2 px-2 hover:bg-accent/40 transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-start justify-between gap-6 py-6 -mx-2 px-2 opacity-50 pointer-events-none">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
