import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CertificationsSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const certifications = [
    { name: t('compliance.certs.nfpa.name'), label: t('home.standards.labels.fireProtection') },
    { name: t('compliance.certs.ul.name'), label: t('home.standards.labels.productSafety') },
    { name: t('compliance.certs.fm.name'), label: t('home.standards.labels.lossPrevention') },
    { name: t('compliance.certs.civilDefense.name'), label: t('home.standards.labels.govApproval') },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className={`mb-14 ${isRtl ? 'text-right' : 'text-center'}`}>
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('home.standards.tagline')}</span>
          <h2 className="text-4xl lg:text-5xl font-display text-foreground mt-3 uppercase">
            {t('home.standards.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card text-center"
            >
              <span className="font-display text-2xl text-primary">{cert.name}</span>
              <span className="text-xs text-muted-foreground">{cert.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
