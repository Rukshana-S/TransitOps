import React from 'react';

export default function TripFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Search by ID, source, destination..."
          className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
        />
      </div>
      <div className="w-48">
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
