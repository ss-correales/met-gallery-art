//Url Api
const ApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let idsGlobales =[];

function iniciar(){
    fetch(ApiUrl +'/objects')
    .then(response => response.json())
    .then(data => {
        idsGlobales = data.objectIDs;
        obtenerObraValida(data.objectIDs);
        cargarDepartamentos();
    })
    .catch(error => console.error('Error al cargar la lista:', error));
}

function obtenerObraValida(ids){
    const indiceAleatorio = Math.floor(Math.random()* ids.length);
    const idObra = ids[indiceAleatorio];

    fetch(ApiUrl + '/objects/' + idObra)
    .then(response => response.json())
    .then(obra => {
        if(obra.primaryImage !== '' && obra.artistDisplayName !== '') {
            mostrarObra(obra);
        } else {
            obtenerObraValida(ids);
        }
    })
    .catch(error => console.error('Error al cargar la obra:', error));
}

function mostrarObra(obra){
    document.getElementById('obra-imagen').src = obra.primaryImage;
    document.getElementById('obra-titulo').textContent = obra.title;
    document.getElementById('obra-artista').textContent = obra.artistDisplayName;
    document.getElementById('obra-fecha').textContent = obra.objectDate;
    document.getElementById('obra-tecnica').textContent = obra.medium;
}

function cargarDepartamentos(){
    fetch(ApiUrl + '/departments')
    .then(response => response.json())
    .then(data => {
        data.departments.forEach(departamento => {
            const boton = document.createElement('button');
            boton.textContent = departamento.displayName;
            document.getElementById('lista-departamentos').appendChild(boton);
        });
    })
    .catch(error => console.error('Error al cargar los departamentos:', error));
}

iniciar();

document.getElementById('btn-siguiente').addEventListener('click', function(){
    obtenerObraValida(idsGlobales);
});
