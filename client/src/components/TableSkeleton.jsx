function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;