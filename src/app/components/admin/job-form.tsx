"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  FileText,
  Briefcase,
  Calendar,
  Tag,
  X,
} from "lucide-react";

type Mode = "create" | "edit" | "view";

interface Job {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  bannerImage: string;
  category: string;
  location: string;
  jobType: string;
  status: string;
  applicationEnds: string;
  requirements: string;
  responsibilities: string;
  experience: string;
  jobSkills: string[];
}

interface JobFormProps {
  mode: Mode;
  initialData?: Job;
}

export default function JobForm({ mode, initialData }: JobFormProps) {
  const router = useRouter();
  const isView = mode === "view";

  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    bannerImage: initialData?.bannerImage || "",
    category: initialData?.category || "developer",
    location: initialData?.location || "",
    jobType: initialData?.jobType || "full-time",
    status: initialData?.status || "draft",
    applicationEnds: initialData?.applicationEnds
      ? initialData.applicationEnds.slice(0, 10)
      : "",
    requirements: initialData?.requirements || "",
    responsibilities: initialData?.responsibilities || "",
    experience: initialData?.experience || "",
    jobSkills: initialData?.jobSkills || [],
  });

  function update(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (trimmed && !form.jobSkills.includes(trimmed)) {
      update("jobSkills", [...form.jobSkills, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    update("jobSkills", form.jobSkills.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && form.jobSkills.length > 0) {
      removeSkill(form.jobSkills[form.jobSkills.length - 1]);
    }
  }

  async function handleSubmit(saveStatus: "draft" | "active") {
    if (!form.title) {
      toast.error("Job title is required");
      return;
    }

    if (mode === "edit" && !initialData?._id) {
      toast.error("Job ID is missing");
      return;
    }

    setLoading(true);

    const res = await fetch(
      mode === "create" ? "/api/jobs" : `/api/jobs/${initialData!._id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: saveStatus }),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success(
        mode === "create" ? "Job created successfully" : "Job updated successfully"
      );
      router.push("/admin/jobs");
    } else {
      toast.error(data.message || "Failed to save job");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {mode === "create" && "Add New Job"}
                {mode === "edit" && "Edit Job"}
                {mode === "view" && "Job Detail"}
              </h1>

              {!isView && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={loading}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSubmit("active")}
                    disabled={loading}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    {loading ? "Saving..." : "Publish"}
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  disabled={isView}
                  value={form.title}
                  onChange={(e) => {
                    update("title", e.target.value);
                    if (!form.slug) {
                      update(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                      );
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Senior Frontend Engineer"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    makerstudios.gg/careers/
                  </span>
                  <input
                    disabled={isView}
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="senior-frontend-engineer"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  disabled={isView}
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Remote / Ho Chi Minh City"
                />
              </div>

              {/* Job Description */}
              <Section
                title="Job Description"
                value={form.description}
                onChange={(val: string) => update("description", val)}
                disabled={isView}
                rows={5}
                placeholder="Provide a brief overview of the role and what the candidate will be doing..."
              />

              {/* Responsibilities */}
              <Section
                title="Responsibilities"
                value={form.responsibilities}
                onChange={(val: string) => update("responsibilities", val)}
                disabled={isView}
                rows={6}
                placeholder="• Lead the development of new features&#10;• Collaborate with design and product teams&#10;• Mentor junior developers..."
              />

              {/* Requirements */}
              <Section
                title="Requirements"
                value={form.requirements}
                onChange={(val: string) => update("requirements", val)}
                disabled={isView}
                rows={6}
                placeholder="• 5+ years of experience in frontend development&#10;• Strong proficiency in React and TypeScript&#10;• Experience with modern build tools..."
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-80 lg:w-96 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Job Settings</h2>

          {/* Category */}
          <SidebarBox title="Category" icon={<Tag className="w-4 h-4" />}>
            <select
              disabled={isView}
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="developer">Developer</option>
              <option value="game-operator">Game Operator</option>
              <option value="artist">Artist</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Job category for filtering and organization
            </p>
          </SidebarBox>

          {/* Status */}
          <SidebarBox title="Status" icon={<Briefcase className="w-4 h-4" />}>
            <select
              disabled={isView}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {form.status === "draft" && "Not visible to job seekers"}
              {form.status === "active" && "Live and accepting applications"}
              {form.status === "inactive" && "No longer accepting applications"}
            </p>
          </SidebarBox>

          {/* Job Type */}
          <SidebarBox title="Job Type" icon={<Briefcase className="w-4 h-4" />}>
            <select
              disabled={isView}
              value={form.jobType}
              onChange={(e) => update("jobType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="internship">Internship</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
            </select>
          </SidebarBox>

          {/* Experience */}
          <SidebarBox title="Years of Experience" icon={<Briefcase className="w-4 h-4" />}>
            <select
              disabled={isView}
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="fresher">Fresher</option>
              <option value="1">1 year</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              {/* <option value="5">5 years</option>
              <option value="6">6 years</option>
              <option value="7">7 years</option>
              <option value="8">8+ years</option> */}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Minimum years of professional experience required
            </p>
          </SidebarBox>

          {/* Required Skills */}
          <SidebarBox title="Required Skills" icon={<Tag className="w-4 h-4" />}>
            <div className="space-y-3">
              {/* Skills Display */}
              {form.jobSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.jobSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                      {!isView && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Input */}
              {!isView && (
                <div>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => {
                      if (skillInput.trim()) {
                        addSkill(skillInput);
                      }
                    }}
                    placeholder="Type skill and press Enter..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Press Enter or comma to add a skill
                  </p>
                </div>
              )}
            </div>
          </SidebarBox>

          {/* Banner Image */}
          <SidebarBox title="Banner Image" icon={<Briefcase className="w-4 h-4" />}>
            <input
              disabled={isView}
              type="url"
              value={form.bannerImage}
              onChange={(e) => update("bannerImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
            />
            {form.bannerImage && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={form.bannerImage}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23f3f4f6' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Recommended: 800x800px, max 2MB
            </p>
          </SidebarBox>

          {/* Application Deadline */}
          <SidebarBox
            title="Application Deadline"
            icon={<Calendar className="w-4 h-4" />}
          >
            <input
              disabled={isView}
              type="date"
              value={form.applicationEnds}
              onChange={(e) => update("applicationEnds", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Applications will close on this date
            </p>
          </SidebarBox>

          {/* Quick Tips */}
          {/* {!isView && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Quick Tips
              </h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li>• Use bullet points for better readability</li>
                <li>• Be specific about requirements</li>
                <li>• Add relevant skills as tags</li>
                <li>• Keep job title clear and searchable</li>
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function Section({
  title,
  value,
  onChange,
  disabled,
  rows = 4,
  placeholder = "",
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {title}
      </label>
      <textarea
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
        placeholder={placeholder}
      />
    </div>
  );
}

function SidebarBox({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="pb-6 border-b border-gray-200 last:border-b-0">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}