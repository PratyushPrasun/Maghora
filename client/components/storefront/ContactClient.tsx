"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  MapPin,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  MithilaLotus,
  MithilaCorner,
  MithilaDivider,
} from "@/components/storefront/MithilaMotifs";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(80, "Full name cannot exceed 80 characters"),
  email: z
    .string()
    .email("Please provide a valid email address (e.g. name@example.com)"),
  mobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
    ),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters long")
    .max(120, "Subject cannot exceed 120 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message cannot exceed 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FAQS = [
  {
    q: "Where is Maghora makhana sourced?",
    a: "All Maghora makhana is sourced directly from certified freshwater wetland ponds (pokhars) in the Mithila region of northern Bihar, the ancient historical heart of foxnut cultivation.",
  },
  {
    q: "Why does Maghora roast exclusively in olive oil?",
    a: "Unlike common commercial snacks that are fried in palm oil or hydrogenated vegetable fats, Maghora gently slow-roasts jumbo kernels in pure extra virgin olive oil. This delivers an airy, crisp texture with zero greasy film.",
  },
  {
    q: "How fast do orders ship?",
    a: "Orders are processed within 24 to 48 hours from our fulfillment hub and delivered across India within 3 to 6 business days. Free shipping applies on all orders above ₹499.",
  },
  {
    q: "Do you offer bulk, wholesale, or corporate gifting?",
    a: "Yes! For bespoke corporate gifting, festive boxes, and wholesale distribution inquiries, please email us directly at support@maghora.com with your requirements.",
  },
];

