import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="py-20 bg-background pt-32">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Effective Date: October 2026</p>
          </motion.div>

          <div className="prose prose-slate max-w-none space-y-12">
            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us when you fill out a contact form, request a quote, or communicate with us through our website. This may include your name, email address, phone number, company name, and any other information you choose to provide.
              </p>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                <li>Respond to your inquiries and provide requested information</li>
                <li>Process and follow up on your requests for quotes</li>
                <li>Send technical notices, updates, and administrative messages</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Data Protection</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                GHAUS CORP takes reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We implement technical and organizational security measures to protect your personal data.
              </p>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Contact Us</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                <p className="font-bold text-foreground">GHAUS CORP</p>
                <p className="text-sm text-muted-foreground">Dubai, United Arab Emirates</p>
                <p className="text-sm text-muted-foreground">Email: info@ghausglobal.com </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
