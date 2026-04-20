import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Scale, ShieldAlert } from "lucide-react";

const TermsConditions = () => {
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
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 uppercase tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground">Effective Date: October 2026</p>
          </motion.div>

          <div className="prose prose-slate max-w-none space-y-12">
            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Agreement to Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing our website at ghausglobal.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Use License</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on GHAUS CORP's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on GHAUS CORP's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Disclaimer</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The materials on GHAUS CORP's website are provided on an 'as is' basis. GHAUS CORP makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold m-0 uppercase flex items-center gap-2">Governing Law</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Dubai, UAE and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsConditions;
