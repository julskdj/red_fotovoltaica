cargarJSON()
let temperatura 
let humedad
let sensacion



function cargarJSON(){
    fetch('resources/archives/prueba.json')
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            console.log(data[0].temp)
            temperatura = data[0].temp
            humedad = data[0].hume
            sensacion = data[0].sensa

            var ctx4 = document.getElementById("myChart4").getContext('2d');
var myChart4 = new Chart(ctx4, {
    type: 'bar',
    data: {
        labels: ["Promedio Temperatura", "Promedio humedad", "Promedio sensacion Termica"],
        datasets: [{
            label: 'Promedios',
            data: [temperatura, humedad, sensacion],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
                
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
            responsive: true,
            maintainAspectRatio: false,
    }
});

        })
}



