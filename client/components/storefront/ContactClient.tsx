"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Phone,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  MithilaLotus,
  MithilaCorner,
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
    a: "Yes! For bespoke corporate gifting, festive boxes, and wholesale distribution inquiries, please email us directly at maghora0408@gmail.com, call +91 88939 32380, or WhatsApp +91 88939 32380 with your requirements.",
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
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);

    setSubmissionStatus({ submitted: true, data });
    toast.success("Thank you! Your message has been received.");
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918893932380";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+918893932380";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "maghora0408@gmail.com";

  return (
    <div className="bg-[#F8EEDC] min-h-screen py-8 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contact Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>Customer Care &amp; Inquiries</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#33251F]">
            Connect With Maghora
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed max-w-2xl mx-auto">
            Whether you have questions regarding our roasted flavours, orders, corporate gifting, or wholesale collaborations — our team is here to assist.
          </p>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Verified Contact Information & Brand Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-8 shadow-[0_8px_30px_rgba(112,44,50,0.04)]">
              <MithilaCorner className="absolute top-3 left-3 h-5 w-5 text-[#E8B84E]" />
              <MithilaCorner className="absolute top-3 right-3 h-5 w-5 text-[#E8B84E] rotate-90" />
              <MithilaCorner className="absolute bottom-3 left-3 h-5 w-5 text-[#E8B84E] -rotate-90" />
              <MithilaCorner className="absolute bottom-3 right-3 h-5 w-5 text-[#E8B84E] rotate-180" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C65D35] block mb-1 font-serif">
                Direct Channels
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#33251F] mb-5">
                Official Business Info
              </h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#702C32] text-[#F8EEDC] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#33251F] font-serif">
                      Customer Support Email
                    </h3>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-xs sm:text-sm font-semibold text-[#702C32] hover:underline break-all mt-0.5 inline-block"
                    >
                      {contactEmail}
                    </a>
                    <p className="text-[11px] text-[#7B685F] mt-0.5">
                      Response within 24 business hours
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#702C32] text-[#F8EEDC] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#33251F] font-serif">
                      Call Support
                    </h3>
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-xs sm:text-sm font-semibold text-[#702C32] hover:underline mt-0.5 inline-block"
                    >
                      +91 88939 32380
                    </a>
                    <p className="text-[11px] text-[#7B685F] mt-0.5">
                      Mon–Sat, 10:00 AM to 6:00 PM IST
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#33251F] font-serif">
                      WhatsApp Quick Help
                    </h3>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-[#536B42] hover:underline mt-0.5 inline-block"
                    >
                      +91 88939 32380 · Chat on WhatsApp
                    </a>
                    <p className="text-[11px] text-[#7B685F] mt-0.5">
                      Instant queries, order assistance &amp; bulk support
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#C65D35] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#33251F] font-serif">
                      Address &amp; Operations Hub
                    </h3>
                    <p className="text-xs sm:text-sm text-[#33251F] font-medium mt-0.5">
                      Patna, Bihar, India
                    </p>
                    <p className="text-[11px] text-[#7B685F] mt-0.5">
                      Authentic Mithila GI procurement &amp; distribution
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Mithila Sourcing Note */}
            <div className="rounded-2xl border border-[#E8D7BE] bg-[#FDF9F0] p-4 text-xs text-[#33251F]/75 leading-relaxed">
              <span className="font-serif font-bold text-[#702C32] block mb-1">
                Authentic Heritage Sourcing
              </span>
              Maghora partners directly with certified Mithila pond farmers in Bihar. All orders are dispatched nationwide via secure online fulfillment.
            </div>
          </div>

          {/* Right Column: React Hook Form + FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-8 shadow-[0_8px_30px_rgba(112,44,50,0.04)]">
              <div className="mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C65D35] block mb-1 font-serif">
                  Inquiry Form
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#33251F]">
                  Send Us a Message
                </h2>
              </div>

              {submissionStatus.submitted ? (
                <div className="p-6 bg-[#F8EEDC]/40 rounded-2xl border border-[#E8D7BE] text-center space-y-2">
                  <span className="h-10 w-10 rounded-full bg-[#536B42] text-white flex items-center justify-center mx-auto text-lg">
                    ✓
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#33251F]">Message Sent</h3>
                  <p className="text-xs text-[#7B685F]">
                    Thank you for reaching out, {submissionStatus.data?.fullName}. We will reply to {submissionStatus.data?.email} shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmissionStatus({ submitted: false });
                      reset();
                    }}
                    className="mt-3 text-xs text-[#702C32] font-serif font-bold uppercase tracking-wider underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block mb-1">
                        Full Name *
                      </label>
                      <input
                        {...register("fullName")}
                        placeholder="Your full name"
                        className="w-full h-10 rounded-xl border border-[#E8D7BE] px-3 text-xs text-[#33251F] focus:ring-2 focus:ring-[#702C32]/30 focus:outline-none"
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="name@example.com"
                        className="w-full h-10 rounded-xl border border-[#E8D7BE] px-3 text-xs text-[#33251F] focus:ring-2 focus:ring-[#702C32]/30 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        {...register("mobile")}
                        placeholder="10-digit number"
                        className="w-full h-10 rounded-xl border border-[#E8D7BE] px-3 text-xs text-[#33251F] focus:ring-2 focus:ring-[#702C32]/30 focus:outline-none"
                      />
                      {errors.mobile && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.mobile.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block mb-1">
                        Subject *
                      </label>
                      <input
                        {...register("subject")}
                        placeholder="Order, Gifting, Wholesale..."
                        className="w-full h-10 rounded-xl border border-[#E8D7BE] px-3 text-xs text-[#33251F] focus:ring-2 focus:ring-[#702C32]/30 focus:outline-none"
                      />
                      {errors.subject && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block mb-1">
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-[#E8D7BE] p-3 text-xs text-[#33251F] focus:ring-2 focus:ring-[#702C32]/30 focus:outline-none"
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 min-h-[44px] rounded-xl bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-8 shadow-[0_8px_30px_rgba(112,44,50,0.04)] space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#33251F] mb-3">
                Frequently Asked Questions
              </h3>

              <div className="divide-y divide-[#E8D7BE]/60">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="py-3.5">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full min-h-[40px] flex items-center justify-between text-left text-xs sm:text-sm font-serif font-bold text-[#33251F] hover:text-[#702C32] transition-colors cursor-pointer py-1"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? "rotate-180 text-[#702C32]" : "text-[#7B685F]"
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="mt-2 text-xs text-[#7B685F] leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
