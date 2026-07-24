"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPageById } from "@/lib/pages";
import PageForm from "@/components/admin/PageForm";
import type { CustomPage } from "@/lib/types";

export default function EditPagePage() {
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState<CustomPage | null | undefined>(undefined);

  useEffect(() => {
    void Promise.resolve()
      .then(() => getPageById(params.id))
      .then(setPage);
  }, [params.id]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Editar página</h1>
      <div className="mt-4 max-w-2xl">
        {page === undefined ? (
          <p className="text-muted">Carregando...</p>
        ) : page === null ? (
          <p className="text-muted">Página não encontrada.</p>
        ) : (
          <PageForm initial={page} />
        )}
      </div>
    </div>
  );
}
