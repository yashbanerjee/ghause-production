import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const isRtl = i18n.language.startsWith('ar');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    }
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0A192F] text-white border-b border-white/5">
        <div className={cn("container flex items-center justify-between py-2 text-[11px] md:text-xs", isRtl && "flex-row-reverse")}>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="tel: +971585684750 "
              className={cn("flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-white/5 hover:border-primary/30 group", isRtl && "flex-row-reverse")}
            >
              <Phone className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium" dir="ltr">+971 58 568 4750</span>
            </a>
            <a
              href="mailto:info@ghausglobal.com "
              className={cn("flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-white/5 hover:border-primary/30 group", isRtl && "flex-row-reverse")}
            >
              <Mail className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium">info@ghausglobal.com </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity outline-none focus:outline-none">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase">{i18n.language.startsWith('ar') ? 'AR' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem
                  onClick={() => changeLanguage('en')}
                  className="flex items-center justify-between gap-2 text-xs cursor-pointer"
                >
                  English
                  {!i18n.language.startsWith('ar') && <Check className="w-3 h-3 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage('ar')}
                  className="flex items-center justify-between gap-2 text-xs cursor-pointer"
                >
                  العربية (Arabic)
                  {i18n.language.startsWith('ar') && <Check className="w-3 h-3 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="GHAUS CORP" className="h-[73px] w-auto object-contain" />
            <div className="leading-tight">
              <span className="font-display text-xl text-foreground tracking-wide">GHaus Global</span>
              <span className="block text-[10px] font-medium text-muted-foreground tracking-[0.2em] uppercase">{t('home.hero.tagline').split('—')[1]?.trim() || 'Fire & Safety Solutions'}</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavItem to="/" active={isActive("/")}>{t('nav.home')}</NavItem>
            <NavItem to="/about" active={isActive("/about")}>{t('nav.about')}</NavItem>

            {/* Products mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className={cn(
                "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname.startsWith("/products")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              )}>
                {t('nav.products')} <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", megaOpen && "rotate-180")} />
              </button>

              {megaOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[800px]">
                  <div className="bg-card rounded-xl shadow-2xl border border-border p-8 grid grid-cols-3 gap-x-10 gap-y-8">
                    {categories?.map((cat: any) => (
                      <div key={cat.id} className="space-y-3">
                        <Link
                          to={`/products/${cat.id}`}
                          className="font-bold text-[13px] uppercase tracking-wider text-foreground hover:text-primary transition-colors block border-b border-border/50 pb-2"
                          onClick={() => setMegaOpen(false)}
                        >
                          {isRtl ? cat.nameAr : cat.nameEn}
                        </Link>
                        <ul className="space-y-2">
                          {cat.products?.slice(0, 8).map((prod: any) => (
                            <li key={prod.id}>
                              <Link
                                to={`/product/${prod.id}`}
                                className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/item"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="w-1 h-1 rounded-full bg-border group-hover/item:bg-primary transition-colors" />
                                {isRtl ? prod.nameAr : prod.nameEn}
                              </Link>
                            </li>
                          ))}
                          {cat.products?.length > 8 && (
                            <li>
                              <Link
                                to={`/products/${cat.id}`}
                                className="text-[10px] font-bold text-primary hover:underline italic mt-1 block"
                                onClick={() => setMegaOpen(false)}
                              >
                                + {cat.products.length - 8} more...
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-3 border-t border-border pt-4 mt-2 flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground italic">GHAUS Fire & Safety Solutions — Quality you can trust</p>
                      <Link
                        to="/products"
                        className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                        onClick={() => setMegaOpen(false)}
                      >
                        {t('products.viewAll')} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavItem to="/certifications" active={isActive("/certifications")}>{t('nav.compliance')}</NavItem>
            <NavItem to="/contact" active={isActive("/contact")}>{t('nav.contact')}</NavItem>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact">
              <Button variant="default" size="sm">
                {t('nav.requestQuote')}
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card pb-6">
            <div className="container flex flex-col gap-1 pt-4">
              {[
                { to: "/", label: t('nav.home') },
                { to: "/about", label: t('nav.about') },
                { to: "/products", label: t('nav.products') },
                { to: "/certifications", label: t('nav.compliance') },
                { to: "/contact", label: t('nav.contact') },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.to)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-3" size="sm">{t('nav.requestQuote')}</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const NavItem = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "px-4 py-2 text-sm font-medium rounded-md transition-colors",
      active ? "text-primary" : "text-foreground/70 hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

export default Header;
