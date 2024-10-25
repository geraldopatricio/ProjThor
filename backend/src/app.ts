import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'dicts/');
    },
    filename: (req, file, cb) => {
        cb(null, 'tree.json');
    }
});

const upload = multer({ storage });

app.post('/save-json', (req, res) => {
    const jsonData = req.body;

    if (!fs.existsSync('dicts')) {
        fs.mkdirSync('dicts');
    }

    // Caminho para o arquivo JSON
    const filePath = path.join(__dirname, '..', 'dicts', 'tree.json');

    // Salvando JSON no servidor
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving file.' });
        }
        res.status(200).json({ message: 'JSON saved successfully.' });
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
