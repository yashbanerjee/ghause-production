import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Download, Image as ImageIcon, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getApiBaseUrl } from "@/lib/apiBase";
import {
  localizedCategoryName,
  localizedCategoryProductPageDesc,
  localizedProductDescription,
  localizedProductName,
} from "@/lib/localeContent";

interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr?: string | null;
  image: string;
  icon: string;
  productPageDescriptionEn?: string;
  productPageDescriptionAr?: string;
  productPageDescriptionFr?: string | null;
  products?: Product[];
}

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr?: string | null;
  descriptionEn: string;
  descriptionAr: string;
  descriptionFr?: string | null;
  image: string;
  catalogs: string[];
}

const Products = () => {
  const { t, i18n } = useTranslation();
  const { category: categoryId } = useParams();
  const isRtl = i18n.language.startsWith("ar");
  const API_BASE = getApiBaseUrl();

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<any>('/categories');
      return Array.isArray(data) ? data : (data?.data || []);
    },
    enabled: !categoryId
  });

  const { data: products, isLoading: prodsLoading } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const { data } = await api.get<any>(`/products?categoryId=${categoryId}`);
      console.log("Fetched products response:", data);
      
      const parsedProducts = Array.isArray(data) ? data : (data?.data || []);
      
      // Ensure frontend filtering matches category exactly
      const filteredProducts = parsedProducts.filter(
        (p: any) => String(p.categoryId) === String(categoryId)
      );
      
      return filteredProducts;
    },
    enabled: !!categoryId
  });

  const { data: currentCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data } = await api.get<Category>(`/categories/${categoryId}`);
      return data; // Simple object, no data.data needed here usually
    },
    enabled: !!categoryId
  });

  if (categoryId) {
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
              <nav className="flex mb-4 text-sm font-medium">
                <Link to="/products" className="text-primary hover:underline">{t('products.title')}</Link>
                <span className="mx-2">/</span>
                <span className="text-secondary-foreground/70">
                  {currentCategory
                    ? localizedCategoryName(currentCategory, i18n.language)
                    : ""}
                </span>
              </nav>
              <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6 uppercase">
                {currentCategory
                  ? localizedCategoryName(currentCategory, i18n.language)
                  : ""}
              </h1>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container">
            {prodsLoading ? (
              <div className="text-center py-20">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products?.map((prod: Product) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/product/${prod.id}`} className="aspect-square relative overflow-hidden bg-white p-6 border-b border-border/50 block group">
                      {prod.image ? (
                        <img
                          src={prod.image.startsWith('http') ? prod.image : `${API_BASE}/uploads/${prod.image}`}
                          alt=""
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg"><FileText size={48} strokeWidth={1} /></div>
                      )}
                    </Link>
                    <div className={cn("p-6 flex-grow flex flex-col", isRtl && "text-right")}>
                      <Link to={`/product/${prod.id}`} className="group/title">
                        <h3 className="text-xl font-bold mb-2 group-hover/title:text-primary transition-colors leading-tight">
                          {localizedProductName(prod, i18n.language)}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                        {localizedProductDescription(prod, i18n.language)}
                      </p>

                      <div className="mt-auto space-y-4">
                        {prod.catalogs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                              {t("products.catalogs")}
                            </p>
                            <div className="grid gap-2">
                              {prod.catalogs.slice(0, 2).map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url.startsWith('http') ? url : `${API_BASE}/uploads/${url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted transition-colors text-[11px] group/item border border-transparent hover:border-border"
                                >
                                  <Download size={12} className="text-primary" />
                                  <span className="truncate flex-grow font-medium">{url.split('/').pop()?.split('-').slice(1).join('-') || url.split('/').pop()}</span>
                                </a>
                              ))}
                              {prod.catalogs.length > 2 && (
                                <p className="text-[10px] text-muted-foreground italic px-1">
                                  {t("products.moreCatalogs", {
                                    count: prod.catalogs.length - 2,
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <Link 
                          to={`/product/${prod.id}`}
                          className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all mt-4 group/more"
                        >
                          {t("products.viewDetails")}
                          <ChevronRight size={14} className={cn("transition-transform", isRtl ? "rotate-180 group-hover/more:-translate-x-1" : "group-hover/more:translate-x-1")} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </Layout>
    );
  }

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
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">{t('products.tagline')}</span>
            <h1 className="text-5xl lg:text-6xl font-display mt-3 mb-6 uppercase">{t('products.title')}</h1>
            <p className={cn("text-lg text-secondary-foreground/70 max-w-2xl", isRtl && "ml-auto")}>
              {t('products.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container space-y-8">
          {catsLoading ? (
            <div className="text-center py-20">Loading categories...</div>
          ) : (
            categories?.map((cat: any, i: number) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={cn(
                  "grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-border bg-card p-6 lg:p-10",
                  i % 2 === 1 ? "md:direction-rtl" : "",
                  isRtl && "text-right"
                )}>
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    {cat.image ? (
                       <img
                         src={cat.image.startsWith('http') ? cat.image : `${API_BASE}/uploads/${cat.image}`}
                         alt=""
                         className="w-full h-64 object-cover rounded-xl"
                       />
                     ) : (
                       <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">
                         <ImageIcon size={64} className="text-muted-foreground opacity-20" />
                       </div>
                     )}
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    <h3 className="font-display text-3xl text-foreground mb-3">
                      {localizedCategoryName(cat, i18n.language)}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {localizedCategoryProductPageDesc(cat, i18n.language) ||
                        t(`products.categories.${cat.nameEn.toLowerCase()}.desc`)}
                    </p>
                    
                    {cat.products && cat.products.length > 0 && (
                      <div className={cn("flex flex-wrap gap-2 mb-8", isRtl && "justify-end")}>
                        {cat.products.slice(0, 6).map((prod: any) => (
                          <Link 
                            key={prod.id} 
                            to={`/product/${prod.id}`}
                            className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full bg-muted/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border/50 shadow-sm"
                          >
                            {localizedProductName(prod, i18n.language)}
                          </Link>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/products/${cat.id}`}
                      className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all",
                        isRtl && "flex-row-reverse"
                      )}
                    >
                      {t('products.viewProducts')} {isRtl ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
