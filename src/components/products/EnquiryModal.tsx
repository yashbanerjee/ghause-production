import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const countries = [
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", 
  "United States", "United Kingdom", "Canada", "Australia", "India", "Pakistan", "Egypt", "Jordan", 
  "Iraq", "Lebanon", "Syria", "Turkey"
  // ... more can be added later
];

export const EnquiryModal = ({ isOpen, onClose, productName }: EnquiryModalProps) => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    country: "",
    comment: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.country) {
      toast.error(t("products.enquiryModal.toastRequired"));
      return;
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast.error(t("products.enquiryModal.toastPhoneInvalid"));
      return;
    }

    setIsSubmitting(true);
    try {
      // Store the country code from the phone input if it exists
      const phoneCountryCode = formData.phone ? parsePhoneNumber(formData.phone)?.country : null;
      
      await api.post("/send-inquiry", {
        ...formData,
        country: phoneCountryCode ? `${formData.country} (${phoneCountryCode})` : formData.country,
        productName,
        type: 'PRODUCT',
        message: formData.comment || `Enquiry for ${productName}`,
        source: `Product Details: ${productName}`
      });
      toast.success(t("products.enquiryModal.toastSuccess"));
      onClose();
      setFormData({ name: "", address: "", phone: "", email: "", country: "", comment: "" });
    } catch (error) {
      console.error(error);
      toast.error(t("products.enquiryModal.toastError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(100%,calc(100vw-1.5rem))] max-w-[min(640px,calc(100vw-1.5rem))] max-h-[min(90dvh,90vh)] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader className="min-w-0 shrink-0">
          <DialogTitle className="text-xl font-bold text-primary uppercase sm:text-2xl">
            {t("products.enquiryModal.title")}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {t("products.enquiryModal.intro", { product: productName })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-4 py-2 sm:py-4">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="name">{t("products.enquiryModal.fullName")}</Label>
            <Input 
              id="name" 
              placeholder={t("products.enquiryModal.placeholderName")} 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="min-w-0"
            />
          </div>

          <div className="grid min-w-0 gap-2">
            <Label htmlFor="email">{t("products.enquiryModal.email")}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={t("products.enquiryModal.placeholderEmail")} 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="min-w-0"
            />
          </div>

          {/* Full-width rows: side-by-side phone + country breaks PhoneInput below ~560px per column */}
          <div className="grid min-w-0 grid-cols-1 gap-4">
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="phone">{t("products.enquiryModal.phone")}</Label>
              <div className="min-w-0 w-full [&_.PhoneInput]:flex [&_.PhoneInput]:w-full [&_.PhoneInput]:min-w-0 [&_.PhoneInput]:items-center [&_.PhoneInput]:gap-1">
                <PhoneInput
                  id="phone"
                  defaultCountry="AE"
                  placeholder={t("products.enquiryModal.placeholderPhone")}
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                  className={cn(
                    "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-2 py-1 text-base ring-offset-background",
                    "placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  )}
                  numberInputProps={{
                    className:
                      "PhoneInputInput min-w-0 flex-1 border-0 bg-transparent py-0 shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0",
                  }}
                  limitMaxLength={true}
                />
              </div>
            </div>
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="country">{t("products.enquiryModal.country")}</Label>
              <Select 
                value={formData.country} 
                onValueChange={(val) => setFormData({ ...formData, country: val })}
              >
                <SelectTrigger id="country" className="w-full min-w-0">
                  <SelectValue placeholder={t("products.enquiryModal.selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  <SelectItem value="Other">{t("products.enquiryModal.countryOther")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid min-w-0 gap-2">
            <Label htmlFor="address">{t("products.enquiryModal.address")}</Label>
            <Input 
              id="address" 
              placeholder={t("products.enquiryModal.placeholderAddress")} 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="min-w-0"
            />
          </div>

          <div className="grid min-w-0 gap-2">
            <Label htmlFor="comment">{t("products.enquiryModal.comments")}</Label>
            <Textarea 
              id="comment" 
              placeholder={t("products.enquiryModal.placeholderComments")} 
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="min-h-[100px] min-w-0 resize-y text-base sm:text-sm"
            />
          </div>

          <DialogFooter className="min-w-0 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t("products.enquiryModal.cancel")}
            </Button>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto sm:min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("products.enquiryModal.sending")}
                </>
              ) : (
                t("products.enquiryModal.send")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
