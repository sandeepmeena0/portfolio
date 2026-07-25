const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    yearsExperience: { type: Number, default: 1 },
    projectsBuilt: { type: Number, default: 10 },
    technologies: { type: Number, default: 5 },
    commits: { type: Number, default: 500 },
    aboutHeading: { type: String, default: "A passionate developer who loves turning ideas into reality" },
    aboutText1: { type: String, default: "I'm a MERN Stack Developer with a strong foundation in building full-stack web applications. I specialize in creating responsive, user-friendly interfaces with React and robust backend services with Node.js and Express." },
    aboutText2: { type: String, default: "My journey in web development started with curiosity and has grown into a deep passion for crafting elegant solutions to complex problems. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies." },
    isFresher: { type: Boolean, default: false },
    fresherText: { type: String, default: "Aspiring Developer" },
    aboutImage: { type: String, default: "" }
});

module.exports = mongoose.model('Settings', settingsSchema);
