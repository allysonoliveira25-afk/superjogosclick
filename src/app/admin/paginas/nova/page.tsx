import PageForm from "@/components/admin/PageForm";

export default function NewPagePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Nova página</h1>
      <div className="mt-4 max-w-2xl">
        <PageForm />
      </div>
    </div>
  );
}
