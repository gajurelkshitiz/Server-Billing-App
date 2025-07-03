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

export const addSerialNumbers = (data: any[]) => {
  return data.map((row, index) => ({
    ...row,
    sn: index + 1
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