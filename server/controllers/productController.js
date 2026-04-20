const prisma = require('../lib/prisma');

exports.getProducts = async (req, res) => {
    const { categoryId } = req.query;
    const isAdmin = !!(req.admin && (req.headers.authorization || req.headers.Authorization));
    
    // Pagination & Search params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    try {
        const where = {
            ...(categoryId ? { categoryId } : {}),
            ...(isAdmin ? {} : { isActive: true }),
            ...(search ? {
                OR: [
                    { nameEn: { contains: search, mode: 'insensitive' } },
                    { nameAr: { contains: search, mode: 'insensitive' } },
                    { category: { nameEn: { contains: search, mode: 'insensitive' } } },
                    { category: { nameAr: { contains: search, mode: 'insensitive' } } },
                ]
            } : {})
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip: isAdmin ? skip : undefined,
                take: isAdmin ? limit : undefined,
            }),
            prisma.product.count({ where })
        ]);

        if (!isAdmin && !req.query.page) {
            return res.json(products);
        }

        res.json({
            data: products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (err) {
        console.error('[Product Fetch Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    const isAdmin = !!(req.admin && (req.headers.authorization || req.headers.Authorization));
    try {
        const product = await prisma.product.findUnique({
            where: isAdmin ? { id: req.params.id } : { id: req.params.id, isActive: true },
            include: { category: true }
        });
        if (!product) return res.status(404).json({ message: 'Product not found or inactive' });
        res.json(product);
    } catch (err) {
        console.error('[Product Detail Fetch Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    const { nameEn, nameAr, descriptionEn, descriptionAr, categoryId } = req.body;
    const image = req.files?.['image']?.[0]?.location;
    const catalogs = req.files?.['catalogs'] || [];

    try {
        const product = await prisma.product.create({
            data: {
                nameEn, nameAr, descriptionEn, descriptionAr, categoryId, image,
                catalogs: catalogs.map(file => file.location)
            },
            include: { category: true }
        });
        res.status(201).json(product);
    } catch (err) {
        console.error('[Product Creation Error]:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { nameEn, nameAr, descriptionEn, descriptionAr, categoryId } = req.body;

    try {
        const existingProduct = await prisma.product.findUnique({ where: { id: req.params.id } });
        if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

        const updateData = { nameEn, nameAr, descriptionEn, descriptionAr, categoryId };
        if (req.files?.['image']) updateData.image = req.files['image'][0].location;

        const newCatalogs = req.files?.['catalogs']?.map(file => file.location) || [];
        const updatedCatalogs = [...(existingProduct.catalogs || []), ...newCatalogs];

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                ...updateData,
                catalogs: updatedCatalogs
            },
            include: { category: true }
        });
        res.json(product);
    } catch (err) {
        console.error('[Product Update Error]:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error('[Product Delete Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCatalogFile = async (req, res) => {
    try {
        const { productId, fileUrl } = req.body; 
        if (!productId || !fileUrl) return res.status(400).json({ message: 'Missing productId or fileUrl' });

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const updatedCatalogs = product.catalogs.filter(url => url !== fileUrl);

        await prisma.product.update({
            where: { id: productId },
            data: { catalogs: updatedCatalogs }
        });

        res.json({ message: 'Catalog file deleted' });
    } catch (err) {
        console.error('[Catalog Delete Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadCatalogs = async (req, res) => {
    try {
        const productId = req.params.id;
        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

        const newUrls = files.map((file) => file.location);
        const updatedCatalogs = [...(existingProduct.catalogs || []), ...newUrls];

        await prisma.product.update({
            where: { id: productId },
            data: { catalogs: updatedCatalogs },
        });

        res.json({ message: 'Uploaded successfully', count: newUrls.length });
    } catch (err) {
        console.error('[Catalog Upload Error]:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateProductStatus = async (req, res) => {
    const { isActive } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: { isActive }
        });
        res.json(product);
    } catch (err) {
        console.error('[Product Status Update Error]:', err);
        res.status(500).json({ error: err.message });
    }
};
