import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiCopy, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

/**
 * Reusable Table Builder Component
 */
const TableBuilder = ({
  tables = [],
  onChange,
  onInsertToContent,
  title = 'Table Builder',
  showQuickTemplates = true,
  compact = false
}) => {
  const [editingTable, setEditingTable] = useState(null);

  const quickTemplates = [
    {
      name: 'Fee Structure',
      headers: ['Course', 'Duration', 'Annual Fee', 'Total Fee'],
      rows: [['B.Tech', '4 Years', '₹2,00,000', '₹8,00,000']]
    },
    {
      name: 'Placement Stats',
      headers: ['Year', 'Students Placed', 'Highest Package', 'Average Package'],
      rows: [['2024', '95%', '₹45 LPA', '₹12 LPA']]
    },
    {
      name: 'Admission Cutoff',
      headers: ['Category', 'Opening Rank', 'Closing Rank'],
      rows: [['General', '100', '5000'], ['OBC', '5001', '8000'], ['SC', '8001', '12000']]
    },
    {
      name: 'Course Comparison',
      headers: ['Feature', 'Course A', 'Course B'],
      rows: [['Duration', '4 Years', '2 Years'], ['Eligibility', '10+2', 'Graduation']]
    }
  ];

  const addTable = (template = null) => {
    const newTable = template || {
      name: 'New Table',
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [['', '', '']]
    };
    onChange([...tables, { ...newTable, id: Date.now() }]);
  };

  const updateTable = (index, updates) => {
    const newTables = [...tables];
    newTables[index] = { ...newTables[index], ...updates };
    onChange(newTables);
  };

  const removeTable = (index) => {
    onChange(tables.filter((_, i) => i !== index));
  };

  const addRow = (tableIndex) => {
    const table = tables[tableIndex];
    const newRow = table.headers.map(() => '');
    updateTable(tableIndex, { rows: [...table.rows, newRow] });
  };

  const updateCell = (tableIndex, rowIndex, colIndex, value) => {
    const newTables = [...tables];
    newTables[tableIndex].rows[rowIndex][colIndex] = value;
    onChange(newTables);
  };

  const updateHeader = (tableIndex, colIndex, value) => {
    const newTables = [...tables];
    newTables[tableIndex].headers[colIndex] = value;
    onChange(newTables);
  };

  const removeRow = (tableIndex, rowIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].rows = newTables[tableIndex].rows.filter((_, i) => i !== rowIndex);
    onChange(newTables);
  };

  const addColumn = (tableIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].headers.push('New Column');
    newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => [...row, '']);
    onChange(newTables);
  };

  const getTableHtml = (table) => {
    return `<table class="w-full border-collapse">\n  <thead>\n    <tr>${table.headers.map(h => `<th class="border p-2 bg-gray-100">${h}</th>`).join('')}</tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>${row.map(cell => `<td class="border p-2">${cell}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`;
  };

  const copyTableHtml = (table) => {
    navigator.clipboard.writeText(getTableHtml(table));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={compact ? 'text-xs font-semibold text-gray-700' : 'text-sm font-medium'}>
          {title}
        </p>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{tables.length} tables</span>
      </div>

      {/* Quick Templates */}
      {showQuickTemplates && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addTable()}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            <FiPlus className="inline mr-1" /> Add New Table
          </button>
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addTable(template)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              + {template.name}
            </button>
          ))}
        </div>
      )}

      {/* Tables List */}
      {tables.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No tables created yet.</p>
      ) : (
        <div className="space-y-4">
          {tables.map((table, tableIndex) => (
            <div key={table.id || tableIndex} className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
                {editingTable === tableIndex ? (
                  <input
                    type="text"
                    value={table.name}
                    onChange={(e) => updateTable(tableIndex, { name: e.target.value })}
                    className="border rounded px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium text-sm">{table.name}</span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTable(editingTable === tableIndex ? null : tableIndex)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {editingTable === tableIndex ? <FiCheck size={14} /> : <FiEdit2 size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyTableHtml(table)}
                    className="p-1 hover:bg-gray-200 rounded text-blue-600"
                    title="Copy HTML"
                  >
                    <FiCopy size={14} />
                  </button>
                  {onInsertToContent && (
                    <button
                      type="button"
                      onClick={() => onInsertToContent(getTableHtml(table))}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Insert to Content
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeTable(tableIndex)}
                    className="p-1 hover:bg-red-100 rounded text-red-500"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto p-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {table.headers.map((header, colIndex) => (
                        <th key={colIndex} className="border bg-gray-100 p-1">
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => updateHeader(tableIndex, colIndex, e.target.value)}
                            className="w-full bg-transparent text-center font-medium"
                          />
                        </th>
                      ))}
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border p-1">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateCell(tableIndex, rowIndex, colIndex, e.target.value)}
                              className="w-full text-center text-sm"
                            />
                          </td>
                        ))}
                        <td className="p-1">
                          <button
                            type="button"
                            onClick={() => removeRow(tableIndex, rowIndex)}
                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                          >
                            <FiX size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Actions */}
              <div className="bg-gray-50 px-3 py-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => addRow(tableIndex)}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  + Add Row
                </button>
                <button
                  type="button"
                  onClick={() => addColumn(tableIndex)}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  + Add Column
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableBuilder;
