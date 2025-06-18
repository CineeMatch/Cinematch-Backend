import MovieCategory from "../models/movieCategory.js";

// This function retrieves all movie categories from the database and sends them as a JSON response.
export const getAllMovieCategories = async (req, res) => {
    try {
        const movieCategories = await MovieCategory.findAll();
        if (!movieCategories || movieCategories.length === 0) {
            return res.status(404).json({ message: "No movie categories found" });
        }
        return res.status(200).json(movieCategories);
    } catch (error) {
        console.error("Error fetching movie categories:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific movie category by its ID from the database and sends it as a JSON response.
export const getMovieCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Movie category ID is required" });
        }
        const movieCategory = await MovieCategory.findByPk(id);
        if (!movieCategory) {
            return res.status(404).json({ message: "Movie category not found" });
        }
        return res.status(200).json(movieCategory);
    } catch (error) {
        console.error("Error fetching movie category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new movie category in the database using the data provided in the request body and sends the created category as a JSON response.
export const createMovieCategory = async (req, res) => {
    try {
        const { movie_id, category_id } = req.body;
        if (!movie_id || !category_id) {
            return res.status(400).json({ message: "Movie ID and category ID are required" });
        }
        const newMovieCategory = await MovieCategory.create({ movie_id, category_id });
        return res.status(201).json(newMovieCategory);
    } catch (error) {
        console.error("Error creating movie category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing movie category in the database using the ID provided in the request parameters and the data provided in the request body, and sends the updated category as a JSON response.
export const updateMovieCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Movie category ID is required" });
        }

        const movieCategory = await MovieCategory.findByPk(id);

        if (!movieCategory) {
            return res.status(404).json({ message: "Movie category not found" });
        }

        const { movie_id, category_id } = req.body;

        if (!movie_id || !category_id) {
            return res.status(400).json({ message: "Movie ID and category ID are required" });
        }

        const newMovieCategoryData = { movie_id, category_id };

        await movieCategory.update(newMovieCategoryData);
        return res.status(200).json(movieCategory);
    } catch (error) {
        console.error("Error updating movie category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a movie category from the database using the ID provided in the request parameters and sends a success message as a JSON response.
export const deleteMovieCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Movie category ID is required" });
        }
        const movieCategory = await MovieCategory.findByPk(id);
        if (!movieCategory) {
            return res.status(404).json({ message: "Movie category not found" });
        }
        await movieCategory.destroy();
        return res.status(200).json({ message: "Movie category deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}