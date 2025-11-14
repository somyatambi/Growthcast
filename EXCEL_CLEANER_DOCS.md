# Excel File Cleaning Feature

## Overview
The Excel File Cleaning feature automatically cleans and standardizes Excel files using 13 different cleaning operations. All operations are **non-AI based** and use pure JavaScript logic.

## How to Use

1. **Upload File**: Click or drag-and-drop your Excel file (.xlsx or .xls)
2. **Select Options**: Choose which cleaning operations to apply
3. **Clean File**: Click "Clean Excel File" button
4. **Download**: The cleaned file will automatically download

## Cleaning Features

### 1. 🧹 Remove Duplicates
Deletes rows with identical data in specified columns.
- **Method**: Uses JavaScript `Set()` to identify unique rows
- **Configurable**: Can target specific columns or entire rows

### 2. ⚠️ Handle Missing Values
Fills empty cells with custom values, averages, or removes rows.
- **Strategies**: 
  - Fill with custom value (default: "N/A")
  - Fill with average (for numeric columns)
  - Remove rows with missing data
- **Smart Detection**: Handles `null`, `undefined`, and empty strings

### 3. 🧾 Trim Extra Spaces
Removes leading and trailing spaces from text cells.
- **Method**: Uses `.trim()` on all string values
- **Preserves**: Internal spacing within text

### 4. 🔢 Convert Data Types
Automatically converts strings to appropriate types.
- **Number Conversion**: "123" → 123
- **Boolean Conversion**: "TRUE" → true, "FALSE" → false
- **Smart Detection**: Only converts when appropriate

### 5. 🕓 Standardize Date Formats
Converts all dates to YYYY-MM-DD format.
- **Handles**: Excel serial dates, string dates, Date objects
- **Output**: Consistent YYYY-MM-DD format
- **Configurable**: Can target specific date columns

### 6. 🔤 Fix Text Case
Converts text to consistent casing.
- **Options**:
  - Proper Case (Title Case)
  - UPPERCASE
  - lowercase
- **Selective**: Can apply to specific columns only

### 7. 📊 Remove Blank Rows/Columns
Deletes entirely empty rows and columns.
- **Row Removal**: Removes rows where all cells are empty
- **Column Removal**: Removes columns where all cells are empty
- **Preserves**: Rows/columns with any data

### 8. 🔍 Validate Data
Checks data against validation rules.
- **Numeric Validation**: Ensures numbers are valid
- **Email Validation**: Checks email format
- **Phone Validation**: Validates phone numbers
- **Custom Regex**: Supports custom validation patterns
- **Error Reporting**: Lists all validation errors found

### 9. 🧩 Merge Multiple Sheets/Files
Combines multiple datasets into one.
- **Smart Merging**: Handles different column structures
- **Alignment**: Normalizes columns across datasets
- **Preserves**: All unique columns from all sheets

### 10. 🧮 Normalize Column Names
Standardizes column headers.
- **Conversion**: "Full Name" → "full_name"
- **Rules**:
  - Converts to lowercase
  - Replaces spaces with underscores
  - Removes special characters
  - Trims whitespace

### 11. 🔄 Find & Replace
Globally replaces text patterns.
- **Regex Support**: Can use regular expressions
- **Case Insensitive**: Optional case-insensitive matching
- **Selective**: Can target specific columns

### 12. 🪣 Filter Unwanted Data
Removes rows based on conditions.
- **Conditions**:
  - Equals / Not Equals
  - Contains
  - Greater Than / Less Than
- **Multiple Filters**: Can apply multiple conditions

### 13. 📈 Sort Data
Sorts data alphabetically or numerically.
- **Sort Types**: Ascending or descending
- **Smart Sorting**: Handles numbers and text appropriately
- **Null Handling**: Places nulls at the end

## Technical Implementation

### File Reading
```javascript
import * as XLSX from 'xlsx';

// Read Excel file
const data = await file.arrayBuffer();
const workbook = XLSX.read(data, { type: 'array' });
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(worksheet);
```

### File Writing
```javascript
import { saveAs } from 'file-saver';

// Create new workbook with cleaned data
const newWorksheet = XLSX.utils.json_to_sheet(cleanedData);
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Cleaned Data');

// Download
const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
saveAs(blob, 'cleaned_file.xlsx');
```

## Statistics Tracking

After cleaning, the app displays:
- **Original Rows**: Number of rows before cleaning
- **Cleaned Rows**: Number of rows after cleaning
- **Rows Removed**: Number of rows removed
- **Columns**: Original → Cleaned column count

## Configuration Options

All cleaning operations can be toggled on/off individually:

```javascript
const cleaningOptions = {
  removeDuplicates: true,
  trimSpaces: true,
  normalizeColumns: true,
  removeBlankRows: true,
  handleMissing: true,
  convertTypes: true,
  standardizeDates: false,
  fixCase: false,
  missingStrategy: 'fill',
  fillValue: 'N/A',
  caseType: 'proper'
};
```

## Performance

- **Client-Side Processing**: All cleaning happens in the browser
- **No Server Required**: Complete privacy - data never leaves the user's device
- **Fast Processing**: Can handle files with thousands of rows
- **Memory Efficient**: Uses streaming where possible

## Future Enhancements

Potential features to add:
- Custom validation rules UI
- Advanced filtering options
- Column-specific cleaning options
- Preview before/after
- Batch file processing
- Save cleaning templates
- Export cleaning report

## Dependencies

```json
{
  "xlsx": "^0.18.5",      // Excel file reading/writing
  "file-saver": "^2.0.5"  // File download functionality
}
```
