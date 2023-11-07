function backToModel() {
    window.location.href=`model.html?id=${modelId}`;
}

const backToModelButton = document.getElementById('backToModel');
backToModelButton.addEventListener('click', backToModel);
