export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// List of common date field names
const DATE_FIELDS = [
  'date', 
  'lastSaleDate', 
  'lastPaymentDate', 
  'createdAt', 
  'updatedAt',
  'startDate',
  'endDate'
];

export const processDataDates = (data: any[]) => {
  return data.map(row => {
    const processedRow = { ...row };
    
    // Loop through all fields and format date fields
    DATE_FIELDS.forEach(fieldName => {
      if (processedRow[fieldName]) {
        processedRow[fieldName] = formatDate(processedRow[fieldName]);
      }
    });
    
    return processedRow;
  });
};