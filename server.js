const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Base Route
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Science & GK App Backend is live with Supabase Integration!"
    });
});

// 1. Test & View Data Route
app.get('/api/test-db', async (req, res) => {
    try {
        const { data, error } = await supabase.from('science_gk').select('*');
        if (error) throw error;
        res.json({ status: "success", count: data.length, data });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 2. Add Sample Questions Route (ऑटोमैटिक डेटा डालने के लिए)
app.get('/api/add-sample', async (req, res) => {
    try {
        const sampleQuestions = [
            { question: "What is the chemical symbol for Water?", option_a: "H2O", option_b: "CO2", option_c: "O2", option_d: "NaCl", correct_answer: "H2O" },
            { question: "Which planet is known as the Red Planet?", option_a: "Venus", option_b: "Mars", option_c: "Jupiter", option_d: "Saturn", correct_answer: "Mars" },
            { question: "What is the powerhouse of the cell?", option_a: "Nucleus", option_b: "Ribosome", option_c: "Mitochondria", option_d: "Golgi body", correct_answer: "Mitochondria" }
        ];

        const { data, error } = await supabase.from('science_gk').insert(sampleQuestions).select();
        if (error) throw error;
        
        res.json({ status: "success", message: "Sample questions added successfully!", data });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
