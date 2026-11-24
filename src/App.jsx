<<<<<<< HEAD
import { useState } from "react";
import "./App.css";

const watches = [
  {
    id: 1,
    name: "Submariner",
    brand: "ROLEX",
    price: "25 000 FCFA",
    color: "gold",
    type: "Luxe",
  },
  {
    id: 2,
    name: "Royal Oak",
    brand: "AUDEMARS PIGUET",
    price: "45 000 FCFA",
    color: "silver",
    type: "Premium",
  },
  {
    id: 3,
    name: "G-Shock",
    brand: "CASIO",
    price: "60 000 FCFA",
    color: "black",
    type: "Sport",
  },
  {
    id: 4,
    name: "Speedmaster",
    brand: "OMEGA",
    price: "1 800 000 FCFA",
    color: "blue",
    type: "Classique",
  },
];

function App() {
  const [selectedWatch, setSelectedWatch] = useState(watches[0]);
  const [message, setMessage] = useState("");

  const handleCapture = () => {
    setMessage("La capture photo sera bientôt disponible 📸");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">⌚</span>
          <span>VIRTUAL<span className="accent">WATCH</span></span>
        </div>

        <span className="beta">BETA</span>
      </header>

      <main className="main-content">
        <section className="intro">
          <p className="eyebrow">L'ESSAYAGE DU FUTUR</p>

          <h1>
            Votre montre.
            <br />
            <span>Votre style.</span>
          </h1>

          <p className="intro-text">
            Essayez votre montre préférée en réalité augmentée,
            directement sur votre poignet.
          </p>
        </section>

        <section className="try-on">
          <div className="camera-area">
            <div className="camera-top">
              <span className="camera-status">
                <span className="status-dot"></span>
                CAMÉRA
              </span>

              <span className="ar-label">AR EXPERIENCE</span>
            </div>

            <div className="camera-placeholder">
              <div className="hand-placeholder">
                <span>✋</span>
              </div>

              <div className={`watch-illustration ${selectedWatch.color}`}>
                <div className="watch-strap"></div>
                <div className="watch-face">
                  <div className="watch-center"></div>
                  <div className="watch-hand hand-one"></div>
                  <div className="watch-hand hand-two"></div>
                </div>
              </div>

              <p className="camera-message">
                L'aperçu de votre poignet apparaîtra ici
              </p>
            </div>

            <div className="camera-bottom">
              <button className="camera-option" onClick={() => setMessage("Caméra bientôt intégrée")}>
                ◉
                <span>Caméra</span>
              </button>

              <button className="capture-button" onClick={handleCapture}>
                <span className="capture-circle"></span>
              </button>

              <button className="camera-option" onClick={() => setMessage("Galerie bientôt disponible")}>
                ▧
                <span>Galerie</span>
              </button>
            </div>
          </div>

          <div className="watch-details">
            <div>
              <p className="watch-brand">{selectedWatch.brand}</p>
              <h2>{selectedWatch.name}</h2>
              <p className="watch-type">{selectedWatch.type}</p>
            </div>

            <p className="watch-price">{selectedWatch.price}</p>
          </div>
        </section>

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
                onClick={() => {
                  setSelectedWatch(watch);
                  setMessage("");
                }}
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

        {message && (
          <div className="notification">
            {message}
          </div>
        )}

        <footer className="footer">
          <span>VIRTUAL WATCH AR</span>
          <span>EXPLORE YOUR STYLE</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
=======
import { useRef, useState } from 'react'
import ARViewer from './components/ARViewer'
import { montres } from './data/montres'
import './App.css'

export default function App() {
  const viewerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [photo, setPhoto] = useState(null)
  const montre = montres[index]

  const prendrePhoto = () => {
    if (!viewerRef.current) return
    try {
      const img = viewerRef.current.capturer()
      if (!img) {
        alert("La caméra n'est pas encore prête")
        return
      }
      setPhoto(img)
    } catch (e) {
      console.error(e)
      alert('Erreur : ' + e.message)
    }
  }

  return (
    <main className="page">
      <h1>Essayage virtuel de montre</h1>

      <div className="camera">
        <ARViewer ref={viewerRef} montre={montre} />
      </div>

      <div className="choix">
        {montres.map((m, i) => (
          <button key={m.id} onClick={() => setIndex(i)}
            className={i === index ? 'actif' : ''}>
            {m.nom}
          </button>
        ))}
      </div>

      <div className="infos">
        <p><b>{montre.nom}</b> - {montre.marque}</p>
        <p className="prix">{montre.prix.toLocaleString('fr-FR')} FCFA</p>
      </div>

      <button className="btn-photo" onClick={prendrePhoto}>Prendre une photo</button>

      {photo && (
        <div className="resultat">
          <img src={photo} alt="Essayage" />
          <p><a href={photo} download="essayage-montre.png">Télécharger la photo</a></p>
        </div>
      )}
    </main>
  )
}
>>>>>>> paul-techart/main
