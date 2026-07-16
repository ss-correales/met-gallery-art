//Url Api
const ApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let idsGlobales = [];
const coloresDepartamentos = {
    1: '#f2e8d8', // American Decorative Arts - crema
    3: '#e8dcc0', // Ancient West Asian Art - arena
    4: '#c8c0b0', // Arms and Armor - greige
    5: '#c0a888', // Arts of Africa, Oceania - tierra
    6: '#d0b898', // Asian Art - nuez cálido
    7: '#a89888', // The Cloisters - topo
    8: '#f0d8c8', // The Costume Institute - nude
    9: '#e0d8c8', // Drawings and Prints - lino
    10: '#d8c090', // Egyptian Art - camel dorado
    11: '#f0e8d8', // European Paintings - marfil
    12: '#e8e0d0', // European Sculpture - crudo
    13: '#f4f0e4', // Greek and Roman Art - hueso
    14: '#eed8b0', // Islamic Art - champagne
    15: '#c8b898', // Robert Lehman - beige clásico
    16: '#d8cdb8', // The Libraries - papel
    17: '#b89870', // Medieval Art - tostado
    18: '#d4b888', // Musical Instruments - madera
    19: '#d0c8b8', // Photographs - lino gris
    21: '#d8d0a0'  // Modern Art - caqui
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