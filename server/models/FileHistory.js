import mongoose from 'mongoose';

const fileHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  cleanedFileName: {
    type: String,
    required: true
  },
  originalFilePath: {
    type: String,
    required: true
  },
  cleanedFilePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  cleaningOptions: {
    removeDuplicates: Boolean,
    trimSpaces: Boolean,
    normalizeColumns: Boolean,
    removeBlankRows: Boolean,
    handleMissing: Boolean,
    convertTypes: Boolean,
    standardizeDates: Boolean,
    fixCase: Boolean,
    missingStrategy: String,
    caseType: String
  },
  statistics: {
    originalRows: Number,
    cleanedRows: Number,
    rowsRemoved: Number,
    originalColumns: Number,
    cleanedColumns: Number,
    columnsRemoved: Number
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  errorMessage: String,
  processingTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
fileHistorySchema.index({ user: 1, createdAt: -1 });

const FileHistory = mongoose.model('FileHistory', fileHistorySchema);

export default FileHistory;
