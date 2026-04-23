/** Primary UI language from i18n language tag. */
export function primaryLang(i18nLanguage: string): "en" | "ar" | "fr" {
  const base = (i18nLanguage || "en").split("-")[0].toLowerCase();
  if (base === "ar") return "ar";
  if (base === "fr") return "fr";
  return "en";
}

type ProductNames = {
  nameEn: string;
  nameAr: string;
  nameFr?: string | null;
};

type ProductDescriptions = {
  descriptionEn: string;
  descriptionAr: string;
  descriptionFr?: string | null;
};

type CategoryNames = {
  nameEn: string;
  nameAr: string;
  nameFr?: string | null;
};

type CategoryHomeDesc = {
  homeDescriptionEn?: string | null;
  homeDescriptionAr?: string | null;
  homeDescriptionFr?: string | null;
};

type CategoryProductPageDesc = {
  productPageDescriptionEn?: string | null;
  productPageDescriptionAr?: string | null;
  productPageDescriptionFr?: string | null;
};

export function localizedProductName(p: ProductNames, lang: string): string {
  const l = primaryLang(lang);
  if (l === "ar") return p.nameAr;
  if (l === "fr") {
    const f = p.nameFr?.trim();
    return f ? f : p.nameEn;
  }
  return p.nameEn;
}

export function localizedProductDescription(
  p: ProductDescriptions,
  lang: string
): string {
  const l = primaryLang(lang);
  if (l === "ar") return p.descriptionAr;
  if (l === "fr") {
    const f = p.descriptionFr?.trim();
    return f ? f : p.descriptionEn;
  }
  return p.descriptionEn;
}

export function localizedCategoryName(c: CategoryNames, lang: string): string {
  const l = primaryLang(lang);
  if (l === "ar") return c.nameAr;
  if (l === "fr") {
    const f = c.nameFr?.trim();
    return f ? f : c.nameEn;
  }
  return c.nameEn;
}

/** Homepage short blurb; falls back EN when FR empty. */
export function localizedCategoryHomeDesc(
  c: CategoryHomeDesc,
  lang: string
): string | null {
  const l = primaryLang(lang);
  if (l === "ar") return c.homeDescriptionAr?.trim() || null;
  if (l === "fr") {
    return (
      c.homeDescriptionFr?.trim() ||
      c.homeDescriptionEn?.trim() ||
      null
    );
  }
  return c.homeDescriptionEn?.trim() || null;
}

/** Products listing long blurb; falls back EN when FR empty. */
export function localizedCategoryProductPageDesc(
  c: CategoryProductPageDesc,
  lang: string
): string | null {
  const l = primaryLang(lang);
  if (l === "ar") return c.productPageDescriptionAr?.trim() || null;
  if (l === "fr") {
    return (
      c.productPageDescriptionFr?.trim() ||
      c.productPageDescriptionEn?.trim() ||
      null
    );
  }
  return c.productPageDescriptionEn?.trim() || null;
}
