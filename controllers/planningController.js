import Planning from "../models/Planning.js";

// Fonction pour ajouter un nouvel événement

export const addNewPlanning = async (req, res) => {

    try {
      // Chercher si l'événement existe déjà
      const existing = await Planning.findOne({
        start: req.body.start, 
        end: req.body.end,
        resourceId: req.body.resourceId,
        color: req.body.color,
        teacherId: req.body.teacherId, // Assurez-vous que cette ligne est présente et correcte
        studentId: req.body.studentId, // Assurez-vous que cette ligne est présente et correcte

      });
      
      if(existing) {
        return res.status(409).json({message: "Event already exists"}); 
      }
  
      const planning = new Planning(req.body);
      await planning.save();
      return res.status(201).json(planning);
  
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  
  }
  export const getAllPlannings = async (req, res) => {
    try {
        const plannings = await Planning.find({});
        res.status(200).json(plannings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getPlanningsForTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    console.log("Teacher ID:", teacherId);
    const plannings = await Planning.find({ teacherId: teacherId });
    console.log("Plannings found:", plannings);
        if(plannings.length > 0){
        res.status(200).json(plannings);
    } else {
        res.status(404).json({ message: "Aucun planning trouvé pour cet enseignant." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPlanningsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("Teacher ID:", studentId);
    const plannings = await Planning.find({ studentId: studentId });
    console.log("Plannings found:", plannings);
        if(plannings.length > 0){
        res.status(200).json(plannings);
    } else {
        res.status(404).json({ message: "Aucun planning trouvé pour cet student." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
