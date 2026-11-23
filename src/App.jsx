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