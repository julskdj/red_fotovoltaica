console.log('conexion socekt io');
const socket = io();


var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["Serial"],
        datasets: [{
            label: "Temperatura de la bateria",
            backgroundColor: 'rgb(232, 29, 26)',
            borderColor: 'rgb(232, 29, 26)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

let counter = 0;
socket.on('arduino:data', function (dataSerial) {
    
    const temperatureDisplay = document.getElementById('temperature');
    console.log(dataSerial.value);
    temperatureDisplay.innerHTML = `${dataSerial.value}°C`;

    
    // console.log(dataSerial);
    chart.data.labels.push(counter);
    let dato 
    chart.data.datasets.forEach(dataset => {
        dato = parseFloat(dataSerial.value)
        dataset.data.push(dato);
    });
    counter++;
    chart.update();
});

var ctx2 = document.getElementById('myChart2').getContext('2d');
var chart2 = new Chart(ctx2, {
    // The type of chart we want to create
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["Serial"],
        datasets: [{
            label: "Humedad de la red fotovoltaica",
            backgroundColor: 'rgb(0, 104, 255)',
            borderColor: 'rgb(119, 173, 250)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

let counter2 = 0;
socket.on('arduino:hume', function (dataSerial) {
    // console.log(dataSerial);

    const humedad = document.getElementById('Humedad');
    console.log(dataSerial.value);
    humedad.innerHTML = `${dataSerial.value}°RH`;

    chart2.data.labels.push(counter2);
    let dato 
    chart2.data.datasets.forEach(dataset => {
        dato = parseFloat(dataSerial.value) 
        dataset.data.push(dato);
    });
    counter2++;
    chart2.update();
});

var ctx3 = document.getElementById('myChart3').getContext('2d');
var chart3 = new Chart(ctx3, {
    // The type of chart we want to create
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["Serial"],
        datasets: [{
            label: "Sensacion Termica",
            backgroundColor: 'rgb(143, 0, 255)',
            borderColor: 'rgb(143, 0, 255)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

let counter3 = 0;
socket.on('arduino:sens', function (dataSerial) {
    // console.log(dataSerial);
    chart3.data.labels.push(counter3);
    let dato 
    chart3.data.datasets.forEach(dataset => {
        dato = parseFloat(dataSerial.value) 
        dataset.data.push(dato);
    });
    counter3++;
    chart3.update();
});


