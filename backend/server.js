import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Только CSV файлы разрешены!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Генерация тестовых данных
function generateSampleData(count = 100) {
  const courses = ['Математика', 'Физика', 'Химия', 'Биология', 'История', 'Литература'];
  const activityTypes = ['Лекция', 'Практика', 'Лабораторная', 'Экзамен', 'Домашнее задание'];
  const students = ['Иванов Иван', 'Петров Петр', 'Сидорова Анна', 'Козлова Мария', 'Смирнов Алексей', 
                    'Волкова Елена', 'Новиков Дмитрий', 'Морозова Ольга'];
  
  const data = [];
  // Начальная дата - год назад от текущей (28.12.2025)
  const startDate = new Date('2024-12-28');
  
  for (let i = 1; i <= count; i++) {
    const randomDays = Math.floor(Math.random() * 365);
    const date = new Date(startDate);
    date.setDate(date.getDate() + randomDays);
    
    data.push({
      id: i,
      student: students[Math.floor(Math.random() * students.length)],
      course: courses[Math.floor(Math.random() * courses.length)],
      date: date.toISOString().split('T')[0],
      activity_type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      score: Math.floor(Math.random() * 40) + 60, // Оценка от 60 до 100
      time_min: Math.floor(Math.random() * 120) + 30 // Время от 30 до 150 минут
    });
  }
  
  return data;
}

// Endpoint для получения тестовых данных
app.get('/api/sample-data', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 100;
    const data = generateSampleData(count);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при генерации данных', message: error.message });
  }
});

// Endpoint для загрузки CSV файла
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Преобразуем данные в нужный формат
      const record = {
        id: parseInt(data.id) || results.length + 1,
        student: data.student || data.Student || '',
        course: data.course || data.Course || '',
        date: data.date || data.Date || '',
        activity_type: data.activity_type || data.activityType || data['activity_type'] || '',
        score: parseInt(data.score || data.Score || 0),
        time_min: parseInt(data.time_min || data.timeMin || data['time_min'] || 0)
      };
      results.push(record);
    })
    .on('end', () => {
      // Удаляем временный файл
      fs.unlinkSync(filePath);
      
      if (results.length === 0) {
        return res.status(400).json({ error: 'CSV файл пуст или имеет неверный формат' });
      }
      
      res.json(results);
    })
    .on('error', (error) => {
      // Удаляем временный файл при ошибке
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ error: 'Ошибка при парсинге CSV файла', message: error.message });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Middleware для обработки ошибок Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Размер файла превышает 10MB' });
    }
    return res.status(400).json({ error: 'Ошибка загрузки файла: ' + err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

