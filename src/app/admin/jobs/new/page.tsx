import JobForm from "@/src/app/components/admin/job-form";

export default function NewJobPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <JobForm mode="create" />
    </div>
  );
}
