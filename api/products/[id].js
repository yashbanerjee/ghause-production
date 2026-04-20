const prisma = require('../../server/lib/prisma');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id } = req.query;
    console.log("Incoming ID:", id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    console.log("Product:", product);

    if (!product) {
      console.log(`[API] Product NOT found: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`[API] Product found: ${product.nameEn}`);
    return res.status(200).json(product);
  } catch (err) {
    console.error('[API] Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
