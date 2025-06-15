import Category from "../models/category.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
}

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching category" });
    }
}

// Biz category kaydediyor muyuz?
export const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const existingCategory = await Category.findOne({ where: { name } });

        if (existingCategory && existingCategory.id !== category.id) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        category.name = name;
        await category.save();
        return res.status(200).json(category);

    } catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (category) {
            await category.destroy();
            res.status(200).json({ message: "Category deleted successfully" });
        } else {
            res.status(404).json({ message: "Category not found " });
        }
    } catch (error) {
        res.status(500).json({ message: `Error deleting category: ${error.message}` });
    }
}