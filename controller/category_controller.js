import prisma from '../db/db.config.js';

export async function createCategory(req, res) {
    const category = req.body.category;
    try {
        const isCategoryAvailable = await prisma.category.findUnique({
            where: {
                category: category,
            },
        });
        if (!isCategoryAvailable) {
            await prisma.category.create({
                data: {
                    category: category,
                },
            });
            res.json({ success: true, status: 200, message: 'category added' });
        } else {
            res.json({ success: false, status: 409, message: 'this category already added' });
        }
    } catch (error) {
        res.json({ success: false, status: 400, message: 'fail to add category' });
    }
}

export async function fetchCategory(category) {
    try {
        const categoryData = await prisma.category.findUnique({
            where: {
                category: category,
            },
        });
        return categoryData;
    } catch (error) {
        return null;
    }
}