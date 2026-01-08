import JobForm from "@/src/app/components/admin/job-form";

interface Props {
  params: Promise<{ id: string }>;
}

async function getJob(id: string) {
  const API_URL = process.env.API_SERVER_URL!;
  const API_KEY = process.env.API_SECRET_KEY!;

  const res = await fetch(`${API_URL}/web/jobs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return { success: false };
  }

  return res.json();
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getJob(id);

  if (!data.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <a
            href="/admin/jobs"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Jobs
          </a>
        </div>
      </div>
    );
  }

  return <JobForm mode="edit" initialData={data.job} />;
}