export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  searchPlaceholder?: string;
  title?: string;
  showActions?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  customActions?: (row: any) => React.ReactNode;
}