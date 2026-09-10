require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');

const data = [
  { name: 'ABG Reagent Pack', subcategories: ['150 Pack', '300 Pack'] },
  { name: 'Circuit', subcategories: ['Heated Breathing Circuit', 'Pediatric', 'Neonatal', 'Adult'] },
  { name: 'Radiation Drape', subcategories: [] }, // sub-cards to be defined
  { name: 'Monitor Accessories', subcategories: ['ECG Cable', 'BP', 'Cuff', 'SpO₂ Sensor', 'Temperature Cable'] },
  { name: 'Cartridges', subcategories: ['CG4+ Cartridge', 'EG7+ Cartridge', 'cTnI Cartridge', 'PT/INR Cartridge'] }
];

const seed = async () => {
  await connectDB();

  for (const cat of data) {
    let category = await Category.findOne({ name: cat.name });
    if (!category) {
      category = await Category.create({ name: cat.name });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category exists: ${cat.name}`);
    }

    for (const subName of cat.subcategories) {
      const exists = await Subcategory.findOne({ category: category._id, name: subName });
      if (!exists) {
        await Subcategory.create({ category: category._id, name: subName });
        console.log(`  Created subcategory: ${subName}`);
      }
    }
  }

  console.log('Seeding complete.');
  mongoose.connection.close();
};

seed().catch((err) => { console.error(err); mongoose.connection.close(); });