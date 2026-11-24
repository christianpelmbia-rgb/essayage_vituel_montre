function WatchInfo({ watch }) {
  return (
    <div className="watch-details">
      <div>
        <p className="watch-brand">{watch.brand}</p>
        <h2>{watch.name}</h2>
        <p className="watch-type">{watch.type}</p>
      </div>

      <p className="watch-price">{watch.price}</p>
    </div>
  );
}

export default WatchInfo;