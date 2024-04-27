const mongoose = require('mongoose');
const URI = 'mongodb+srv://barbearia-User:elton15915988@cluster0.vg1whnh.mongodb.net/Barbearia'




mongoose.connect(URI)
.then(() => console.log('DB is Up'))
.catch(() => console.log(err));