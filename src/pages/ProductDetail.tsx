import Layout from "@/components/layout/Layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Send, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getApiBaseUrl } from "@/lib/apiBase";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EnquiryModal } from "@/components/products/EnquiryModal";

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  catalogs: string[];
  category: { id: string; nameEn: string; nameAr: string };
}

const ProductDetail = () => {
  const { t, i18n } = useTranslation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const API_BASE = getApiBaseUrl();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      // Add cache-busting to prevent 304 Not Modified responses in production
      const res = await api.get(`/products/${productId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        params: {
          _t: Date.now()
        }
      });
      
      // If the API returns { data: ... } we use .data, otherwise the response itself is the object
      const parsedData = res.data?.data || res.data;
      
      console.log(`[Frontend API] Fetched Product Detail:`, parsedData);
      return parsedData as Product;
    },
    enabled: !!productId
  });

  // 6. Fix Frontend State Handling
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-primary font-medium flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
             <ArrowLeft size={20} /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-white py-12 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("max-w-7xl mx-auto", isRtl && "text-right")}
          >
            {/* Breadcrumbs */}
            <nav className="flex mb-12 text-sm font-medium items-center gap-2 flex-wrap text-muted-foreground border-b border-border pb-4">
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <ChevronRight size={14} className={cn(isRtl && "rotate-180")} />
              <Link to={`/products/${product?.category?.id}`} className="hover:text-primary transition-colors">
                {isRtl ? product?.category?.nameAr : product?.category?.nameEn}
              </Link>
              <ChevronRight size={14} className={cn(isRtl && "rotate-180")} />
              <span className="text-foreground font-semibold truncate max-w-[200px]">
                {isRtl ? product?.nameAr : product?.nameEn}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Product Image Section (Left) */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="aspect-square relative rounded-xl overflow-hidden border border-border/60 shadow-lg bg-white p-8 group flex items-center justify-center"
                >
                  {product?.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${API_BASE}/uploads/${product.image}`} 
                      alt={product?.nameEn} 
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                      <FileText size={80} strokeWidth={0.5} className="opacity-20" />
                    </div>
                  )}
                </motion.div>

                {/* Data Sheet Section - Directly below image as per screenshot */}
                {product?.catalogs && product.catalogs.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {product.catalogs.slice(0, 1).map((url, idx) => (
                      <a 
                        key={idx}
                        href={url.startsWith('http') ? url : `${API_BASE}/uploads/${url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-muted/30 transition-all border border-border shadow-md group w-full md:w-fit"
                      >
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                          <FileText size={24} />
                        </div>
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Download Data Sheet</p>
                        </div>
                        <Download size={18} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity ml-auto" />
                      </a>
                    ))}
                    
                    {/* More Catalogs if present */}
                    {product.catalogs.length > 1 && (
                       <div className="grid gap-2">
                        {product.catalogs.slice(1).map((url, idx) => (
                           <a 
                             key={idx + 1}
                             href={url.startsWith('http') ? url : `${API_BASE}/uploads/${url}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-xs font-medium text-primary hover:underline flex items-center gap-2"
                           >
                             <FileText size={12} /> Alternative Data Sheet {idx + 1}
                           </a>
                        ))}
                       </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Info Section (Right) */}
              <div className="lg:col-span-7 flex flex-col pt-2">
                <div className="mb-8 border-b border-border pb-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-[#a91d1d] leading-tight mb-4 uppercase tracking-tighter">
                    {isRtl ? product?.nameAr : product?.nameEn}
                  </h1>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-semibold text-muted-foreground mb-6 inline-block border-b-2 border-red-200 pr-8 pb-1">
                    Description
                  </h2>
                  <div className="prose prose-slate max-w-none prose-lg">
                    <p className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                      {isRtl ? product?.descriptionAr : product?.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Enquiry Button */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setIsEnquiryOpen(true)}
                    className="h-16 px-12 bg-[#a91d1d] hover:bg-[#8e1818] text-white text-lg font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-1 active:translate-y-0 group"
                  >
                    Send Enquiry
                    <Send className="ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <EnquiryModal 
        isOpen={isEnquiryOpen} 
        onClose={() => setIsEnquiryOpen(false)} 
        productName={isRtl ? product?.nameAr || '' : product?.nameEn || ''} 
      />
    </Layout>
  );
};

export default ProductDetail;
