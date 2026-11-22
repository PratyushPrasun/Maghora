import React from "react";
import type { Metadata } from "next";
import { ContactClient } from "@/components/storefront/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Maghora — Ancient Roots, Modern Taste",
  description:
    "Get in touch with the Maghora team for customer support, order assistance, wholesale inquiries, and corporate gifting. Hand-roasted in pure olive oil.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Maghora — Ancient Roots, Modern Taste",
    description:
      "Reach out to Maghora. Direct customer support, order inquiries, and wholesale collaborations for our premium makhana.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
