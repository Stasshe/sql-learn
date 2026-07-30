import type { JoinType } from "./join-engine";
import type { UnionMode } from "./union-engine";

export interface User {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  user_id: number;
  item: string;
}

export const users: User[] = [
  { id: 1, name: "Aoi" },
  { id: 2, name: "Ben" },
  { id: 3, name: "Cho" },
  { id: 4, name: "Dai" },
];

export const orders: Order[] = [
  { id: 101, user_id: 1, item: "Keyboard" },
  { id: 102, user_id: 1, item: "Mouse" },
  { id: 103, user_id: 2, item: "Monitor" },
  { id: 104, user_id: 9, item: "Webcam" },
];

export interface Customer {
  id: number;
  name: string;
  city: string;
}

export const customers2024: Customer[] = [
  { id: 1, name: "Aoi", city: "Tokyo" },
  { id: 2, name: "Ben", city: "Osaka" },
  { id: 3, name: "Cho", city: "Nagoya" },
];

export const customers2025: Customer[] = [
  { id: 1, name: "Aoi", city: "Tokyo" },
  { id: 2, name: "Ben", city: "Osaka" },
  { id: 5, name: "Emi", city: "Fukuoka" },
];

const joinSql: Record<JoinType, string> = {
  INNER: "SELECT *\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;",
  LEFT: "SELECT *\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;",
  RIGHT: "SELECT *\nFROM users\nRIGHT JOIN orders ON users.id = orders.user_id;",
  FULL: "SELECT *\nFROM users\nFULL JOIN orders ON users.id = orders.user_id;",
};

export function buildJoinSql(type: JoinType): string {
  return joinSql[type];
}

const unionSql: Record<UnionMode, string> = {
  UNION: "SELECT * FROM customers_2024\nUNION\nSELECT * FROM customers_2025;",
  "UNION ALL": "SELECT * FROM customers_2024\nUNION ALL\nSELECT * FROM customers_2025;",
};

export function buildUnionSql(mode: UnionMode): string {
  return unionSql[mode];
}
