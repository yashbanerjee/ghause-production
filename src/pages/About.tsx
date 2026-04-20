import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Target, Eye, Award, Factory, ShieldCheck } from "lucide-react";
import aboutHeroImg from "@/assets/image2.png";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const About = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={aboutHeroImg}
            alt="Engineering Banner"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        </div>

        <div className="container relative z-10 text-secondary-foreground">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn("max-w-4xl", isRtl && "text-right")}
          >
            <div className={cn("flex items-center gap-3 mb-6", isRtl && "flex-row-reverse justify-start")}>
              <div className="w-12 h-[1px] bg-primary" />
              <span className="text-sm font-semibold text-primary tracking-[0.2em] uppercase">{t('about.hero.tagline')}</span>
            </div>

            <h1 className={cn("text-5xl md:text-6xl lg:text-8xl font-display leading-[0.95] mb-8 lg:-ml-1", isRtl && "lg:ml-0 lg:-mr-1")}>
              {t('about.hero.titlePart1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                {t('about.hero.titleHighlight')}
              </span>
            </h1>

            <p className={cn("text-lg md:text-2xl text-secondary-foreground/80 max-w-2xl leading-relaxed font-light", isRtl && "mr-0 ml-auto")}>
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Decorative corner element */}
        <div className={cn("absolute bottom-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mb-32", isRtl ? "left-0 -ml-32" : "right-0 -mr-32")} />
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn("p-8 rounded-xl border border-border bg-card", isRtl && "text-right")}
          >
            <Target className={cn("w-10 h-10 text-primary mb-4", isRtl && "ml-auto")} />
            <h3 className="font-display text-2xl text-foreground mb-3 uppercase">{t('about.mission.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.mission.desc')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn("p-8 rounded-xl border border-border bg-card", isRtl && "text-right")}
          >
            <Eye className={cn("w-10 h-10 text-primary mb-4", isRtl && "ml-auto")} />
            <h3 className="font-display text-2xl text-foreground mb-3 uppercase">{t('about.vision.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.vision.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quality & Compliance */}
      <section className="py-20 bg-background">
        <div className="container grid md:grid-cols-2 gap-10">
          <div className={cn(isRtl && "text-right")}>
            <ShieldCheck className={cn("w-8 h-8 text-primary mb-4", isRtl && "ml-auto")} />
            <h3 className="font-display text-3xl text-foreground mb-4 uppercase">{t('about.quality.title')}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('about.quality.desc')}
            </p>
            <ul className="space-y-3 text-base text-muted-foreground">
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t('about.quality.points.testing')}
              </li>
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t('about.quality.points.rd')}
              </li>
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t('about.quality.points.solutions')}
              </li>
            </ul>
          </div>
          <div className={cn(isRtl && "text-right")}>
            <Award className={cn("w-8 h-8 text-primary mb-4", isRtl && "ml-auto")} />
            <h3 className="font-display text-3xl text-foreground mb-4 uppercase">{t('about.compliance.title')}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('about.compliance.desc')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                t('compliance.certs.nfpa.name'),
                t('compliance.certs.ul.name'),
                t('compliance.certs.fm.name'),
                t('compliance.certs.civilDefense.name')
              ].map(cert => (
                <div key={cert} className="p-4 rounded-lg border border-border bg-muted/50 text-center">
                  <span className="font-display text-base text-primary">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
