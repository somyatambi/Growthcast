import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { protect } from '../middleware/auth.js';
import FileHistory from '../models/FileHistory.js';
import User from '../models/User.js';
import { 
  cleanExcelData,
  removeDuplicates,
  trimSpaces,
  normalizeColumnNames,
  removeBlankRowsAndColumns,
  handleMissingValues,
  convertDataTypes
} from '../utils/excelCleaner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/original');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// @route   POST /api/excel/clean
// @desc    Clean Excel file
// @access  Private
router.post('/clean', protect, upload.single('file'), async (req, res) => {
  const startTime = Date.now();
  let fileHistory;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Parse cleaning options
    const cleaningOptions = JSON.parse(req.body.options || '{}');

    // Read the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }

    const originalCount = jsonData.length;
    const originalColumns = Object.keys(jsonData[0]).length;

    // Clean the data
    const cleanedData = cleanExcelData(jsonData, cleaningOptions);

    const cleanedCount = cleanedData.length;
    const cleanedColumns = cleanedData.length > 0 ? Object.keys(cleanedData[0]).length : 0;

    // Create cleaned file
    const cleanedDir = path.join(__dirname, '../../uploads/cleaned');
    if (!fs.existsSync(cleanedDir)) {
      fs.mkdirSync(cleanedDir, { recursive: true });
    }

    const cleanedFileName = `cleaned-${Date.now()}-${req.file.originalname}`;
    const cleanedFilePath = path.join(cleanedDir, cleanedFileName);

    const newWorksheet = XLSX.utils.json_to_sheet(cleanedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Cleaned Data');
    XLSX.writeFile(newWorkbook, cleanedFilePath);

    const processingTime = Date.now() - startTime;

    // Save to database
    fileHistory = await FileHistory.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      cleanedFileName: cleanedFileName,
      originalFilePath: req.file.path,
      cleanedFilePath: cleanedFilePath,
      fileSize: req.file.size,
      cleaningOptions: cleaningOptions,
      statistics: {
        originalRows: originalCount,
        cleanedRows: cleanedCount,
        rowsRemoved: originalCount - cleanedCount,
        originalColumns: originalColumns,
        cleanedColumns: cleanedColumns,
        columnsRemoved: originalColumns - cleanedColumns
      },
      status: 'completed',
      processingTime: processingTime
    });

    // Update user's file count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { filesProcessed: 1 }
    });

    res.json({
      success: true,
      message: 'File cleaned successfully',
      fileId: fileHistory._id,
      downloadUrl: `/api/excel/download/${fileHistory._id}`,
      statistics: fileHistory.statistics,
      processingTime: processingTime
    });

  } catch (error) {
    console.error('Excel cleaning error:', error);

    // Update file history if it was created
    if (fileHistory) {
      fileHistory.status = 'failed';
      fileHistory.errorMessage = error.message;
      await fileHistory.save();
    }

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error cleaning file',
      error: error.message
    });
  }
});

// @route   GET /api/excel/download/:id
// @desc    Download cleaned file
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
  try {
    const fileHistory = await FileHistory.findById(req.params.id);

    if (!fileHistory) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file
    if (fileHistory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this file'
      });
    }

    if (!fs.existsSync(fileHistory.cleanedFilePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(fileHistory.cleanedFilePath, fileHistory.cleanedFileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: error.message
    });
  }
});

// @route   GET /api/excel/history
// @desc    Get user's file history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await FileHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-originalFilePath -cleanedFilePath');

    const total = await FileHistory.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file history',
      error: error.message
    });
  }
});

// @route   DELETE /api/excel/:id
// @desc    Delete file from history
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const fileHistory = await FileHistory.findById(req.params.id);

    if (!fileHistory) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file
    if (fileHistory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    // Delete physical files
    if (fs.existsSync(fileHistory.originalFilePath)) {
      fs.unlinkSync(fileHistory.originalFilePath);
    }
    if (fs.existsSync(fileHistory.cleanedFilePath)) {
      fs.unlinkSync(fileHistory.cleanedFilePath);
    }

    // Delete from database
    await fileHistory.deleteOne();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

export default router;
