function CaptureButton({ onCapture }) {
  return (
    <button
      className="capture-button"
      onClick={onCapture}
      aria-label="Prendre une photo"
      title="Prendre une photo"
    >
      <span className="capture-circle"></span>
    </button>
  );
}

export default CaptureButton;