import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Main Excel Cleaning Function
 * @param {File} file - The Excel file to clean
 * @param {Object} options - Cleaning options
 * @returns {Object} - Cleaned workbook and statistics
 */
export const cleanExcel = async (file, options = {}) => {
  const workbook = await readExcelFile(file);
  const stats = {
    duplicatesRemoved: 0,
    blanksRemoved: 0,
    spacesFixed: 0,
    typesConverted: 0,
    datesStandardized: 0,
    caseFixed: 0,
    columnsNormalized: 0,
    replacementsMade: 0,
    totalOperations: 0
  };

  // Process each sheet
  workbook.SheetNames.forEach(sheetName => {
    let worksheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    // Apply cleaning operations based on options
    if (options.removeDuplicates) {
      const result = removeDuplicateRows(data, options.duplicateKeys);
      data = result.data;
      stats.duplicatesRemoved += result.removed;
    }

    if (options.trimSpaces) {
      const result = trimAllSpaces(data);
      data = result.data;
      stats.spacesFixed += result.fixed;
    }

    if (options.convertTypes) {
      const result = convertDataTypes(data);
      data = result.data;
      stats.typesConverted += result.converted;
    }

    if (options.standardizeDates) {
      const result = standardizeDateFormats(data, options.dateFormat, options.dateColumns);
      data = result.data;
      stats.datesStandardized += result.standardized;
    }

    if (options.fixTextCase) {
      const result = fixTextCase(data, options.headerCase, options.textCase);
      data = result.data;
      stats.caseFixed += result.fixed;
    }

    if (options.removeBlankRows) {
      const result = removeBlankRowsAndColumns(data);
      data = result.data;
      stats.blanksRemoved += result.removed;
    }

    if (options.normalizeColumnNames) {
      const result = normalizeColumnNames(data);
      data = result.data;
      stats.columnsNormalized += result.normalized;
    }

    if (options.findAndReplace && options.replacements) {
      const result = findAndReplace(data, options.replacements);
      data = result.data;
      stats.replacementsMade += result.replaced;
    }

    if (options.sortData) {
      const result = sortData(data, options.sortColumn, options.sortOrder);
      data = result.data;
    }

    // Convert back to worksheet
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
  });

  stats.totalOperations = Object.values(stats).reduce((a, b) => a + b, 0);

  return { workbook, stats };
};

/**
 * Read Excel file
 */
const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      resolve(workbook);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 1. Remove duplicate rows
 */
const removeDuplicateRows = (data, keyColumns = null) => {
  if (data.length <= 1) return { data, removed: 0 };

  const headers = data[0];
  const rows = data.slice(1);
  const seen = new Set();
  const uniqueRows = [];
  let removed = 0;

  rows.forEach(row => {
    let key;
    if (keyColumns && keyColumns.length > 0) {
      // Use specific columns for duplicate detection
      key = keyColumns.map(col => {
        const index = headers.indexOf(col);
        return index >= 0 ? row[index] : '';
      }).join('|');
    } else {
      // Use all columns
      key = row.join('|');
    }

    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    } else {
      removed++;
    }
  });

  return {
    data: [headers, ...uniqueRows],
    removed
  };
};

/**
 * 2. Trim extra spaces in all text cells
 */
const trimAllSpaces = (data) => {
  let fixed = 0;
  const cleanedData = data.map(row =>
    row.map(cell => {
      if (typeof cell === 'string') {
        const trimmed = cell.trim().replace(/\s+/g, ' ');
        if (trimmed !== cell) fixed++;
        return trimmed;
      }
      return cell;
    })
  );

  return { data: cleanedData, fixed };
};

/**
 * 3. Convert numeric strings to numbers and boolean strings to booleans
 */
const convertDataTypes = (data) => {
  let converted = 0;
  const convertedData = data.map((row, rowIndex) =>
    row.map(cell => {
      if (typeof cell !== 'string') return cell;

      // Skip header row
      if (rowIndex === 0) return cell;

      const trimmed = cell.trim();

      // Convert boolean strings
      if (trimmed.toLowerCase() === 'true') {
        converted++;
        return true;
      }
      if (trimmed.toLowerCase() === 'false') {
        converted++;
        return false;
      }

      // Convert numeric strings
      if (trimmed !== '' && !isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
        converted++;
        return parseFloat(trimmed);
      }

      return cell;
    })
  );

  return { data: convertedData, converted };
};

/**
 * 4. Standardize date formats
 */
