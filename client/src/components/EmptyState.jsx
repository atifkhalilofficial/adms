function EmptyState({ icon = '📭', title, description, actionLabel, onAction }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;