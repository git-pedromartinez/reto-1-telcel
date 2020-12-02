(function () {
    var total_de_radiobases = 0;
    var vector_de_radiobases = [];

    var total_de_filas_descargadas = 1000
    var intervalo = 1000

    var filas_tabla_completa = document.getElementById('filas_tabla_completa')
    var filas_tabla_agrupada = document.getElementById('filas_tabla_agrupada')

    async function contar_radiobases() {
        axios
            .get("/api/total_de_registros")
            .then((response) => {
                total_de_radiobases = response.data.content;
            })
            .catch((error) => { })
            .finally(function () { })
    }

    async function crear_nueva_fila(numFila, RADIOBASE, FECHA_Completa, REGION, TRAFICO) {
        var tr = document.createElement('tr')
        tr.className += ` fila_tabla_completa`
        tr.className += ` ${RADIOBASE}`
        tr.className += ` ${REGION}`
        var th = document.createElement('th')
        th.scope = 'row'
        th.textContent = numFila
        tr.appendChild(th)

        var td = document.createElement('td')
        td.textContent = RADIOBASE
        tr.appendChild(td)
        var td = document.createElement('td')
        var FECHA = new Date(FECHA_Completa)
        td.textContent = FECHA.getDate() + '/' + (FECHA.getMonth() + 1) + '/' + FECHA.getFullYear()
        tr.appendChild(td)
        var td = document.createElement('td')
        td.textContent = REGION
        tr.appendChild(td)
        var td = document.createElement('td')
        td.textContent = TRAFICO
        if (TRAFICO <= 15) {
            td.className += " trafico_rojo";
        }
        if (TRAFICO > 15 && TRAFICO <= 40) {
            td.className += " trafico_naranja";

        }
        if (TRAFICO > 40 && TRAFICO <= 90) {
            td.className += " trafico_amarillo";

        }
        if (TRAFICO >= 90) {
            td.className += " trafico_verde";

        }
        tr.appendChild(td)

        filas_tabla_completa.appendChild(tr)

    }

    async function solicitar_informacion_parcial(bandera) {
        bandera_de_peticion_radiobases = bandera

        function nueva_solicitud(desde, hasta) {
            var radiobases_current = []
            axios
                .get(`/api/registros/${desde}/${hasta}`)
                .then((response) => {
                    radiobases_current = response.data.content
                    vector_de_radiobases = vector_de_radiobases.concat(radiobases_current);
                })
                .catch((error) => { })
                .finally(function () {
                    for (let index = 0; index < radiobases_current.length; index++) {
                        const element = radiobases_current[index];
                        crear_nueva_fila(filas_tabla_completa.rows.length + 1 + index, element.RADIOBASE, element.FECHA, element.REGION, element.TRAFICO)
                    }
                    total_de_filas_descargadas = total_de_filas_descargadas + intervalo
                    bandera_de_peticion_radiobases = true
                })
        }

        var i = total_de_filas_descargadas

        nueva_solicitud(i, intervalo)
    }

    function init() {
        contar_radiobases()
        // solicitar_informacion_parcial()
    }

    window.onload = init;

    var bandera_de_peticion_radiobases = true
    window.onscroll = function () {
        var y = window.scrollY;
        if (y + window.innerHeight > filas_tabla_completa.scrollHeight) {
            if (bandera_de_peticion_radiobases) {
                solicitar_informacion_parcial(false)
            }
        }
    };

    //filtos

    function eliminar_de_vector(vector, elemento) {
        var indice = vector.indexOf(elemento); // obtenemos el indice
        vector.splice(indice, 1); // 1 es la cantidad de elemento a eliminar
    }

    function quitar_filtro(elemento) {
        elemento.removeClass('ocultar_fila')
        elemento.removeClass('mostar_fila')
    }

    async function aplicar_filtro(fila) {


        var fila_actual = fila
        for (let index = 0; index < vec_filtros_radiobase.length; index++) {
            const element = vec_filtros_radiobase[index];
            if (fila_actual.hasClass(element)) {
                quitar_filtro(fila_actual)
                fila_actual.addClass('mostar_fila')
                return
            }
        }
        for (let index = 0; index < vec_filtros_region.length; index++) {
            const element = vec_filtros_region[index];
            if (fila_actual.hasClass(element)) {
                quitar_filtro(fila_actual)
                fila_actual.addClass('mostar_fila')
                return
            }
        }
        fila_actual.addClass('ocultar_fila')

    }

    function refrescar_filtro_radiobase() {
        $("#filas_tabla_completa tr").each(function () {
            var fila = $(this)
            quitar_filtro(fila)
            aplicar_filtro(fila)
        });
    }

    function refrescar_filtro_radiobase_2() {
        $("#filas_tabla_completa tr").each(function () {
            var fila = $(this)
            quitar_filtro(fila)
            fila.addClass('mostar_fila')
        });
    }

    var tags_filtros_radiobase = document.getElementById('tags_filtros_radiobase')
    var boton_filtro_radiobase = document.getElementById('boton_filtro_radiobase')
    var input_radiobase = document.getElementById('input_radiobase')
    var vec_filtros_radiobase = []

    var tags_filtros_region = document.getElementById('tags_filtros_region')
    var boton_filtro_region = document.getElementById('boton_filtro_region')
    var input_region = document.getElementById('input_region')
    var vec_filtros_region = []

    boton_filtro_radiobase.addEventListener('click', async function () {
        var radiobase = input_radiobase.value
        vec_filtros_radiobase.push(radiobase)
        var span = document.createElement('span')
        span.addEventListener('click', function () {
            tags_filtros_radiobase.removeChild(span)
            eliminar_de_vector(vec_filtros_radiobase, radiobase)
            if (vec_filtros_radiobase.length === 0 && vec_filtros_region.length === 0) {
                refrescar_filtro_radiobase_2()
            } else {
                refrescar_filtro_radiobase()
            }
        })
        span.className += ` badge`
        span.className += ` badge-warning`
        span.textContent = radiobase + ' - '
        await tags_filtros_radiobase.appendChild(span)
        input_radiobase.value = ''
        refrescar_filtro_radiobase()
    })

    boton_filtro_region.addEventListener('click', async function () {
        var region = input_region.value
        vec_filtros_region.push(region)
        var span = document.createElement('span')
        span.addEventListener('click', function () {
            tags_filtros_region.removeChild(span)
            eliminar_de_vector(vec_filtros_region, region)
            if (vec_filtros_radiobase.length === 0 && vec_filtros_region.length === 0) {
                refrescar_filtro_radiobase_2()
            } else {
                refrescar_filtro_radiobase()
            }
        })
        span.className += ` badge`
        span.className += ` badge-success`
        span.textContent = region + ' - '
        await tags_filtros_region.appendChild(span)
        input_region.value = ''

        refrescar_filtro_radiobase()

    })

    var bandera = true


    //datos agrupados
    var total_de_radiobases_agrupados = 0

    var num_tot_rad_agru = document.getElementById('num_tot_rad_agru')

    function generarDatosAgrupados() {
        async function contar_radiobases_agrupados() {
            axios
                .get("/api/total_de_registros_agrupados")
                .then((response) => {
                    total_de_radiobases_agrupados = response.data.content;

                })
                .catch((error) => { })
                .finally(function () {
                    num_tot_rad_agru.textContent = total_de_radiobases_agrupados

                })
        }
        contar_radiobases_agrupados()
    }
    generarDatosAgrupados()


    //generar nueva consulta
    //filas_tabla_agrupada
    function generarNewRows(vec_radiobase) {
        for (const radiobase of vec_radiobase) {
            var tr = document.createElement('tr')
            tr.className += ` fila_tabla_agrupada`
            tr.className += ` ${radiobase.radiobase} trafico_2`
            var th = document.createElement('th')
            th.scope = 'row'
            th.textContent = radiobase.radiobase
            tr.appendChild(th)

            for (const TRAFICO of radiobase.vec_trafico) {
                var td = document.createElement('td')
                td.textContent = TRAFICO
                if (TRAFICO === null) {
                    td.className += " ";
                    td.textContent = ''

                }
                if (TRAFICO <= 15) {
                    td.className += " trafico_rojo_2";
                }
                if (TRAFICO > 15 && TRAFICO <= 40) {
                    td.className += " trafico_naranja_2";

                }
                if (TRAFICO > 40 && TRAFICO <= 90) {
                    td.className += " trafico_amarillo_2";

                }
                if (TRAFICO >= 90) {
                    td.className += " trafico_verde_2";

                }
                tr.appendChild(td)
            }



            filas_tabla_agrupada.appendChild(tr)
        }

    }

    var btnNewQuery = document.getElementById('btnNewQuery')
    var objRangoRows = {
        desde: 0,
        hasta: 100,
    }
    btnNewQuery.addEventListener('click', function () {

        axios
            .get(`/api/registros_agruptados/${objRangoRows.desde}/${objRangoRows.hasta}`)
            .then((response) => {
                vec_radiobase = response.data.content
            })
            .catch((error) => { })
            .finally(function () {
                objRangoRows.desde += objRangoRows.hasta
                generarNewRows(vec_radiobase)
            })
    })


})();
var tabla_completa_main = document.getElementById('tabla_completa_main')
var tabla_agrupada_main = document.getElementById('tabla_agrupada_main')

function mostarar_tablaCompleta() {
    tabla_completa_main.style.display = 'block'
    tabla_agrupada_main.style.display = 'none'
}

function mostarar_tablaAgrupada() {

    tabla_completa_main.style.display = 'none'
    tabla_agrupada_main.style.display = 'block'
}