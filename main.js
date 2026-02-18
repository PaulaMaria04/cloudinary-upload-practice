const CLOUD_NAME = "dzucm6lct"; 
const PRESET = "mi_primera_practica";

const fileInput = document.querySelector('#fileInput');
const dropZone = document.querySelector('#dropZone');
const btnUpload = document.querySelector('#btnUpload');
const preview = document.querySelector('#preview');
const statusText = document.querySelector('#statusText');
const instructionText = document.querySelector('#instructionText');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            instructionText.style.display = 'none';
            btnUpload.disabled = false; 
        };
        reader.readAsDataURL(file);
    }
});

btnUpload.addEventListener('click', () => {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', PRESET);

    btnUpload.disabled = true;
    statusText.innerText = "Subiendo... por favor espera.";

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error("Fallo en la red o archivo no permitido");
        return response.json();
    })
    .then(data => {
        statusText.innerHTML = `¡Éxito! Imagen guardada en la nube.`;
        console.log("URL de Cloudinary:", data.secure_url);
        preview.src = data.secure_url; 
    })
    .catch(error => {
        statusText.innerText = "Error: " + error.message;
        console.error("Detalle:", error);
    })
    .finally(() => {
        btnUpload.innerText = "Subida completada";
    });
});