export function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    submitted: boolean;
    data?: ContactFormData;
  }>({ submitted: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate validation turnaround time
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);

    // Record submission state
    setSubmissionStatus({ submitted: true, data });

    toast.warning("Backend API Notice", {
      description:
        "The server contact endpoint (POST /api/contact) is currently pending implementation. Please use direct email to reach our team.",
      duration: 6000,
    });
  };

  const generateMailtoUrl = (data?: ContactFormData) => {
    if (!data) return "mailto:support@maghora.com";
    const subject = encodeURIComponent(`[Maghora Inquiry] ${data.subject}`);
    const body = encodeURIComponent(
      `From: ${data.fullName}\nEmail: ${data.email}\nMobile: ${data.mobile}\n\nMessage:\n${data.message}`
    );
    return `mailto:support@maghora.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-[#F7F0E3] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contact Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECE3D0]/80 border border-[#E2D7C3] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#B85C38]" />
            <span>Customer Care &amp; Inquiries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820]">
            Connect With Maghora
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#292820]/70 leading-relaxed max-w-2xl mx-auto">
            Whether you have questions regarding our roasted flavours, orders, corporate gifting, or wholesale collaborations — our team is here to assist.
          </p>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Verified Contact Information & Brand Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl border border-[#E2D7C3] bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(41,40,32,0.05)]">
              <MithilaCorner className="absolute top-3 left-3 h-6 w-6 text-[#C49A50]/70" />
              <MithilaCorner className="absolute top-3 right-3 h-6 w-6 text-[#C49A50]/70 rotate-90" />
              <MithilaCorner className="absolute bottom-3 left-3 h-6 w-6 text-[#C49A50]/70 -rotate-90" />
              <MithilaCorner className="absolute bottom-3 right-3 h-6 w-6 text-[#C49A50]/70 rotate-180" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C49A50] block mb-1">
                Direct Channels
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#292820] mb-6">
                Official Business Info
              </h2>

              <ul className="space-y-6">
                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#244C38] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                      Customer Support Email
                    </h3>
                    <a
                      href="mailto:support@maghora.com"
                      className="text-sm font-semibold text-[#B85C38] hover:underline break-all mt-0.5 inline-block"
                    >
                      support@maghora.com
                    </a>
                    <p className="text-[11px] text-[#292820]/60 mt-0.5">
                      Response within 24 business hours
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#B85C38] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                      Heritage Origin &amp; Sourcing Hub
                    </h3>
                    <p className="text-sm text-[#292820] font-medium mt-0.5">
                      Mithila Region, Bihar, India
                    </p>
                    <p className="text-[11px] text-[#292820]/60 mt-0.5">
                      Direct wetland procurement network
                    </p>
                  </div>
                </li>
              </ul>

              {/* Social Channels */}
              <div className="mt-8 pt-6 border-t border-[#E2D7C3]/70">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#292820]/60 block mb-3">
                  Official Social Channels
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-[#F7F0E3] hover:bg-[#ECE3D0] text-[#292820] flex items-center justify-center border border-[#E2D7C3] transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-[#F7F0E3] hover:bg-[#ECE3D0] text-[#292820] flex items-center justify-center border border-[#E2D7C3] transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-[#F7F0E3] hover:bg-[#ECE3D0] text-[#292820] flex items-center justify-center border border-[#E2D7C3] transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Mithila Sourcing Note */}
            <div className="rounded-2xl border border-[#E2D7C3] bg-[#ECE3D0]/50 p-5 text-xs text-[#292820]/75 leading-relaxed">
              <span className="font-serif font-bold text-[#244C38] block mb-1">
                Authentic Heritage Sourcing
              </span>
              Maghora partners directly with certified Mithila pond farmers in Bihar. We do not operate commercial retail storefronts for walk-in shopping; all orders are dispatched nationwide via secure online fulfillment.
            </div>
          </div>

          {/* Right Column: React Hook Form + Zod Validation */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E2D7C3] bg-white p-7 sm:p-10 shadow-[0_8px_30px_rgba(41,40,32,0.05)]">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C49A50] block mb-1">
                  Inquiry Form
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#292820]">
                  Send a Message
                </h2>
                <p className="text-xs text-[#292820]/65 mt-1">
                  Fill in your details and our team will get back to you promptly.
                </p>
              </div>

              {/* Form Status Notification when submitted */}
              {submissionStatus.submitted && (
                <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-amber-950">
                        Inquiry Form Validated Locally
                      </p>
                      <p className="leading-relaxed">
                        <strong>Technical Status Notice:</strong> The backend endpoint{" "}
                        <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-amber-900">
                          POST /api/contact
                        </code>{" "}
                        is not yet implemented on the server. To ensure your message is delivered immediately, please open your email client with your pre-filled inquiry.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={generateMailtoUrl(submissionStatus.data)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#244C38] hover:bg-[#1A3728] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Send via Email to support@maghora.com</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmissionStatus({ submitted: false });
                        reset();
                      }}
                      className="text-xs font-semibold text-amber-950 hover:underline cursor-pointer"
                    >
                      Clear &amp; Reset Form
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold uppercase tracking-wider text-[#292820] mb-1.5"
                  >
                    Full Name <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    placeholder="e.g. Radhika Sharma"
                    className={`h-11 w-full rounded-xl border bg-[#FDFBF7] px-4 text-sm text-[#292820] placeholder:text-[#292820]/35 focus:outline-none transition-colors ${
                      errors.fullName
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E2D7C3] focus:border-[#C49A50]"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Address & Mobile Number in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-[#292820] mb-1.5"
                    >
                      Email Address <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="name@example.com"
                      className={`h-11 w-full rounded-xl border bg-[#FDFBF7] px-4 text-sm text-[#292820] placeholder:text-[#292820]/35 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-[#E2D7C3] focus:border-[#C49A50]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-xs font-bold uppercase tracking-wider text-[#292820] mb-1.5"
                    >
                      Mobile Number <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      {...register("mobile")}
                      placeholder="10-digit mobile number"
                      className={`h-11 w-full rounded-xl border bg-[#FDFBF7] px-4 text-sm text-[#292820] placeholder:text-[#292820]/35 focus:outline-none transition-colors ${
                        errors.mobile
                          ? "border-red-400 focus:border-red-500"
                          : "border-[#E2D7C3] focus:border-[#C49A50]"
                      }`}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-bold uppercase tracking-wider text-[#292820] mb-1.5"
                  >
                    Subject <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    placeholder="e.g. Order inquiry, Wholesale partnership, Feedback"
                    className={`h-11 w-full rounded-xl border bg-[#FDFBF7] px-4 text-sm text-[#292820] placeholder:text-[#292820]/35 focus:outline-none transition-colors ${
                      errors.subject
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E2D7C3] focus:border-[#C49A50]"
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-wider text-[#292820] mb-1.5"
                  >
                    Message <span className="text-[#B85C38]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    placeholder="Please describe your question or message in detail..."
                    className={`w-full rounded-xl border bg-[#FDFBF7] p-4 text-sm text-[#292820] placeholder:text-[#292820]/35 focus:outline-none transition-colors resize-y ${
                      errors.message
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E2D7C3] focus:border-[#C49A50]"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[200px] h-11 px-8 rounded-full bg-[#244C38] hover:bg-[#1A3728] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Support Section */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
          <MithilaDivider className="mb-10 sm:mb-12" text="Frequently Asked Questions" />

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E2D7C3] bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-[#FDFBF7] transition-colors"
                  >
                    <span className="font-serif text-sm sm:text-base font-bold text-[#292820]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#C49A50] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#292820]/75 leading-relaxed border-t border-[#E2D7C3]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
