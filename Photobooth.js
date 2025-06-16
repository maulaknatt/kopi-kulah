const preview = document.getElementById("preview")
const output = document.getElementById("output")
const capture = document.getElementById("capture")
const countdown = document.getElementById("countdown")
const downloadLink = document.getElementById("downloadLink")
const nextToFrame = document.getElementById("nextToFrame")
const backToCapture = document.getElementById("backToCapture")
const captureView = document.getElementById("captureView")
const frameView = document.getElementById("frameView")
const photoPreviewList = document.getElementById("photoPreviewList")
const ctx = output.getContext("2d")
const bgImage = new Image()

let capturedPhotos = []
let isCapturing = false
let selectedBackground = "tema1"
const bgTema1 = document.getElementById("bgTema1")
const bgTema2 = document.getElementById("bgTema2")
const bgTema3 = document.getElementById("bgTema3")
const bgTema4 = document.getElementById("bgTema4")

bgTema1.onclick = () => {
	selectedBackground = "tema1"
	updateBgButtons()
	renderPhotoStrip()
}
bgTema2.onclick = () => {
	selectedBackground = "tema2"
	updateBgButtons()
	renderPhotoStrip()
}
bgTema3.onclick = () => {
	selectedBackground = "tema3"
	updateBgButtons()
	renderPhotoStrip()
}
bgTema4.onclick = () => {
	selectedBackground = "tema4"
	updateBgButtons()
	renderPhotoStrip()
}

function updateBgButtons() {
	bgTema1.classList.toggle("selected", selectedBackground === "tema1")
	bgTema2.classList.toggle("selected", selectedBackground === "tema2")
	bgTema3.classList.toggle("selected", selectedBackground === "tema3")
	bgTema4.classList.toggle("selected", selectedBackground === "tema4")
}

// Buka kamera depan dengan error handling
async function startCamera() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		})
		preview.srcObject = stream
		preview.play()
	} catch (error) {
		alert("Gagal membuka kamera: " + error.message)
		console.error("Gagal membuka kamera:", error)
	}
}

// Set tema default
selectedBackground = "tema1"
updateBgButtons()

startCamera()

function updatePhotoPreviewList() {
	photoPreviewList.innerHTML = ""
	capturedPhotos.forEach((dataUrl, idx) => {
		const img = document.createElement("img")
		img.src = dataUrl
		img.className = "photo-preview-thumb"
		img.alt = `Foto ${idx + 1}`
		photoPreviewList.appendChild(img)
	})
}

capture.addEventListener("click", async () => {
	if (isCapturing) return
	isCapturing = true
	capture.disabled = true

	const totalPhotos = 3
	for (let i = 0; i < totalPhotos; i++) {
		await tampilkanCountdown(3)

		// buat capture foto
		const tempCanvas = document.createElement("canvas")
		tempCanvas.width = 800
		tempCanvas.height = 600
		const tempCtx = tempCanvas.getContext("2d")
		// Mirror
		tempCtx.save()
		tempCtx.translate(800, 0)
		tempCtx.scale(-1, 1)
		tempCtx.drawImage(preview, 0, 0, 800, 600)
		tempCtx.restore()
		const dataUrl = tempCanvas.toDataURL("image/png")
		capturedPhotos.push(dataUrl)
		updatePhotoPreviewList()
	}

	nextToFrame.style.display = "inline-block"
	isCapturing = false
})

nextToFrame.addEventListener("click", async () => {
	// buat pindah ke frame view
	captureView.style.display = "none"
	frameView.style.display = "flex"
	await renderPhotoStrip()
})

backToCapture.addEventListener("click", () => {
	// buat reset foto
	capturedPhotos = []
	updatePhotoPreviewList()
	capture.disabled = false
	nextToFrame.style.display = "none"
	frameView.style.display = "none"
	captureView.style.display = "flex"
	downloadLink.style.display = "none"
})

