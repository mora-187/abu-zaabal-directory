import './StateCards.css';

function LoadingState({ message = 'جاري التحميل...' }) {
  return (
    <div className="state-card">
      <div className="state-spinner"></div>
      <strong>{message}</strong>
    </div>
  );
}

export default LoadingState;