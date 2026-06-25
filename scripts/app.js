//Url Api
const ApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let idsGlobales = [];
const coloresDepartamentos = {
    1: '#f5e6d3', // American Decorative Arts - crema cálido
    3: '#d4c5a9', // Ancient Near Eastern Art - arena
    4: '#8b9eb7', // Arms and Armor - acero azulado
    5: '#7a9e7e', // Arts of Africa, Oceania Americas - verde tierra
    6: '#c17f5a', // Asian Art - terracota
    7: '#6b7c6e', // The Cloisters - piedra musgo
    8: '#c4a4b0', // The Costume Institute - rosa polvoso
    9: '#b5b5b5', // Drawings and Prints - gris neutro
    10: '#c8a96e', // Egyptian Art - dorado arena
    11: '#8b7355', // European Paintings - marrón cálido
    12: '#9e9e8e', // European Sculpture - gris piedra
    13: '#d4c5a9', // Greek and Roman Art - mármol
    14: '#7a8c6e', // Islamic Art - verde salvia
    15: '#c4956a', // Robert Lehman - ámbar
    16: '#8b9eb7', // The Libraries - azul tinta
    17: '#6b7c6e', // Medieval Art - gris verdoso
    18: '#c4a882', // Musical Instruments - madera
    19: '#9e8e8e', // Photographs - gris fotográfico
    21: '#7a7a8c'  // Modern Art - gris violáceo
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
    const idsBarajados = mezclarArray(ids);
    intentarObra(idsBarajados, 0);
}

function intentarObra(idsBarajados, indice){
    if (indice >= idsBarajados.length) {
        console.error('No se encontró obra válida en esta lista.');
        return;
    }

    const idObra = idsBarajados[indice];

    fetch(ApiUrl + '/objects/' + idObra)
    .then(response => response.json())
    .then(obra => {
        if (obra.primaryImage !== '' && obra.artistDisplayName !== ''){
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
                    const idDepartamento = boton.dataset.id;
                    cargarObrasPorDepartamento(idDepartamento);
                });
            });
        })
        .catch(error => console.error('Error al cargar los departamentos:', error));
}

function cargarObrasPorDepartamento(idDepartamento) {
    document.body.style.backgroundColor = coloresDepartamentos[idDepartamento];
    fetch(ApiUrl + '/objects?departmentIds=' + idDepartamento)
        .then(response => response.json())
        .then(data => {
            idsGlobales = data.objectIDs;
            obtenerObraValida(idsGlobales);
        })
        .catch(error => {
            console.error('Error al cargar las obras del departamento:', error);
        })


}
iniciar();

document.getElementById('btn-siguiente').addEventListener('click', function () {
    obtenerObraValida(idsGlobales);
});
