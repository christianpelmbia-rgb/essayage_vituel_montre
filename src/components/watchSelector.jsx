function WatchSelector({ watches, selectedWatch, onSelect }) {
  return (
    <section className="catalogue">
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow">COLLECTION</p>
          <h2>Choisissez votre montre</h2>
        </div>

        <span className="catalogue-count">
          {watches.length} modèles
        </span>
      </div>

      <div className="watch-list">
        {watches.map((watch) => (
          <button
            key={watch.id}
            className={`watch-card ${
              selectedWatch.id === watch.id ? "selected" : ""
            }`}
            onClick={() => onSelect(watch)}
          >
            <div className={`watch-card-image ${watch.color}`}>
              <div className="mini-strap"></div>

              <div className="mini-watch-face">
                <div className="mini-center"></div>
              </div>
            </div>

            <div className="watch-card-info">
              <span className="card-brand">{watch.brand}</span>
              <span className="card-name">{watch.name}</span>
              <span className="card-price">{watch.price}</span>
            </div>

            {selectedWatch.id === watch.id && (
              <span className="selected-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default WatchSelector;