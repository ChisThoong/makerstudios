"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Calendar, MapPin, Send } from "lucide-react";
import { useLanguage } from "../context/language-context";
import ContactModal from "../components/contact-modal";

export default function ContactUsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxMessageLength = 500;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [modalMessage, setModalMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    setModalOpen(true);
    setModalStatus("loading");
  
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          title: formData.subject,
          message: formData.message,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message);
  
      setModalStatus("success");
      setModalMessage(t("contact.success"));
  
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setModalStatus("error");
      setModalMessage(err.message || t("contact.error"));
    }
  }
  
  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email'),
      items: ["contact@makerstudios.gg"],
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      items: ["+099-9999-9999"],
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Calendar,
      title: t('contact.hours'),
      items: [t('contact.saturday')],
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      items: ["19 Dinh Bo Linh"],
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-24">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0a1628] to-[#1a2942] overflow-hidden">
        {/* Tech Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          {/* <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#3b82f6" />
                <line x1="10" y1="10" x2="50" y2="30" stroke="#3b82f6" strokeWidth="1" />
                <circle cx="50" cy="30" r="2" fill="#3b82f6" />
                <line x1="50" y1="30" x2="80" y2="60" stroke="#3b82f6" strokeWidth="1" />
                <circle cx="80" cy="60" r="2" fill="#3b82f6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-pattern)" />
          </svg> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                {t('contact.badge')}
              </h1>
              
              <div className="flex items-center space-x-2 text-md">
                <a href="/" className="hover:text-blue-400 transition-colors">
                  {t('nav.home')}
                </a>
                <span className="text-blue-400">|</span>
                <span className="text-blue-400">{t('contact.badge')}</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop"
                  alt="Contact Us"
                  className="rounded-lg shadow-2xl h-72 mx-auto"
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
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Section - Form */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-md font-medium">
                {t('contact.badge')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t('contact.title')}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {t('contact.description')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder={t('contact.fullName')}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  type="email"
                  placeholder={t('contact.emailAddress')}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Input
                placeholder={t('contact.subject')}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />

              <div className="relative">
                <Textarea
                  placeholder={t('contact.message')}
                  value={formData.message}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= maxMessageLength) {
                      setFormData({ ...formData, message: newValue });
                    }
                  }}
                  required
                  
                  maxLength={maxMessageLength}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none  min-h-[160px]" 
                />
                <div className="absolute bottom-3 right-3 text-md text-gray-500">
                  {formData.message.length}/{maxMessageLength}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
              >
                {isSubmitting ? (
                  t('contact.sending')
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('contact.sendButton')}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Section - Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div
                    className={`${info.bgColor} w-16 h-16 mx-auto rounded-2xl flex items-center justify-center`}
                  >
                    <info.icon className={`w-8 h-8 ${info.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">
                    {info.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {info.items.map((item, idx) => (
                      <p key={idx} className="text-gray-600 text-md">
                        {item}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    <ContactModal
      isOpen={modalOpen}
      status={modalStatus}
      message={modalMessage}
      onClose={() => setModalOpen(false)}
    />

    </div>
  );
}