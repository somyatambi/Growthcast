/**
 * Excel File Cleaning Utility Functions
 * All functions are non-AI based and use pure JavaScript logic
 */

// 1. Remove Duplicates
export const removeDuplicates = (data, columns = null) => {
  if (!data || data.length === 0) return data;

  const seen = new Set();
  return data.filter(row => {
    const key = columns 
      ? columns.map(col => row[col]).join('|')
      : JSON.stringify(row);
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// 2. Handle Missing Values
export const handleMissingValues = (data, strategy = 'fill', fillValue = 'N/A') => {
  if (!data || data.length === 0) return data;

  const columns = Object.keys(data[0]);

  return data.filter(row => {
    let hasValue = false;

    columns.forEach(col => {
      if (row[col] === null || row[col] === undefined || row[col] === '') {
        if (strategy === 'fill') {
          row[col] = fillValue;
        } else if (strategy === 'average' && !isNaN(row[col])) {
          // Calculate average for numeric columns
          const values = data
            .map(r => r[col])
            .filter(v => v !== null && v !== undefined && v !== '' && !isNaN(v));
          const avg = values.reduce((sum, v) => sum + Number(v), 0) / values.length;
          row[col] = avg;
        }
      }
      if (row[col] !== null && row[col] !== undefined && row[col] !== '') {
        hasValue = true;
      }
    });

    // If strategy is 'remove', filter out rows with no values
    return strategy === 'remove' ? hasValue : true;
  });
};

// 3. Trim Extra Spaces
export const trimSpaces = (data) => {
  if (!data || data.length === 0) return data;

  return data.map(row => {
    const trimmedRow = {};
    Object.keys(row).forEach(key => {
      const value = row[key];
      trimmedRow[key] = typeof value === 'string' ? value.trim() : value;
    });
    return trimmedRow;
  });
};

// 4. Convert Data Types
export const convertDataTypes = (data) => {
  if (!data || data.length === 0) return data;

  return data.map(row => {
    const convertedRow = {};
    Object.keys(row).forEach(key => {
      const value = row[key];
      
      if (value === null || value === undefined || value === '') {
        convertedRow[key] = value;
        return;
      }

      // Try to convert to number
      if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
        convertedRow[key] = Number(value);
      }
      // Try to convert to boolean
      else if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
        convertedRow[key] = value.toLowerCase() === 'true';
      }
      // Keep as is
      else {
        convertedRow[key] = value;
      }
    });
    return convertedRow;
  });
};

// 5. Standardize Date Formats
export const standardizeDateFormats = (data, dateColumns = []) => {
  if (!data || data.length === 0) return data;

  const parseDate = (value) => {
    if (!value) return value;
    
    // Handle Excel serial date numbers
    if (typeof value === 'number') {
      const date = new Date((value - 25569) * 86400 * 1000);
      return date;
    }

    // Try to parse string dates
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return data.map(row => {
    const formattedRow = { ...row };
    
    Object.keys(row).forEach(key => {
      // If specific date columns are provided, only format those
      if (dateColumns.length > 0 && !dateColumns.includes(key)) {
        return;
      }

      const value = row[key];
      if (value) {
        const date = parseDate(value);
        formattedRow[key] = formatDate(date);
      }
    });

    return formattedRow;
  });
};

// 6. Fix Text Case
export const fixTextCase = (data, caseType = 'proper', columns = []) => {
  if (!data || data.length === 0) return data;

  const toProperCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return data.map(row => {
    const casedRow = { ...row };
    
    Object.keys(row).forEach(key => {
      if (columns.length > 0 && !columns.includes(key)) {
        return;
      }

      const value = row[key];
      if (typeof value === 'string') {
        switch (caseType) {
          case 'upper':
            casedRow[key] = value.toUpperCase();
            break;
          case 'lower':
            casedRow[key] = value.toLowerCase();
            break;
          case 'proper':
            casedRow[key] = toProperCase(value);
            break;
          default:
            casedRow[key] = value;
        }
      }
    });

    return casedRow;
  });
};

// 7. Remove Blank Rows/Columns
export const removeBlankRowsAndColumns = (data) => {
  if (!data || data.length === 0) return data;

  // Remove blank rows (rows where all values are empty)
  const nonEmptyRows = data.filter(row => {
    return Object.values(row).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  });

  if (nonEmptyRows.length === 0) return [];

  // Remove blank columns (columns where all values are empty)
  const columns = Object.keys(nonEmptyRows[0]);
  const columnsToKeep = columns.filter(col => {
    return nonEmptyRows.some(row => 
      row[col] !== null && row[col] !== undefined && row[col] !== ''
    );
  });

  return nonEmptyRows.map(row => {
    const cleanRow = {};
    columnsToKeep.forEach(col => {
      cleanRow[col] = row[col];
    });
    return cleanRow;
  });
};

// 8. Validate Data
export const validateData = (data, validationRules = {}) => {
  if (!data || data.length === 0) return { validData: data, errors: [] };

  const errors = [];
  const validData = data.filter((row, index) => {
    let isValid = true;

    Object.keys(validationRules).forEach(col => {
      const rule = validationRules[col];
      const value = row[col];

      // Numeric validation
      if (rule.type === 'number' && isNaN(value)) {
        errors.push(`Row ${index + 1}, Column "${col}": Expected number, got "${value}"`);
        isValid = false;
      }

      // Email validation
      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`Row ${index + 1}, Column "${col}": Invalid email "${value}"`);
          isValid = false;
        }
      }

      // Phone validation
      if (rule.type === 'phone') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
          errors.push(`Row ${index + 1}, Column "${col}": Invalid phone "${value}"`);
          isValid = false;
        }
      }

      // Custom regex
      if (rule.regex && !rule.regex.test(value)) {
        errors.push(`Row ${index + 1}, Column "${col}": Failed validation for "${value}"`);
        isValid = false;
      }
    });

    return isValid;
  });

  return { validData, errors };
};

