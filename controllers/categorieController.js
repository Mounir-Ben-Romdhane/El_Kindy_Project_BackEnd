import Categorie from "../models/Categorie.js";

export const createCategorie = async (req, res) => {

    const newCategorie = new Categorie(req.body);

    try {
        await newCategorie.save();
        res.status(201).json(newCategorie);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body; // Assuming req.body contains the fields to update

        // Log the received file data
        console.log("Received file:", req.file);

        // If a file is uploaded, add its path to updateData
        if (req.file) {
            console.log("File path:", req.file.path);
            // Remove the 'public/assets/' prefix from the file path
            updateData.picturePath = req.file.path.replace('public/assets/', '');
        }
        
        // Log the updateData to verify its content
        console.log("Update data:", updateData);

        // Update the category with the given ID
        const updatedCategorie = await Categorie.findByIdAndUpdate(id, updateData, { new: true });
       
        if (!updatedCategorie) {
            return res.status(404).json({ success: false, error: "Categorie not found." });
        }

        return res.status(200).json({ success: true, data: updatedCategorie });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};






export const deleteCategorie = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategorie = await Categorie.findByIdAndDelete(id);
        if (!deletedCategorie) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.json({ message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCategorieById = async (req, res) => {
    const { id } = req.params;

    try {
        const categorie = await Categorie.findById(id);
        if (!categorie) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
