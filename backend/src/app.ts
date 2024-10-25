import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the JSON saving service',
        },
        servers: [
            {
                url: 'http://localhost:4000', // URL do seu servidor
            },
        ],
    },
    apis: ['./src/app.ts'], // Ajuste o caminho para incluir o arquivo app.ts onde a rota está definida
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'dicts/');
    },
    filename: (req, file, cb) => {
        cb(null, 'tree.json');
    },
});

const upload = multer({ storage });

/**
 * @swagger
 * /save-json:
 *   post:
 *     summary: Save JSON data
 *     description: Saves JSON data to a file named 'tree.json' in the 'dicts' directory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: JSON saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error saving file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
