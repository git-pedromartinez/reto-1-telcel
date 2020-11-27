(function() {
    var total_de_radiobases = 0;
    var vector_de_radiobases = [];

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

    async function crear_nueva_fila(numFila, RADIOBASE, FECHA, REGION, TRAFICO) {
        var tr = document.createElement('tr')
        var th = document.createElement('th')
        th.scope = 'row'
        th.textContent = numFila
        tr.appendChild(th)

        var td = document.createElement('td')
        td.textContent = RADIOBASE
        tr.appendChild(td)
        var td = document.createElement('td')
        td.textContent = FECHA
        tr.appendChild(td)
        var td = document.createElement('td')
        td.textContent = REGION
        tr.appendChild(td)
        var td = document.createElement('td')
        td.textContent = TRAFICO
        tr.appendChild(td)

        filas_tabla_completa.appendChild(tr)

    }

    async function solicitar_informacion_parcial() {
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
                })
        }
        var i = filas_tabla_completa.rows.length
        var intervalo = 1000
        while (i <= total_de_radiobases) {

            nueva_solicitud(i, i + intervalo)
            i = i + intervalo
        }
    }

    function init() {
        contar_radiobases()
        solicitar_informacion_parcial()
    }

    window.onload = init;
})();