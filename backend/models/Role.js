import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: 'briefcase' },
  skills: [{ type: String }],
  keywords: [{ type: String }],
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
