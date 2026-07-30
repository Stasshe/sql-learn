"use client";

import Link from "next/link";

import { JoinSection } from "@/components/join-union/JoinSection";
import { UnionSection } from "@/components/join-union/UnionSection";

export default function JoinUnionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← 一覧に戻る
        </Link>

        <h1 className="text-4xl font-bold mt-4 mb-2">JOIN と UNION</h1>
        <p className="text-muted-foreground mb-16">
          ボタンを切り替えて、テーブルの結合と行の対応関係の変化を確認する。
        </p>

        <JoinSection />

        <div className="border-t border-border my-16" />

        <UnionSection />
      </div>
    </main>
  );
}
