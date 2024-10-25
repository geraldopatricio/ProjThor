import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, './dicts/');
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, 'tree.json');
  }
});

const upload = multer({ storage });

router.post('/save-json', (req: Request, res: Response) => {
  const jsonData = req.body;

  // Verifica se a pasta 'dicts' existe, se não existir, cria.
  const dirPath = path.join(__dirname, '..', 'dicts');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = path.join(dirPath, 'tree.json');

  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      res.status(500).json({ message: 'Error saving JSON file' });
    } else {
      res.status(200).json({ message: 'JSON file saved successfully', filePath });
    }
  });
});

// Rota para fazer o download do JSON
router.get('/download-json', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '..', 'dicts', 'tree.json');
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'tree.json', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

export default router;
