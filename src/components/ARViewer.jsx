import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

function creerMontre() {
  const g = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ metalness: 0.7, roughness: 0.3 })
  const cuir = new THREE.MeshStandardMaterial({ roughness: 0.8, side: THREE.DoubleSide })
  const fond = new THREE.MeshStandardMaterial({ roughness: 0.4 })
  const blanc = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const rouge = new THREE.MeshBasicMaterial({ color: 0xe03030 })

  const bracelet = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.3, 48, 1, true), cuir)
  bracelet.scale.z = 0.7

  const boitier = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 48), metal)
  boitier.rotation.x = Math.PI / 2
  boitier.position.z = 0.29

  const lunette = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.02, 16, 48), metal)
  lunette.position.z = 0.335

  const cadran = new THREE.Mesh(new THREE.CircleGeometry(0.19, 48), fond)
  cadran.position.z = 0.337

  const verre = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.1 })
  )
  verre.position.z = 0.348

  const couronne = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 16), metal)
  couronne.rotation.z = Math.PI / 2
  couronne.position.set(0.24, 0, 0.29)

  const attacheHaut = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.05), metal)
  attacheHaut.position.set(0, 0.215, 0.27)
  const attacheBas = attacheHaut.clone()
  attacheBas.position.y = -0.215

  g.add(bracelet, boitier, lunette, cadran, couronne, attacheHaut, attacheBas)

  // 12 index
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180
    const gros = i % 3 === 0
    const index = new THREE.Mesh(new THREE.BoxGeometry(gros ? 0.024 : 0.012, gros ? 0.055 : 0.04, 0.004), blanc)
    index.position.set(Math.sin(a) * 0.15, Math.cos(a) * 0.15, 0.339)
    index.rotation.z = -a
    g.add(index)
  }

  // aiguilles (position 10h10)
  const aiguille = (larg, long, mat, angleDeg, z) => {
    const geo = new THREE.BoxGeometry(larg, long, 0.004)
    geo.translate(0, long / 2, 0)
    const m = new THREE.Mesh(geo, mat)
    m.position.z = z
    m.rotation.z = -(angleDeg * Math.PI) / 180
    return m
  }
  g.add(aiguille(0.02, 0.1, blanc, 305, 0.342))
  g.add(aiguille(0.014, 0.15, blanc, 60, 0.344))
  g.add(aiguille(0.006, 0.16, rouge, 150, 0.346))

  g.add(verre)
  return { groupe: g, metal, cuir, fond }
}
function appliquerCouleurs(mats, m) {
  mats.metal.color.set(m.boitier)
  mats.cuir.color.set(m.bracelet)
  mats.fond.color.set(m.cadran)
}

const ARViewer = forwardRef(function ARViewer({ montre }, ref) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const matsRef = useRef(null)
  const montreRef = useRef(montre)
  const [etat, setEtat] = useState('Chargement...')

  // Capture : image de la vidéo + montre, comme à l'écran (effet miroir)
  useImperativeHandle(ref, () => ({
    capturer() {
      const video = videoRef.current
      const canvas3d = canvasRef.current
      if (!video || !video.videoWidth) return null
      const c = document.createElement('canvas')
      c.width = video.videoWidth
      c.height = video.videoHeight
      const ctx = c.getContext('2d')
      ctx.translate(c.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, c.width, c.height)
      ctx.drawImage(canvas3d, 0, 0, c.width, c.height)
      return c.toDataURL('image/png')
    },
  }))

  // Changement de montre : on change juste les couleurs
  useEffect(() => {
    montreRef.current = montre
    if (matsRef.current) appliquerCouleurs(matsRef.current, montre)
  }, [montre])

  useEffect(() => {
    let annule = false, raf = 0, stream, renderer, tracker
    let dernierEtat = ''
    const dire = (t) => { if (t !== dernierEtat) { dernierEtat = t; setEtat(t) } }

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 }, audio: false,
        })
        if (annule) { stream.getTracks().forEach((t) => t.stop()); return }
        const video = videoRef.current
        video.srcObject = stream
        await video.play()

        const fileset = await FilesetResolver.forVisionTasks(WASM)
        tracker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        if (annule) { tracker.close(); return }

        const w = video.videoWidth, h = video.videoHeight
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current, alpha: true, antialias: true, preserveDrawingBuffer: true,
        })
        renderer.setSize(w, h, false)
        renderer.setClearColor(0x000000, 0)
       const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 3000)
camera.position.z = 1000
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const soleil = new THREE.DirectionalLight(0xffffff, 1.5)
soleil.position.set(0.5, 1, 1)
scene.add(soleil)

        const { groupe, ...mats } = creerMontre()
        matsRef.current = mats
        appliquerCouleurs(mats, montreRef.current)
        groupe.visible = false
        scene.add(groupe)

        const pt = (lm, i) => new THREE.Vector3((lm[i].x - 0.5) * w, -(lm[i].y - 0.5) * h, -lm[i].z * w)
        let dernierTemps = -1

        const boucle = () => {
          if (annule) return
          raf = requestAnimationFrame(boucle)
          if (video.currentTime === dernierTemps) return
          dernierTemps = video.currentTime
          const res = tracker.detectForVideo(video, performance.now())

          if (res.landmarks.length > 0) {
            const lm = res.landmarks[0]
            const poignet = pt(lm, 0), index = pt(lm, 5), milieu = pt(lm, 9), auriculaire = pt(lm, 17)
            const y = milieu.clone().sub(poignet).normalize()
            const xBrut = auriculaire.clone().sub(index).normalize()
            const z = new THREE.Vector3().crossVectors(xBrut, y).normalize()
            if (z.z < 0) z.negate()
            const x = new THREE.Vector3().crossVectors(y, z).normalize()
            const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
            const s = index.distanceTo(auriculaire)
            const pos = poignet.clone().addScaledVector(y, -0.3 * s)

            if (!groupe.visible) {
              groupe.position.copy(pos); groupe.quaternion.copy(q); groupe.scale.setScalar(s)
              groupe.visible = true
            } else {
              groupe.position.lerp(pos, 0.4)
              groupe.quaternion.slerp(q, 0.4)
              groupe.scale.setScalar(THREE.MathUtils.lerp(groupe.scale.x, s, 0.4))
            }
            dire('')
          } else {
            groupe.visible = false
            dire('Montrez votre main à la caméra')
          }
          renderer.render(scene, camera)
        }
        dire('Montrez votre main à la caméra')
        boucle()
      } catch (e) {
        console.error(e)
        dire('Erreur : caméra refusée ou indisponible')
      }
    }
    init()

    return () => {
      annule = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
      renderer?.dispose()
      tracker?.close()
      matsRef.current = null
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto' }}>
      <video ref={videoRef} playsInline muted
        style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} />
      <canvas ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
      {etat && (
        <p style={{ position: 'absolute', bottom: 8, left: 0, right: 0, margin: 0, color: 'white',
          textShadow: '0 0 4px black' }}>{etat}</p>
      )}
    </div>
  )
})

export default ARViewer