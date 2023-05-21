async function loadData() {
    let loader = document.getElementById('div-overlay');
    loader.style.visibility = 'visible';
    const data = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    loader.style.visibility = 'hidden';
}