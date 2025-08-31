export const filterData = (data: any[], searchTerm: string) => {
  return data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

export const sortData = (
  data: any[], 
  sortField: string, 
  sortDirection: "asc" | "desc"
) => {
  if (!sortField) return data;
  
  return [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

// Updated to support pagination-aware serial numbers
export const addSerialNumbers = (data: any[], currentPage: number = 1, pageSize: number = 10) => {
  const startIndex = (currentPage - 1) * pageSize;
  return data.map((row, index) => ({
    ...row,
    sn: startIndex + index + 1
  }));
};

export const handleSortLogic = (
  currentSortField: string,
  newSortField: string,
  currentSortDirection: "asc" | "desc",
  setSortField: (field: string) => void,
  setSortDirection: (direction: "asc" | "desc") => void
) => {
  if (currentSortField === newSortField) {
    setSortDirection(currentSortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortField(newSortField);
    setSortDirection("asc");
  }
};