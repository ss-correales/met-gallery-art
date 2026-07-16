//Url Api
const ApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let idsGlobales = [];
const coloresDepartamentos = {
    1:  '#f2ece0', // American Decorative Arts
    3:  '#ede8d6', // Ancient West Asian Art
    4:  '#eceae4', // Arms and Armor
    5:  '#ede8dc', // Arts of Africa, Oceania
    6:  '#eee8da', // Asian Art
    7:  '#eae6e0', // The Cloisters
    8:  '#f2e8e0', // The Costume Institute
    9:  '#edeae2', // Drawings and Prints
    10: '#f0ecca', // Egyptian Art
    11: '#f2ede4', // European Paintings
    12: '#edeae2', // European Sculpture
    13: '#f5f2e8', // Greek and Roman Art
    14: '#f0edcc', // Islamic Art
    15: '#eceae2', // Robert Lehman
    16: '#eeece4', // The Libraries
    17: '#ede8d8', // Medieval Art
    18: '#f0ecd6', // Musical Instruments
    19: '#eceae6', // Photographs
    21: '#f0ede0'  // Modern Art
};

function iniciar() {
    fetch(ApiUrl + '/objects')
        .then(response => response.json())
        .then(data => {
            idsGlobales = data.objectIDs;
            obtenerObraValida(data.objectIDs);
            cargarDepartamentos();
        })
        .catch(error => console.error('Error al cargar la lista:', error));
}

function mezclarArray(array) {
    const copia = [...array]
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copia[i];
        copia[i] = copia[j];
        copia[j] = temp;
    }
    return copia;
}

function obtenerObraValida(ids) {
    document.getElementById('obra-mensaje').textContent = 'Buscando obra...';
    const idsBarajados = mezclarArray(ids);
    intentarObra(idsBarajados, 0);
}

function intentarObra(idsBarajados, indice) {
    if (indice >= idsBarajados.length) {
        console.error('No se encontró obra válida en esta lista.');
        return;
    }

    const idObra = idsBarajados[indice];

    fetch(ApiUrl + '/objects/' + idObra)
        .then(response => response.json())
        .then(obra => {
            if (obra.primaryImage !== '' && obra.artistDisplayName !== '') {
                mostrarObra(obra);
            } else {
                setTimeout(() => intentarObra(idsBarajados, indice + 1), 200);
            }
        })
        .catch(error => {
            console.error('Error con este ID, intentando otro...', error);
            setTimeout(() => intentarObra(idsBarajados, indice + 1), 200);
        })
}

function mostrarObra(obra) {
    document.getElementById('obra-mensaje').textContent = '';
    document.getElementById('btn-siguiente').disabled = false;
    document.getElementById('obra-imagen').src = obra.primaryImage;
    document.getElementById('obra-titulo').textContent = obra.title;
    document.getElementById('obra-artista').textContent = obra.artistDisplayName;
    document.getElementById('obra-fecha').textContent = obra.objectDate;
    document.getElementById('obra-tecnica').textContent = obra.medium;
}

function cargarDepartamentos() {
    fetch(ApiUrl + '/departments')
        .then(response => response.json())
        .then(data => {
            data.departments.forEach(departamento => {
                const boton = document.createElement('button');
                boton.textContent = departamento.displayName;
                boton.dataset.id = departamento.departmentId;
                document.getElementById('lista-departamentos').appendChild(boton);
                boton.addEventListener('click', function () {
                    cargarObrasPorDepartamento(boton.dataset.id, departamento.displayName);
                });
            });
        })
        .catch(error => console.error('Error al cargar los departamentos:', error));
}

function cargarObrasPorDepartamento(idDepartamento, nombreDepartamento) {
    document.body.style.backgroundColor = coloresDepartamentos[idDepartamento];
    document.getElementById('departamento-titulo').textContent = nombreDepartamento;
    mostrarVista('departamento');

    fetch(ApiUrl + '/objects?departmentIds=' + idDepartamento)
        .then(response => response.json())
        .then(data => {
            idsGlobales = data.objectIDs;
            const idsBarajados = mezclarArray(idsGlobales);
            cargarMiniaturas(idsBarajados, 0, []);
        })
        .catch(error => {
            console.error('Error al cargar las obras del departamento:', error);
        })
}

function mostrarVista(vista){
    document.getElementById('vista-departamento').hidden = (vista !== 'departamento');
    document.getElementById('vista-exposicion').hidden = (vista !== 'exposicion');
}

function cargarMiniaturas (idsBarajados, indice, miniaturas){
    const maximo = 12;

    if (miniaturas.length >= maximo || indice >= idsBarajados.length){
        mostrarMiniaturas(miniaturas);
        return;
    }

    const idObra = idsBarajados[indice];

    fetch (ApiUrl + '/objects/' + idObra)
    .then (response => response.json())
    .then(obra => {
        if (obra.primaryImageSmall !== ''){
            miniaturas.push(obra);
        }
        setTimeout(() => cargarMiniaturas(idsBarajados, indice+1, miniaturas),200);
    })
    .catch(error => {
        console.error('Error con esta miniatura, intentando otra...', error);
        setTimeout(() => cargarMiniaturas(idsBarajados, indice + 1, miniaturas), 200);
    });
}

function mostrarMiniaturas(miniaturas) {
    const grid = document.getElementById('grid-miniaturas');
    grid.innerHTML = '';

    miniaturas.forEach(obra => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = obra.primaryImageSmall;
        img.alt = obra.title;

        card.appendChild(img);
        grid.appendChild(card);
    });

    document.getElementById('btn-comenzar-expo').hidden = false;
}

iniciar();

document.getElementById('btn-siguiente').addEventListener('click', function () {
    this.disabled = true;
    obtenerObraValida(idsGlobales);
});
document.getElementById('btn-comenzar-expo').addEventListener('click', function () {
    mostrarVista('exposicion');
    obtenerObraValida(idsGlobales);
});
document.getElementById('btn-toggle-sidebar').addEventListener('click', function (){
    document.getElementById('barra-lateral').classList.toggle('oculta');
});