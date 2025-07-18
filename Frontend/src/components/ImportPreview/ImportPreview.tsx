import React from 'react';
import { X, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface ImportRow {
  index: number;
  data: any;
  isValid: boolean;
  errors: string[];
}

interface ImportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  rows: ImportRow[];
  onImportAll: () => void;
  onImportPartial: () => void;
  loading: boolean;
  title: string;
}

const ImportPreview: React.FC<ImportPreviewProps> = ({
  isOpen,
  onClose,
  rows,
  onImportAll,
  onImportPartial,
  loading,
  title
}) => {
  if (!isOpen) return null;

  const validRows = rows.filter(row => row.isValid);
  const invalidRows = rows.filter(row => !row.isValid);
  const hasValidRows = validRows.length > 0;
  const hasInvalidRows = invalidRows.length > 0;

  const getButtonSection = () => {
    if (!hasValidRows && hasInvalidRows) {
      // All rows are invalid
      return (
        <div className="flex flex-col gap-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="font-medium">All rows contain errors</span>
            </div>
            <p className="text-red-600 text-sm mt-1">
              Please fix the errors in your file before importing.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (hasValidRows && !hasInvalidRows) {
      // All rows are valid
      return (
        <div className="flex flex-col gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span className="font-medium">All rows are valid</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Ready to import {validRows.length} rows.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onImportAll}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import All'}
            </button>
          </div>
        </div>
      );
    }

    // Mixed valid and invalid rows
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle size={20} />
            <span className="font-medium">Partial data validation</span>
          </div>
          <p className="text-yellow-600 text-sm mt-1">
            {validRows.length} rows are valid, {invalidRows.length} rows have errors.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onImportPartial}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import Partial Data'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {title} Import Preview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Valid: {validRows.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Invalid: {invalidRows.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Total: {rows.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  row.isValid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {row.isValid ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Row {row.index + 1}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          row.isValid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    
                    {/* Row Data Preview */}
                    <div className="bg-white rounded p-3 mb-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {Object.entries(row.data).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="ml-1 font-medium">{String(value) || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Error Messages */}
                    {!row.isValid && row.errors.length > 0 && (
                      <div className="space-y-1">
                        {row.errors.map((error, errorIndex) => (
                          <div
                            key={errorIndex}
                            className="flex items-center gap-2 text-sm text-red-600"
                          >
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          {getButtonSection()}
        </div>
      </div>
    </div>
  );
};

export default ImportPreview;