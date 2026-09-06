import './StateCards.css';

function ErrorState({ message = 'حدث خطأ أثناء تحميل البيانات', onRetry }) {
  return (
    <div className="state-card is-error" role="alert">
      <strong>حدث خطأ</strong>
      <p>{message}</p>

      {onRetry && (
        <button className="state-action" type="button" onClick={onRetry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

export default ErrorState;