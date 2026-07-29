// =============================
// CONTROL DE PESAJES v1.0
// =============================

let pesajes = JSON.parse(localStorage.getItem("pesajes")) || [];

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



// ----------------------------
// Fecha
// ----------------------------

const hoy = new Date();

fecha.innerHTML = hoy.toLocaleDateString("es-UY");



// ----------------------------
// Número automático
// ----------------------------

function siguienteNumero(){

    numero.value = pesajes.length + 1;

}

siguienteNumero();



// ----------------------------
// Calcular producto
// ----------------------------

function calcular(){

    let n = parseFloat(neto.value) || 0;

    let t = parseFloat(tara.value) || 0;

    let p = n - t;

    producto.innerHTML = p.toFixed(0) + " g";

}

neto.addEventListener("input", calcular);

tara.addEventListener("input", calcular);



// ----------------------------
// Guardar
// ----------------------------

guardar.addEventListener("click", ()=>{

    let n = parseFloat(neto.value) || 0;

    let t = parseFloat(tara.value) || 0;

    let p = n - t;

    let registro = {

        numero: pesajes.length + 1,

        envase: envase.value,

        neto: n,

        tara: t,

        producto: p

    };

    pesajes.push(registro);

    guardarLocal();

    actualizarLista();

    limpiar();

});



// ----------------------------
// LocalStorage
// ----------------------------

function guardarLocal(){

    localStorage.setItem(

        "pesajes",

        JSON.stringify(pesajes)

    );

}



// ----------------------------
// Limpiar formulario
// ----------------------------

function limpiar(){

    numero.value = pesajes.length + 1;

    neto.value = "";

    producto.innerHTML = "0 g";

    neto.focus();

}



// ----------------------------
// Totales
// ----------------------------

function actualizarTotales(){

    let netoTotal = 0;

    let taraTotal = 0;

    let productoTotal = 0;

    pesajes.forEach(item=>{

        netoTotal += item.neto;

        taraTotal += item.tara;

        productoTotal += item.producto;

    });

    totalNeto.innerHTML = netoTotal.toFixed(0)+" g";

    totalTara.innerHTML = taraTotal.toFixed(0)+" g";

    totalProducto.innerHTML = productoTotal.toFixed(0)+" g";

}



// ----------------------------
// Eliminar
// ----------------------------

function eliminar(numero){

    if(!confirm("¿Eliminar este pesaje?"))

        return;

    pesajes.splice(numero,1);

    pesajes.forEach((p,i)=>{

        p.numero=i+1;

    });

    guardarLocal();

    actualizarLista();

}



// ----------------------------
// Mostrar lista
// ----------------------------

function actualizarLista(){

    lista.innerHTML="";

    pesajes.forEach((item,index)=>{

        lista.innerHTML += `

        <div class="tarjeta">

            <h3>

                Pesaje Nº ${item.numero}

            </h3>

            <div class="fila">

                <span>Envase</span>

                <strong>${item.envase}</strong>

            </div>

            <div class="fila">

                <span>Peso Neto</span>

                <strong>${item.neto} g</strong>

            </div>

            <div class="fila">

                <span>Tara</span>

                <strong>${item.tara} g</strong>

            </div>

            <div class="fila">

                <span>Producto</span>

                <strong class="productoCard">

                    ${item.producto} g

                </strong>

            </div>

            <button

                class="eliminar"

                onclick="eliminar(${index})">

                Eliminar

            </button>

        </div>

        `;

    });

    actualizarTotales();

}



// ----------------------------
// Inicio
// ----------------------------

actualizarLista();