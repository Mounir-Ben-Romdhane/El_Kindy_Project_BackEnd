import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    ordre: {
      type: Number,
      required: [true, 'Order is required.'],
      unique: true, // Ensure ordre is unique
    },
  },
  {
    strictPopulate: false, // Allow populating fields not defined in the schema
  }
);

const Classe = mongoose.model('Classe', classSchema);

export default Classe;