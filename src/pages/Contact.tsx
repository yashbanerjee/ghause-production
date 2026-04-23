import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const contactSchema = z.object({
    fullName: z.string().min(2, t('contact.namePlaceholder') + " is required"),
    companyName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().refine(val => val ? isValidPhoneNumber(val) : false, "Valid phone number is required"),
    subject: z.string().min(3, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const offices = [
    { city: t('contact.offices.canada'), email: "ca@ghauscorp.com" },
    { city: t('contact.offices.uae'), email: "uae@ghauscorp.com" },
    { city: t('contact.offices.uk'), email: "uk@ghauscorp.com" },
    { city: t('contact.offices.india'), email: "in@ghauscorp.com" },
  ];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState({ num1: Math.floor(Math.random() * 10), num2: Math.floor(Math.random() * 10) });
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      toast.error(isRtl ? "إجابة خاطئة. يرجى المحاولة مرة أخرى." : "Incorrect captcha answer. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    try {
      const response = await fetch(`${API_BASE}/send-inquiry?_t=${Date.now()}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          message: data.message,
          phone: data.phone,
          company: data.companyName,
          subject: data.subject,
          country: data.phone ? (parsePhoneNumber(data.phone)?.country || 'AE') : 'AE',
          type: 'CONTACT',
          source: `Contact Page`
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      if (result.success) {
        setSuccess(true);
        setCaptchaAnswer("");
        setCaptcha({ num1: Math.floor(Math.random() * 10), num2: Math.floor(Math.random() * 10) });
        toast.success(t('contact.successMessage'));
        reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Email Error:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('contact.tagline')}</span>
            <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6">{t('contact.title')}</h1>
            <p className={cn("text-lg text-secondary-foreground/70 max-w-2xl", isRtl && "ml-auto")}>
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(isRtl && "text-right")}
          >
            <h2 className="font-display text-3xl text-foreground mb-6 uppercase">{t('contact.formTitle')}</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {success && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
                  {t('contact.successMessage')}
                </div>
              )}
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-6">
                  {error}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input {...register("fullName")} placeholder={t('contact.fullName')} className={cn(errors.fullName ? "border-destructive" : "", isRtl && "text-right")} />
                  {errors.fullName && <span className="text-[10px] text-destructive mt-1">{errors.fullName.message}</span>}
                </div>
                <div>
                  <Input {...register("companyName")} placeholder={t('contact.companyName')} className={cn(isRtl && "text-right")} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input {...register("email")} type="email" placeholder={t('contact.email')} className={cn(errors.email ? "border-destructive" : "", isRtl && "text-right")} />
                  {errors.email && <span className="text-[10px] text-destructive mt-1">{errors.email.message}</span>}
                </div>
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        defaultCountry="AE"
                        placeholder={t('contact.phone')}
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          errors.phone ? "border-destructive focus-within:ring-destructive" : "",
                          isRtl && "text-right flex-row-reverse [&>.PhoneInputCountry]:ml-2 [&>.PhoneInputCountry]:mr-0"
                        )}
                        numberInputProps={{
                          className: "PhoneInputInput border-0 bg-transparent outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none",
                          style: { border: 'none', backgroundColor: 'transparent', boxShadow: 'none', outline: 'none' }
                        }}
                        limitMaxLength={true}
                      />
                    )}
                  />
                  {errors.phone && <span className="text-[10px] text-destructive mt-1">{errors.phone.message}</span>}
                </div>
              </div>
              <div>
                <Input {...register("subject")} placeholder={t('contact.subject')} className={cn(errors.subject ? "border-destructive" : "", isRtl && "text-right")} />
                {errors.subject && <span className="text-[10px] text-destructive mt-1">{errors.subject.message}</span>}
              </div>
              <div>
                <Textarea {...register("message")} placeholder={t('contact.message')} rows={5} className={cn("resize-none", errors.message && "border-destructive", isRtl && "text-right")} />
                {errors.message && <span className="text-[10px] text-destructive mt-1">{errors.message.message}</span>}
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className={cn("flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50 border border-border w-full sm:w-auto", isRtl && "flex-row-reverse")}>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {t('contact.securityCheck', { num1: captcha.num1, num2: captcha.num2 })}
                  </span>
                  <Input
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder={t('contact.answer')}
                    className="w-20 h-9 bg-background"
                    required
                  />
                </div>
              </div>
              <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                <Button size="lg" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />
                      {t('contact.sending')}
                    </>
                  ) : (
                    t('contact.sendButton')
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">{t('contact.respondTime')}</span>
              </div>
            </form>
          </motion.div>

          {/* Offices */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(isRtl && "text-right")}
          >
            <h2 className="font-display text-3xl text-foreground mb-6">{t('contact.globalOffices')}</h2>
            <div className="space-y-4">
              {offices.map((office) => (
                <div key={office.city} className="p-5 rounded-xl border border-border bg-card">
                  <h4 className="font-display text-lg text-foreground mb-1">{office.city}</h4>
                  <p className="text-sm text-primary font-medium">{office.email}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
