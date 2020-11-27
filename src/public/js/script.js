(function() {
    var total_de_radiobases = 0;
    var vector_de_radiobases = [];

    var total_de_filas_descargadas = 1000
    var intervalo = 1000

    var filas_tabla_completa = document.getElementById('filas_tabla_completa')

    async function contar_radiobases() {
        axios
            .get("/api/total_de_registros")
            .then((response) => {
                total_de_radiobases = response.data.content;
            })
            .catch((error) => {})
            .finally(function() {})
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
                .catch((error) => {})
                .finally(function() {
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
    window.onscroll = function() {
        // console.log('window.scrollY', window.scrollY)
        // console.log('window.innerHeight', window.innerHeight)
        // console.log('filas_tabla_completa.scrollHeight', filas_tabla_completa.scrollHeight)
        var y = window.scrollY;
        if (y + window.innerHeight > filas_tabla_completa.scrollHeight) {
            if (bandera_de_peticion_radiobases) {
                solicitar_informacion_parcial(false)
            }
        }
    };


})();