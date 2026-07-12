'use client';

export default function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-[#CAC4DA]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-white/10 bg-transparent text-white">
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
