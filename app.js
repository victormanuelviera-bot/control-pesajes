//====================================================
// CONTROL DE PESAJES
// Versión 2.0
//====================================================

//-------------------------
// LocalStorage
//-------------------------

const STORAGE_PESAJES = "pesajes";
const STORAGE_TARA = "tara";
const STORAGE_PIN = "pinTara";

//-------------------------
// Variables
//-------------------------

let pesajes = JSON.parse(localStorage.getItem(STORAGE_PESAJES)) || [];

let taraFija = localStorage.getItem(STORAGE_PIN) === "true";

//-------------------------
// Elementos HTML
//-------------------------

const fecha = document.getElementById("fecha");

const numero = document.getElementById("numero");

const envase = document.getElementById("envase");

const neto = document.getElementById("neto");

const tara = document.getElementById("tara");

const producto = document.getElementById("producto");

const guardar = document.getElementById("guardar");

const lista = document.getElementById("lista");

const totalNeto = document.getElementById("totalNeto");

const totalTara = document.getElementById("totalTara");

const totalProducto = document.getElementById("totalProducto");

const botonPin = document.getElementById("fijarTara");

//====================================================
// Inicialización
//====================================================

function iniciar(){

    fecha.textContent = new Date().toLocaleDateString("es-UY");

    numero.value = pesajes.length + 1;

    envase.value = localStorage.getItem("envase") || "";

    tara.value = localStorage.getItem(STORAGE_TARA) || "";

    botonPin.classList.toggle("activo", taraFija);

    actualizarLista();

    calcularProducto();

}

iniciar();

//====================================================
// Calcular Producto
//====================================================

function calcularProducto(){

    const pesoNeto = Number(neto.value) || 0;

    const pesoTara = Number(tara.value) || 0;

    const pesoProducto = Math.max(0,pesoNeto-pesoTara);

    producto.textContent = pesoProducto.toFixed(0) + " g";

}

neto.addEventListener("input",calcularProducto);

tara.addEventListener("input",()=>{

    calcularProducto();

    if(taraFija && tara.value !== ""){

    localStorage.setItem(STORAGE_TARA,tara.value);

}

});

//====================================================
// Tara fija
//====================================================

botonPin.addEventListener("click",()=>{

    taraFija = !taraFija;

    botonPin.classList.toggle("activo", taraFija);

    localStorage.setItem(STORAGE_PIN,taraFija);

    if(taraFija){

    if(tara.value !== ""){

        localStorage.setItem(STORAGE_TARA,tara.value);

    }

}else{

    localStorage.removeItem(STORAGE_TARA);

}

});

//====================================================
// Guardar Pesaje
//====================================================

guardar.addEventListener("click",guardarPesaje);

function guardarPesaje(){

    const pesoNeto = Number(neto.value);

    const pesoTara = Number(tara.value);

    if(neto.value.trim()===""){

    alert("Ingrese el Peso Neto.");

    neto.focus();

    return;

}

    if(tara.value.trim()===""){

    alert("Ingrese la Tara.");

    tara.focus();

    return;

}

    const registro={

        numero:pesajes.length+1,

        envase:envase.value.trim(),

        neto:pesoNeto,

        tara:pesoTara,

        producto:Math.max(0,pesoNeto-pesoTara)

    };

    pesajes.push(registro);

    guardarLocal();

    actualizarLista();

    limpiarFormulario();

}

//====================================================
// LocalStorage
//====================================================

function guardarLocal(){

	localStorage.setItem("envase", envase.value.trim());
    
	localStorage.setItem(

        STORAGE_PESAJES,

        JSON.stringify(pesajes)

    );

}

//====================================================
// Limpiar formulario
//====================================================

function limpiarFormulario(){

    numero.value = pesajes.length + 1;

    neto.value = "";

    if(!taraFija){

        tara.value = "";

    }

    calcularProducto();

    neto.focus();


}

//====================================================
// Totales
//====================================================

function actualizarTotales(){

    let netoTotal=0;

    let taraTotal=0;

    let productoTotal=0;

    pesajes.forEach(item=>{

        netoTotal+=item.neto;

        taraTotal+=item.tara;

        productoTotal+=item.producto;

    });

    totalNeto.textContent=netoTotal.toFixed(0)+" g";

    totalTara.textContent=taraTotal.toFixed(0)+" g";

    totalProducto.textContent=productoTotal.toFixed(0)+" g";

}

//====================================================
// Eliminar Pesaje
//====================================================

function eliminar(indice){

    if(!confirm("¿Eliminar este pesaje?")){

        return;

    }

    pesajes.splice(indice,1);

    pesajes.forEach((item,i)=>{

        item.numero=i+1;

    });


guardarLocal();

actualizarLista();

numero.value = pesajes.length + 1;

}

//====================================================
// Mostrar lista de pesajes
//====================================================

function actualizarLista(){

    lista.innerHTML = "";

    pesajes.forEach((item,index)=>{

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `

            <h3>Pesaje Nº ${item.numero}</h3>

            <div class="fila">
                <span>Envase</span>
                <strong>${item.envase || "-"}</strong>
            </div>

            <div class="fila">
                <span>Peso Neto</span>
                <strong>${item.neto.toFixed(0)} g</strong>
            </div>

            <div class="fila">
                <span>Tara</span>
                <strong>${item.tara.toFixed(0)} g</strong>
            </div>

            <div class="fila">
                <span>Producto</span>
                <strong class="productoCard">
                    ${item.producto.toFixed(0)} g
                </strong>
            </div>

        `;

        const boton = document.createElement("button");

        boton.className = "eliminar";

        boton.textContent = "Eliminar";

        boton.addEventListener("click",()=>{

            eliminar(index);

        });

        tarjeta.appendChild(boton);

        lista.appendChild(tarjeta);

    });

    actualizarTotales();

}

