const prisma = require('../lib/prisma');

exports.getCategories = async (req, res) => {
    // Robust isAdmin check: requires both a verified req.admin AND a present Authorization header
    const isAdmin = !!(req.admin && (req.headers.authorization || req.headers.Authorization));
    
    // Pagination & Search params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    const getAll = req.query.all === 'true';

    try {
        console.log(`[Category API] Fetch - isAdmin: ${isAdmin}, getAll: ${getAll}, page: ${page}, search: ${search}`);
        
        const where = {
            ...(isAdmin ? {} : { isActive: true }),
            ...(search ? {
                OR: [
                    { nameEn: { contains: search, mode: 'insensitive' } },
                    { nameAr: { contains: search, mode: 'insensitive' } },
                ]
            } : {})
        };

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                include: { 
                    products: isAdmin ? true : { where: { isActive: true } } 
                },
                orderBy: { createdAt: 'asc' },
                skip: (isAdmin && !getAll) ? skip : undefined, // Only paginate if not fetching ALL
                take: (isAdmin && !getAll) ? limit : undefined,
            }),
            prisma.category.count({ where })
        ]);

        // If not admin OR requesting ALL, return flat array.
        if ((!isAdmin && !req.query.page) || getAll) {
            console.log(`[Category API] Returning flat array (count: ${categories.length})`);
            return res.json(categories);
        }

        console.log(`[Category API] Returning paginated object (total: ${total})`);
        res.json({
            data: categories,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (err) {
        console.error('[Category Fetch Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCategoryById = async (req, res) => {
    const isAdmin = !!(req.admin && (req.headers.authorization || req.headers.Authorization));
    try {
        const category = await prisma.category.findUnique({
            where: isAdmin ? { id: req.params.id } : { id: req.params.id, isActive: true },
            include: { 
                products: isAdmin ? true : { where: { isActive: true } } 
            }
        });
        if (!category) return res.status(404).json({ message: 'Category not found or inactive' });
        res.json(category);
    } catch (err) {
        console.error('[Category Detail Fetch Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createCategory = async (req, res) => {
    const { nameEn, nameAr, homeDescriptionEn, homeDescriptionAr, productPageDescriptionEn, productPageDescriptionAr } = req.body;
    const icon = req.files?.['icon']?.[0]?.location;
    const image = req.files?.['image']?.[0]?.location;

    try {
        const category = await prisma.category.create({
            data: {
                nameEn, nameAr,
                homeDescriptionEn, homeDescriptionAr,
                productPageDescriptionEn, productPageDescriptionAr,
                icon, image
            }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error('Category creation failed:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { nameEn, nameAr, homeDescriptionEn, homeDescriptionAr, productPageDescriptionEn, productPageDescriptionAr } = req.body;

    try {
        const updateData = {
            nameEn, nameAr,
            homeDescriptionEn, homeDescriptionAr,
            productPageDescriptionEn, productPageDescriptionAr
        };
        
        if (req.files?.['icon']) updateData.icon = req.files['icon'][0].location;
        if (req.files?.['image']) updateData.image = req.files['image'][0].location;

        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json(category);
    } catch (err) {
        console.error('[Category Update Error]:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error('[Category Delete Error]:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategoryStatus = async (req, res) => {
    const { isActive } = req.body;
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { isActive }
        });
        res.json(category);
    } catch (err) {
        console.error('[Category Status Update Error]:', err);
        res.status(500).json({ error: err.message });
    }
};