async function renderPhotoStrip() {
	const templateWidth = 1600
	const templateHeight = 4330
	output.width = templateWidth
	output.height = templateHeight
	output.style.display = "block"
	ctx.clearRect(0, 0, output.width, output.height)

	// buat background template
	if (selectedBackground === "tema1") {
		const tema1Img = new Image()
		tema1Img.src = "img/tema1.png"
		await new Promise((resolve) => {
			tema1Img.onload = resolve
		})
		ctx.drawImage(tema1Img, 0, 0, output.width, output.height)
	}

	if (selectedBackground === "tema2") {
		const tema2Img = new Image()
		tema2Img.src = "img/tema2.png"
		await new Promise((resolve) => {
			tema2Img.onload = resolve
		})
		ctx.drawImage(tema2Img, 0, 0, output.width, output.height)
	}

	if (selectedBackground === "tema3") {
		const tema3Img = new Image()
		tema3Img.src = "img/tema3.png"
		await new Promise((resolve) => {
			tema3Img.onload = resolve
		})
		ctx.drawImage(tema3Img, 0, 0, output.width, output.height)
	}

	if (selectedBackground === "tema4") {
		const tema4Img = new Image()
		tema4Img.src = "img/tema4.png"
		await new Promise((resolve) => {
			tema4Img.onload = resolve
		})
		ctx.drawImage(tema4Img, 0, 0, output.width, output.height)
	}

	// adjust posisi setiap foto
	const slotHeight = 1164
	const slotGap = 56
	const topGap = 56
	const slots = [
		{ x: 40, y: topGap, w: 1520, h: slotHeight },
		{ x: 40, y: topGap + slotHeight + slotGap, w: 1520, h: slotHeight },
		{ x: 40, y: topGap + 2 * (slotHeight + slotGap), w: 1520, h: slotHeight },
	]

	// buat load dan gambar setiap foto
	for (let i = 0; i < slots.length; i++) {
		if (capturedPhotos[i]) {
			await new Promise((resolve) => {
				const img = new window.Image()
				img.onload = () => {
					// buat crop foto dengan mempertahankan aspek rasio
					const srcAspect = img.width / img.height
					const dstAspect = slots[i].w / slots[i].h
					let sx = 0,
						sy = 0,
						sw = img.width,
						sh = img.height

					if (srcAspect > dstAspect) {
						// Foto lebih lebar dari slot
						sw = img.height * dstAspect
						sx = (img.width - sw) / 2
					} else {
						// Foto lebih tinggi dari slot
						sh = img.width / dstAspect
						sy = (img.height - sh) / 2
					}

					// Gambar foto dengan mempertahankan aspek rasio
					ctx.drawImage(
						img,
						sx,
						sy,
						sw,
						sh,
						slots[i].x,
						slots[i].y,
						slots[i].w,
						slots[i].h
					)
					resolve()
				}
				img.src = capturedPhotos[i]
			})
		}
	}

	// buat gambar template frame
	await new Promise((resolve) => {
		if (bgImage.complete) {
			ctx.drawImage(bgImage, 0, 0, output.width, output.height)
			resolve()
		} else {
			bgImage.onload = () => {
				ctx.drawImage(bgImage, 0, 0, output.width, output.height)
				resolve()
			}
		}
	})

	// buat link download
	const imageURL = output.toDataURL("image/png")
	downloadLink.href = imageURL
	downloadLink.style.display = "inline-block"
}

// Countdown
function tampilkanCountdown(detik) {
	return new Promise((resolve) => {
		let counter = detik
		countdown.textContent = counter
		countdown.style.display = "block"
		const interval = setInterval(() => {
			counter--
			countdown.textContent = counter > 0 ? counter : ""
			if (counter <= 0) {
				clearInterval(interval)
				countdown.style.display = "none"
				resolve()
			}
		}, 1000)
	})
}

// Initial state
output.style.display = "none"
downloadLink.style.display = "none"
nextToFrame.style.display = "none"
updatePhotoPreviewList()
