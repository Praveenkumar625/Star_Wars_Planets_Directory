const results = document.querySelector('#results');
const button = document.querySelector('#button');
const name = document.querySelector('#name');
const population = document.querySelector('#population');
const climate = document.querySelector('#climate');
const terrain = document.querySelector('#terrain');
const gravity = document.querySelector('#gravity');

const buttonsContainer = document.getElementById('buttons');
const loadingIndicator = '<div class="loading" style="color:black;">Loading...</div>';

buttonsContainer.addEventListener('click', async function(event) {
    const buttonId = event.target.id;
    const button = document.getElementById(buttonId);
    button.innerHTML = loadingIndicator;

    switch (buttonId) {
        case 'Planets':
            await asyncFetch('planets');
            break;
        case 'residents':
            await asyncFetch('people');
            break;
        case 'people':
            await asyncFetch('vehicles');
            break;
        case 'random':
            getData();
            break;
        default:
            console.error('Invalid button clicked');
            break;
    }

    button.innerHTML = buttonId;
});

async function asyncFetch(value) {
    console.log(value);
    const res = await fetch(`https://swapi.dev/api/${value}/`);
    const data = await res.json();
    console.log(data);
    displayResults(data, value);
}

document.getElementById('random').addEventListener('click', function() {
    document.querySelector('.container_1').style.display = 'block';
    document.getElementById('results').innerHTML = '';
});

document.querySelectorAll('.btn-group-toggle .btn').forEach(function(button) {
    if (button.id !== 'random') {
        button.addEventListener('click', function() {
            document.querySelector('.container_1').style.display = 'none';
        });
    }
});

document.addEventListener('click', function(event) {
    if (event.target.matches('.residents-link')) {
        let residentsUrls = event.target.dataset.residentsUrls.split(',');
        fetchAndDisplayResidents(residentsUrls);
    }
});

async function fetchAndDisplayResidents(residentsUrls) {
    try {
        let residentNames = "";
        let residentDetailsContainer = document.querySelector('#resident-details');
        if (!residentDetailsContainer) {
            console.error('Resident details container not found in the DOM');
            return;
        }
        residentDetailsContainer.innerHTML = '<div class="loading" style="color:white" >Loading...</div>';
        
        for (let url of residentsUrls) {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let resident = await response.json();
            if (resident) {
                residentNames += `<div style="color:white"><h4>${resident.name}</h4></div>`;
            } else {
                throw new Error('Received null response for resident');
            }
        }

        displayResidentDetails(residentNames);
    } catch (error) {
        console.error("Error fetching resident data:", error);
    }
}

function displayResidentDetails(residentNames) {
    let residentDetailsContainer = document.querySelector('#resident-details');
    if (!residentDetailsContainer) {
        console.error('Resident details container not found in the DOM');
        return;
    }

    residentDetailsContainer.innerHTML = residentNames;
}

function displayResults(data, value) {
    let output = "";

    if (value === 'planets') {
        data.results.forEach((item, index) => {
            if (index % 4 === 0) {
                output += '<div class="row">';
            }
            const residentsLink = item.residents.length === 0 ? `<a href="#" class="residents-link disabled" disabled>residents</a>` : `<a href="#" class="residents-link" data-residents-urls="${item.residents.join(',')}">residents</a>`;
            output +=
                `<div class="col-md-3 mb-4">
                    <div class="card p-3">
                        <h4 class="card-title text-center" style="text-decoration:underline">${item.name}</h4>
                        <div class="card-content">
                            <span>Climate</span>: ${item.climate}<br>
                            <span>Population</span>: ${item.population}<br>
                            <span>Terrain</span>: ${item.terrain}<br>
                            <span>Gravity</span>: ${item.gravity}<br>
                            <span>Orbital Period</span>: ${item.orbital_period}<br>
                            <span style="text-decoration:underline">${residentsLink}</span>: ${item.residents.length}
                        </div>
                    </div>
                </div>`;
        });
    }
    if (value === 'people') {
        data.results.forEach((item, index) => {
            if (index % 4 === 0) {
                output += '<div class="row">'; 
            }
            output +=
                `<div class="col-md-3 mb-4">
                    <div class="card p-3">
                        <h4 class="card-title text-center" style="text-decoration:underline">${item.name}</h4>
                        <div class="card-content">
                            <div id="resident-details"></div>
                            <span">Height</span>: ${item.height}<br>
                            <span">Mass</span>: ${item.mass}<br>
                            <span">Gender</span>: ${item.gender}<br>
                            <span">Hair Color</span>: ${item.hair_color}<br>
                            <span">Skin Color</span>: ${item.skin_color}<br>
                            <span">Terrain</span>: ${item.terrain} (${item.gender})<br>
                        </div>
                    </div>
                </div>`;
        });
    }

    if (value === 'vehicles') {
        data.results.forEach((item, index) => {
            if (index % 4 === 0) {
                output += '<div class="row">'; 
            }
            output +=
                `<div class="col-md-3 mb-4">
                    <div class="card p-3">
                        <h4 class="card-title text-center" style="text-decoration:underline">${item.name}</h4>
                        <div class="card-content">
                            <span">Model</span>: ${item.model}<br>
                            <span">Length</span>: ${item.length}<br>
                            <span">Crew</span>: ${item.crew}<br>
                            <span">Max Atmosphering Speed</span>: ${item.max_atmosphering_speed}<br>
                            <span">Passengers</span>: ${item.passengers}<br>
                        </div>
                    </div>
                </div>`;
        });
    }
        results.innerHTML = output;
    }


    document.querySelector('#buttons').addEventListener('click', e =>{
        asyncFetch(e.target.textContent.trim().toLowerCase());
    });



    function getData() {
        generateDataLoading()
        let randomPlanet = Math.floor((Math.random() * 61) + 1)
        let swApi = "https://swapi.dev/api/planets/" + randomPlanet

        axios.get(swApi).then(response => {
            generateData(response.data)
        }).catch(e => {
            generateDataFail()
        })
    }

    function generateData(data) {
        name.innerText = data.name
        population.innerText = data.population
        climate.innerText = data.climate
        terrain.innerText = data.terrain
        gravity.innerText = data.gravity
    }

    function generateDataFail() {
        name.innerText = 'R.I.P Api'
        population.innerText = ''
        climate.innerText = ''
        terrain.innerText = ''
        gravity.innerText = ''
    }

    function generateDataLoading() {
        name.innerHTML = '<i class="fas fa-circle-notch fa-spin fa-sw"></i>'
        population.innerText = ''
        climate.innerText = ''
        terrain.innerText = ''
        gravity.innerText = ''
    }

    button.addEventListener('click', getData)



    