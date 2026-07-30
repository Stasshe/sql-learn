export type TopicStatus = "available" | "coming-soon";

export interface Topic {
  slug: string;
  title: string;
  description: string;
  status: TopicStatus;
}

export const topics: Topic[] = [
  {
    slug: "join-union",
    title: "JOIN と UNION",
    description: "2つのテーブルを結合・連結する仕組みを、アニメーションで視覚的に理解する。",
    status: "available",
  },
];