// 9. Merge Multiple Sheets (data arrays)
export const mergeDatasets = (datasets) => {
  if (!datasets || datasets.length === 0) return [];
  
  // Get all unique columns
  const allColumns = new Set();
  datasets.forEach(dataset => {
    if (dataset.length > 0) {
      Object.keys(dataset[0]).forEach(col => allColumns.add(col));
    }
  });

  // Merge all datasets
  const merged = [];
  datasets.forEach(dataset => {
    dataset.forEach(row => {
      const normalizedRow = {};
      Array.from(allColumns).forEach(col => {
        normalizedRow[col] = row[col] !== undefined ? row[col] : '';
      });
      merged.push(normalizedRow);
    });
  });

  return merged;
};

// 10. Normalize Column Names
export const normalizeColumnNames = (data) => {
  if (!data || data.length === 0) return data;

  return data.map(row => {
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      const normalizedKey = key
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      normalizedRow[normalizedKey] = row[key];
    });
    return normalizedRow;
  });
};

// 11. Find & Replace
export const findAndReplace = (data, findValue, replaceValue, columns = []) => {
  if (!data || data.length === 0) return data;

  const regex = new RegExp(findValue, 'gi');

  return data.map(row => {
    const replacedRow = { ...row };
    
    Object.keys(row).forEach(key => {
      if (columns.length > 0 && !columns.includes(key)) {
        return;
      }

      const value = row[key];
      if (typeof value === 'string') {
        replacedRow[key] = value.replace(regex, replaceValue);
      }
    });

    return replacedRow;
  });
};

// 12. Filter Unwanted Data
export const filterData = (data, filterConditions) => {
  if (!data || data.length === 0) return data;

  return data.filter(row => {
    return Object.keys(filterConditions).every(col => {
      const condition = filterConditions[col];
      const value = row[col];

      if (condition.equals !== undefined) {
        return value === condition.equals;
      }
      if (condition.notEquals !== undefined) {
        return value !== condition.notEquals;
      }
      if (condition.contains !== undefined) {
        return String(value).toLowerCase().includes(String(condition.contains).toLowerCase());
      }
      if (condition.greaterThan !== undefined) {
        return Number(value) > Number(condition.greaterThan);
      }
      if (condition.lessThan !== undefined) {
        return Number(value) < Number(condition.lessThan);
      }

      return true;
    });
  });
};

// 13. Sort Data
export const sortData = (data, column, order = 'asc') => {
  if (!data || data.length === 0) return data;

  return [...data].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    // Handle null/undefined
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Numeric sort
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // String sort
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (order === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
  });
};

// Master cleaning function that applies all operations
export const cleanExcelData = (data, options = {}) => {
  let cleanedData = [...data];

  // Apply cleaning operations in order
  if (options.removeDuplicates) {
    cleanedData = removeDuplicates(cleanedData, options.duplicateColumns);
  }

  if (options.trimSpaces) {
    cleanedData = trimSpaces(cleanedData);
  }

  if (options.normalizeColumns) {
    cleanedData = normalizeColumnNames(cleanedData);
  }

  if (options.removeBlankRows) {
    cleanedData = removeBlankRowsAndColumns(cleanedData);
  }

  if (options.handleMissing) {
    cleanedData = handleMissingValues(
      cleanedData, 
      options.missingStrategy || 'fill',
      options.fillValue || 'N/A'
    );
  }

  if (options.convertTypes) {
    cleanedData = convertDataTypes(cleanedData);
  }

  if (options.standardizeDates) {
    cleanedData = standardizeDateFormats(cleanedData, options.dateColumns || []);
  }

  if (options.fixCase) {
    cleanedData = fixTextCase(cleanedData, options.caseType || 'proper', options.caseColumns || []);
  }

  if (options.findReplace) {
    Object.keys(options.findReplace).forEach(findValue => {
      cleanedData = findAndReplace(
        cleanedData,
        findValue,
        options.findReplace[findValue],
        options.replaceColumns || []
      );
    });
  }

  if (options.filterConditions) {
    cleanedData = filterData(cleanedData, options.filterConditions);
  }

  if (options.sortBy) {
    cleanedData = sortData(cleanedData, options.sortBy, options.sortOrder || 'asc');
  }

  return cleanedData;
};
