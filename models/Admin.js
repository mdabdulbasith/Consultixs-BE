import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash this!
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
