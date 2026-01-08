"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { useLanguage } from "../context/language-context";

interface Job {
  _id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  jobType: string;
  experience: string;
  bannerImage?: string;
  description: string;
  createdAt: string;
  applicationEnds?: string;
  status: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs");
        const data = await res.json();
        
        if (data.success) {
          // Only show active jobs
          const activeJobs = data.jobs.filter((job: Job) => job.status === "active");
          setJobs(activeJobs);
          setFilteredJobs(activeJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...jobs];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    // Keyword filter
    if (searchKeyword) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Location filter
    if (searchLocation) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTypes.includes(job.jobType)
      );
    }

    setFilteredJobs(filtered);
  }, [selectedCategory, searchKeyword, searchLocation, selectedJobTypes, jobs]);

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getJobTypeCounts = () => {
    return {
      "full-time": jobs.filter((j) => j.jobType === "full-time").length,
      "part-time": jobs.filter((j) => j.jobType === "part-time").length,
      remote: jobs.filter((j) => j.jobType === "remote").length,
      contract: jobs.filter((j) => j.jobType === "contract").length,
    };
  };

  const getCategoryCount = (category: string) => {
    if (category === "all") return jobs.length;
    return jobs.filter((j) => j.category === category).length;
  };

  const getTimeAgo = (job: Job) => {
    const days = Math.floor(
      (Date.now() - new Date(job.createdAt).getTime()) / 86400000
    );
  
    if (days === 0) return t("careers.today");
    return t("careers.daysAgo").replace("{count}", days.toString());
  };

  const getJobBadge = (job: Job) => {
    const createdDate = new Date(job.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return { label: t("careers.newBadge"), color: "bg-green-500" };
    if (job.jobType === "contract") return { label: t("careers.contract"), color: "bg-orange-500" };
    if (job.jobType === "full-time") return { label: t("careers.fullTime"), color: "bg-blue-500" };
    return null;
  };

  const jobTypeCounts = getJobTypeCounts();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0a1628] to-[#1a2942] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                {t("careers.title")}
              </h1>
              <p className="text-xl text-gray-300">
                {t("careers.description")}
              </p>
              
              <div className="flex items-center space-x-2 text-sm">
                <a href="/" className="hover:text-blue-400 transition-colors">
                  {t("nav.home")}
                </a>
                <span className="text-blue-400">|</span>
                <span className="text-blue-400">{t("nav.carrer")}</span>
              </div>

              <div className="pt-4 flex gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
                  <div className="text-3xl font-bold">{jobs.length}+</div>
                  <div className="text-gray-300">{t("careers.openPositions")}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-gray-300">{t("careers.teamMembers")}</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  alt="Careers"
                  className="rounded-lg shadow-2xl h-80 w-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t("careers.category")}</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t("careers.allCategory")} ({getCategoryCount("all")})</option>
                <option value="developer">Developer ({getCategoryCount("developer")})</option>
                <option value="game-operator">Game Operator ({getCategoryCount("game-operator")})</option>
                <option value="artist">Artist ({getCategoryCount("artist")})</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t("careers.keyword")}</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={t("careers.keywordPlaceholder")}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>


            {/* Job Type Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t("careers.jobType")}</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes("full-time")}
                      onChange={() => toggleJobType("full-time")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{t("careers.fullTime")}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{jobTypeCounts["full-time"]}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes("part-time")}
                      onChange={() => toggleJobType("part-time")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{t("careers.partTime")}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{jobTypeCounts["part-time"]}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes("remote")}
                      onChange={() => toggleJobType("remote")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{t("careers.remote")}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{jobTypeCounts.remote}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes("contract")}
                      onChange={() => toggleJobType("contract")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{t("careers.contract")}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{jobTypeCounts.contract}</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">{t("careers.loading")}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("careers.noJobs")}</h3>
                <p className="text-gray-600">{t("careers.adjustFilter")}</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const badge = getJobBadge(job);

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start gap-6">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        {job.bannerImage ? (
                            <img
                            src={job.bannerImage}
                            alt={job.title}
                            className="w-56 h-56 rounded-lg object-cover border"
                            />
                        ) : (
                            <div className="w-56 h-56 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {job.title.charAt(0)}
                            </span>
                            </div>
                        )}
                        </div>

                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                              {badge && (
                                <span className={`${badge.color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                  {badge.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {getTimeAgo(job)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location || t("careers.remote")}
                          </div>
                          {/* {job.experience && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.experience}
                            </div>
                          )} */}
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Maker Studios
                          </div>
                          <a
                            href={`/careers/${job.slug}`}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            {t("careers.browseJob")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}