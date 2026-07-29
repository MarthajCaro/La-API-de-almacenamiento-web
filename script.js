let gastos = [];

const descripcion = document.getElementById("descripcion");
const monto = document.getElementById("monto");
const categoria = document.getElementById("categoria");
const btnAgregar = document.getElementById("btnAgregar");

const totalHoy = document.getElementById("totalHoy");
const totalMes = document.getElementById("totalMes");
const listaGastos = document.getElementById("listaGastos");
const porCategoria = document.getElementById("porCategoria");

btnAgregar.addEventListener("click", agregarGasto);


function agregarGasto() {

    let desc = descripcion.value;
    let mon = parseFloat(monto.value);
    let cat = categoria.value;

    if (desc === "" || isNaN(mon) || mon <= 0) {
        alert("Datos inválidos");
        return;
    }

    let gasto = {
        descripcion: desc,
        monto: mon,
        categoria: cat,
        fecha: new Date().toISOString()
    };

    gastos.push(gasto);

    
    localStorage.setItem("gastosPersonales", JSON.stringify(gastos));

    
    descripcion.value = "";
    monto.value = "";

    actualizarTodo();
}


let datosGuardados = localStorage.getItem("gastosPersonales");

if (datosGuardados) {
    gastos = JSON.parse(datosGuardados);
}


function esHoy(gasto) {
    let hoy = new Date();
    let fechaGasto = new Date(gasto.fecha);

    return (
        hoy.getDate() === fechaGasto.getDate() &&
        hoy.getMonth() === fechaGasto.getMonth() &&
        hoy.getFullYear() === fechaGasto.getFullYear()
    );
}

function esEsteMes(gasto) {
    let hoy = new Date();
    let fechaGasto = new Date(gasto.fecha);

    return (
        hoy.getMonth() === fechaGasto.getMonth() &&
        hoy.getFullYear() === fechaGasto.getFullYear()
    );
}

function sumarGastos(lista) {
    return lista.reduce((acc, gasto) => acc + gasto.monto, 0);
}

function actualizarTodo() {

    let hoy = gastos.filter(esHoy);
    let mes = gastos.filter(esEsteMes);

    totalHoy.textContent = sumarGastos(hoy).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
    });

    totalMes.textContent = sumarGastos(mes).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
    });

    mostrarLista();
    mostrarPorCategoria();
}


function mostrarLista() {
    listaGastos.innerHTML = "";

    gastos.forEach((gasto, index) => {
        let li = document.createElement("li");

        li.textContent = `${gasto.descripcion} - ${gasto.monto.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
        })} | ${new Date(gasto.fecha).toLocaleString("es-CO")}`;

        let btn = document.createElement("button");
        btn.textContent = "Eliminar";

        btn.onclick = () => {
            gastos.splice(index, 1);
            localStorage.setItem("gastosPersonales", JSON.stringify(gastos));
            actualizarTodo();
        };

        li.appendChild(btn);
        listaGastos.appendChild(li);
    });
}


function mostrarPorCategoria() {

    porCategoria.innerHTML = "";

    let resumen = {};

    gastos.forEach(gasto => {
        if (!resumen[gasto.categoria]) {
            resumen[gasto.categoria] = 0;
        }
        resumen[gasto.categoria] += gasto.monto;
    });

    for (let cat in resumen) {
        let p = document.createElement("p");

        p.textContent = `${cat}: ${resumen[cat].toLocaleString("es-CO", {
            style: "currency",
            currency: "COP"
        })}`;

        porCategoria.appendChild(p);
    }
}


actualizarTodo();