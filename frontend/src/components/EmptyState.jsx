import './StateCards.css';

function EmptyState({
  title = 'لا توجد بيانات',
  message = 'لم يتم العثور على أي نتائج.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="state-card">
      <strong>{title}</strong>
      <p>{message}</p>

      {actionLabel && onAction && (
        <button className="state-action" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;