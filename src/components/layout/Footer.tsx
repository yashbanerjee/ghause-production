import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState({ num1: Math.floor(Math.random() * 10), num2: Math.floor(Math.random() * 10) });
   const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_BASE}/products?isFeatured=true`);
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.data || []);
        setFeaturedProducts(products.slice(0, 5)); // Show top 5
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchFeatured();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      toast.error(isRtl ? "إجابة خاطئة. يرجى المحاولة مرة أخرى." : "Incorrect captcha answer. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    try {
      const response = await fetch(`${API_BASE}/send-inquiry?_t=${Date.now()}`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, type: 'QUICK', source: "Footer Form" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send inquiry");
      }

      if (result.success) {
        setSuccess(true);
        setMessage("");
        setCaptchaAnswer("");
        setCaptcha({ num1: Math.floor(Math.random() * 10), num2: Math.floor(Math.random() * 10) });
        toast.success(t('footer.success'));
      } else {
        throw new Error(result.error || "Failed to send inquiry");
      }

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="gradient-navy text-secondary-foreground ltr:text-left rtl:text-right">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div className={cn(isRtl && "text-right")}>
            <div className={cn("flex items-center gap-2.5 mb-6", isRtl && "flex-row-reverse justify-start")}>
              <img src={logo} alt="GHAUS CORP" className="h-[88px] w-auto object-contain" />
              <div className="leading-tight">
                <span className="font-display text-lg tracking-wide block">GHAUS CORP</span>
                <span className="block text-[9px] font-medium opacity-60 tracking-[0.2em] uppercase">
                  {t('home.hero.tagline').split('—')[1]?.trim() || 'Fire & Safety Solutions'}
                </span>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="space-y-3 text-sm">
              <a href="tel:+971508638007" className={cn("flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity", isRtl && "flex-row-reverse")}>
                <Phone className="w-4 h-4 text-primary" /> <span dir="ltr">+971 50 863 8007</span>
              </a>
              <a href="tel:+16473838693" className={cn("flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity", isRtl && "flex-row-reverse")}>
                <Phone className="w-4 h-4 text-primary" /> <span dir="ltr">+1 647 383 8693 (For Canada Only)</span>
              </a>
              <a href="mailto:info@ghauscorp.com" className={cn("flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity", isRtl && "flex-row-reverse")}>
                <Mail className="w-4 h-4 text-primary" /> <span>info@ghauscorp.com</span>
              </a>
              <div className={cn("flex items-start gap-2 opacity-70", isRtl && "flex-row-reverse")}>
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{t('contact.offices.uae')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={cn(isRtl && "text-right")}>
            <h4 className="font-display text-lg tracking-wide mb-6 uppercase">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/about", label: t('nav.about') },
                { to: "/products", label: t('nav.products') },
                { to: "/certifications", label: t('nav.compliance') },
                { to: "/contact", label: t('nav.contact') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          {(isFetching || featuredProducts.length > 0) && (
            <div className={cn(isRtl && "text-right")}>
              <h4 className="font-display text-lg tracking-wide mb-6 uppercase">{t('footer.products')}</h4>
              <ul className="space-y-3 text-sm">
                {isFetching ? (
                  <div className="flex items-center gap-2 opacity-50">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs uppercase tracking-widest">{t('footer.sending').replace('...', '')}</span>
                  </div>
                ) : (
                  featuredProducts.map((p) => (
                    <li key={p.id}>
                      <Link 
                        to={`/product/${p.id}`} 
                        className="opacity-70 hover:opacity-100 hover:text-primary transition-all line-clamp-1"
                      >
                        {isRtl ? p.nameAr : p.nameEn}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Quick Inquiry */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-6 uppercase">{t('footer.quickInquiry')}</h4>
            <form className="space-y-3" onSubmit={onSubmit}>
              {success ? (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                  {t('footer.success')}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs ml-2 rtl:mr-2 rtl:ml-0"
                    onClick={() => setSuccess(false)}
                  >
                    {t('footer.sendAnother')}
                  </Button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {error}
                    </div>
                  )}
                  <div>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('footer.namePlaceholder')}
                      required
                      className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 rtl:text-right"
                    />
                  </div>
                  <div>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder={t('footer.emailPlaceholder')}
                      required
                      className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 rtl:text-right"
                    />
                  </div>
                  <div>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('footer.messagePlaceholder')}
                      rows={3}
                      required
                      className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 resize-none rtl:text-right"
                    />
                  </div>
                  <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:justify-end">
                    <span className="text-sm font-medium opacity-80 shrink-0">
                      {t('footer.captchaQuestion', { num1: captcha.num1, num2: captcha.num2 })}
                    </span>
                    <Input
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder={t('footer.captchaAnswer')}
                      required
                      className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 w-24 rtl:text-right"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="sm" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                        {t('footer.sending')}
                      </>
                    ) : (
                      t('footer.sendButton')
                    )}
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-60">
          <span>© 2026 GHaus Corp. {t('footer.rights')}</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
