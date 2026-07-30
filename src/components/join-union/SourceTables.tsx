"use client";

import type { Order, User } from "./data";
import { orders, users } from "./data";
import type { RowState } from "./TableGrid";
import { TableGrid } from "./TableGrid";

interface SourceTablesProps {
  userState: (id: number) => RowState;
  orderState: (id: number) => RowState;
  registerRowRef: (key: string, el: HTMLTableRowElement | null) => void;
}

export function SourceTables({ userState, orderState, registerRowRef }: SourceTablesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TableGrid<User>
        title="users"
        columns={[
          { header: "id", cell: (u) => u.id, mono: true },
          { header: "name", cell: (u) => u.name },
        ]}
        rows={users.map((u) => ({
          key: `user-${u.id}`,
          data: u,
          state: userState(u.id),
        }))}
        registerRowRef={registerRowRef}
      />
      <TableGrid<Order>
        title="orders"
        columns={[
          { header: "id", cell: (o) => o.id, mono: true },
          { header: "user_id", cell: (o) => o.user_id, mono: true },
          { header: "item", cell: (o) => o.item },
        ]}
        rows={orders.map((o) => ({
          key: `order-${o.id}`,
          data: o,
          state: orderState(o.id),
        }))}
        registerRowRef={registerRowRef}
      />
    </div>
  );
}
