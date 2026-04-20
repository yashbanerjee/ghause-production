import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Certifications = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const certs = [
    {
      name: t('compliance.certs.nfpa.name'),
      category: t('compliance.certs.nfpa.category'),
      desc: t('compliance.certs.nfpa.desc'),
      authority: t('compliance.certs.nfpa.authority')
    },
    {
      name: t('compliance.certs.ul.name'),
      category: t('compliance.certs.ul.category'),
      desc: t('compliance.certs.ul.desc'),
      authority: t('compliance.certs.ul.authority')
    },
    {
      name: t('compliance.certs.fm.name'),
      category: t('compliance.certs.fm.category'),
      desc: t('compliance.certs.fm.desc'),
      authority: t('compliance.certs.fm.authority')
    },
    {
      name: t('compliance.certs.civilDefense.name'),
      category: t('compliance.certs.civilDefense.category'),
      desc: t('compliance.certs.civilDefense.desc'),
      authority: t('compliance.certs.civilDefense.authority')
    },
  ];

  return (
    <Layout>
      <section className="gradient-navy text-secondary-foreground py-20 overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(isRtl && "text-right")}
          >
            <Award className={cn("w-10 h-10 text-primary mb-4", isRtl && "ml-auto")} />
            <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6 uppercase">{t('compliance.title')}</h1>
            <p className={cn("text-lg text-secondary-foreground/70 max-w-2xl", isRtl && "ml-auto")}>
              {t('compliance.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className={cn("p-6 rounded-xl border border-border bg-card flex flex-col", isRtl && "text-right")}
            >
              <div className={cn("flex items-center gap-2 mb-3", isRtl && "flex-row-reverse")}>
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary uppercase">
                  {cert.category}
                </span>
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">{cert.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cert.desc}</p>
              <p className="text-xs text-muted-foreground/60 mt-3">{cert.authority}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Certifications;
