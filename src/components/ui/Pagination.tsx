"use client";

import { Ic } from "@/components/ui/Icons";

interface PaginationProps {
  total: number;
  page?: number;
  pageSize?: number;
  onChange?: (p: number) => void;
}

export function Pagination({
  total,
  page = 1,
  pageSize = 12,
  onChange,
}: PaginationProps) {
  const pages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="pagination">
      <div>
        {total === 0 ? (
          "Aucun résultat"
        ) : (
          <>
            Affichage{" "}
            <strong>
              {start}–{end}
            </strong>{" "}
            sur <strong>{total.toLocaleString("fr-FR")}</strong>
          </>
        )}
      </div>
      <div className="nav">
        <button disabled={page <= 1} onClick={() => onChange?.(page - 1)}>
          <Ic.ChevronL />
        </button>
        <span style={{ fontSize: 12, padding: "0 8px" }}>
          Page <strong>{page}</strong> sur {pages || 1}
        </span>
        <button disabled={page >= pages} onClick={() => onChange?.(page + 1)}>
          <Ic.ChevronR />
        </button>
      </div>
    </div>
  );
}
