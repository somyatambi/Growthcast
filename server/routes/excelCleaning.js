import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /api/excel-cleaning/clean
// @desc    Clean Excel file using Node.js
// @access  Private
router.post('/clean', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { operations } = req.body; // Array of cleaning operations

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    let data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    // Apply cleaning operations
    if (operations && operations.includes('removeDuplicates')) {
      data = removeDuplicates(data);
    }
    
    if (operations && operations.includes('trimSpaces')) {
      data = trimSpaces(data);
    }
    
    if (operations && operations.includes('removeBlankRows')) {
      data = removeBlankRows(data);
    }
    
    if (operations && operations.includes('normalizeColumns')) {
      data = normalizeColumns(data);
    }

    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

    // Generate buffer
    const buffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });

    res.json({
      success: true,
      message: 'File cleaned successfully',
      stats: {
        originalRows: XLSX.utils.sheet_to_json(worksheet).length,
        cleanedRows: data.length,
        operations: operations || []
      },
      file: buffer.toString('base64')
    });

  } catch (error) {
    console.error('Excel cleaning error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning file',
      error: error.message
    });
  }
});

// Helper functions
function removeDuplicates(data) {
  const seen = new Set();
  return data.filter(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function trimSpaces(data) {
  return data.map(row => {
    const trimmedRow = {};
    for (const [key, value] of Object.entries(row)) {
      trimmedRow[key] = typeof value === 'string' ? value.trim() : value;
    }
    return trimmedRow;
  });
}

function removeBlankRows(data) {
  return data.filter(row => {
    return Object.values(row).some(value => value !== '' && value !== null && value !== undefined);
  });
}

function normalizeColumns(data) {
  if (data.length === 0) return data;
  
  const normalizedData = [];
  const headers = Object.keys(data[0]);
  const normalizedHeaders = headers.map(h => 
    h.trim().toLowerCase().replace(/\s+/g, '_')
  );
  
  data.forEach(row => {
    const normalizedRow = {};
    headers.forEach((oldHeader, index) => {
      normalizedRow[normalizedHeaders[index]] = row[oldHeader];
    });
    normalizedData.push(normalizedRow);
  });
  
  return normalizedData;
}

export default router;