const standardizeDateFormats = (data, targetFormat = 'YYYY-MM-DD', dateColumns = null) => {
  if (data.length <= 1) return { data, standardized: 0 };

  const headers = data[0];
  let standardized = 0;

  // Common date formats to try
  const dateFormats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY/MM/DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    'YYYY-MM-DD',
    'M/D/YYYY',
    'D/M/YYYY',
    'MMM DD, YYYY',
    'DD MMM YYYY',
    'MMMM DD, YYYY'
  ];

  const convertedData = data.map((row, rowIndex) => {
    if (rowIndex === 0) return row; // Skip headers

    return row.map((cell, colIndex) => {
      // If specific columns specified, only process those
      if (dateColumns && dateColumns.length > 0) {
        const columnName = headers[colIndex];
        if (!dateColumns.includes(columnName)) return cell;
      }

      if (typeof cell !== 'string' || cell.trim() === '') return cell;

      // Try to parse the date with various formats
      for (const format of dateFormats) {
        const parsed = dayjs(cell, format, true);
        if (parsed.isValid()) {
          standardized++;
          return parsed.format(targetFormat);
        }
      }

      // Try JavaScript Date parsing as fallback
      const jsDate = new Date(cell);
      if (!isNaN(jsDate.getTime())) {
        standardized++;
        return dayjs(jsDate).format(targetFormat);
      }

      return cell;
    });
  });

  return { data: convertedData, standardized };
};

/**
 * 5. Fix text case
 */
const fixTextCase = (data, headerCase = 'lowercase', textCase = 'title') => {
  if (data.length === 0) return { data, fixed: 0 };

  let fixed = 0;

  const convertedData = data.map((row, rowIndex) => {
    return row.map(cell => {
      if (typeof cell !== 'string') return cell;

      let converted;
      if (rowIndex === 0) {
        // Header row
        switch (headerCase) {
          case 'lowercase':
            converted = cell.toLowerCase();
            break;
          case 'uppercase':
            converted = cell.toUpperCase();
            break;
          case 'title':
            converted = toTitleCase(cell);
            break;
          default:
            converted = cell;
        }
      } else {
        // Data rows
        switch (textCase) {
          case 'lowercase':
            converted = cell.toLowerCase();
            break;
          case 'uppercase':
            converted = cell.toUpperCase();
            break;
          case 'title':
            converted = toTitleCase(cell);
            break;
          default:
            converted = cell;
        }
      }

      if (converted !== cell) fixed++;
      return converted;
    });
  });

  return { data: convertedData, fixed };
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * 6. Remove blank rows and columns
 */
const removeBlankRowsAndColumns = (data) => {
  let removed = 0;

  // Remove blank rows
  const rowsFiltered = data.filter(row => {
    const isBlank = row.every(cell => cell === '' || cell === null || cell === undefined);
    if (isBlank) removed++;
    return !isBlank;
  });

  if (rowsFiltered.length === 0) return { data: [], removed };

  // Remove blank columns
  const numCols = Math.max(...rowsFiltered.map(row => row.length));
  const blankColumns = [];

  for (let col = 0; col < numCols; col++) {
    const isBlank = rowsFiltered.every(row =>
      row[col] === '' || row[col] === null || row[col] === undefined
    );
    if (isBlank) {
      blankColumns.push(col);
      removed++;
    }
  }

  // Remove blank columns
  const columnsFiltered = rowsFiltered.map(row =>
    row.filter((_, colIndex) => !blankColumns.includes(colIndex))
  );

  return { data: columnsFiltered, removed };
};

/**
 * 7. Normalize column names
 */
const normalizeColumnNames = (data) => {
  if (data.length === 0) return { data, normalized: 0 };

  const headers = data[0];
  let normalizedCount = 0;

  const normalizedHeaders = headers.map(header => {
    if (typeof header !== 'string') return header;

    const normalizedHeader = header
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    if (normalizedHeader !== header) normalizedCount++;
    return normalizedHeader;
  });

  return {
    data: [normalizedHeaders, ...data.slice(1)],
    normalized: normalizedCount
  };
};

/**
 * 8. Find and replace text patterns
 */
const findAndReplace = (data, replacements) => {
  let replaced = 0;

  const convertedData = data.map(row =>
    row.map(cell => {
      if (typeof cell !== 'string') return cell;

      let newValue = cell;
      replacements.forEach(({ find, replace }) => {
        const regex = new RegExp(find, 'gi');
        if (regex.test(newValue)) {
          replaced++;
          newValue = newValue.replace(regex, replace);
        }
      });

      return newValue;
    })
  );

  return { data: convertedData, replaced };
};

/**
 * 9. Sort data
 */
const sortData = (data, sortColumn = 0, sortOrder = 'asc') => {
  if (data.length <= 1) return { data };

  const headers = data[0];
  const rows = data.slice(1);

  // Determine column index
  let colIndex = 0;
  if (typeof sortColumn === 'string') {
    colIndex = headers.indexOf(sortColumn);
    if (colIndex === -1) colIndex = 0;
  } else {
    colIndex = sortColumn;
  }

  // Sort rows
  const sortedRows = rows.sort((a, b) => {
    const aVal = a[colIndex];
    const bVal = b[colIndex];

    // Handle different types
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (sortOrder === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
  });

  return { data: [headers, ...sortedRows] };
};

/**
 * Export workbook to file
 */
export const exportWorkbook = (workbook, filename) => {
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
