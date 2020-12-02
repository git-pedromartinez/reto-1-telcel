const radiobaseSchema = require('../models/radiobase')

class Radiobase {
    async total_de_registros(req, res) {
        var radiobases = await radiobaseSchema.count()
        res.json({ type: 'full', content: radiobases })
        return
    };
    async obtener_registros(req, res) {
        var { desde, hasta } = req.params
        var radiobases = await radiobaseSchema.find().skip(parseInt(desde)).limit(parseInt(hasta))
        res.json({ type: 'full', content: radiobases })
        return
    }

    async total_de_registros_agrupados(req, res) {
        var radiobases = await radiobaseSchema.aggregate([
            {
                $group: {
                    _id: '$RADIOBASE',
                }
            },
            {
                $count: "num_total"
            }
        ])
        res.json({ type: 'full', content: radiobases[0].num_total })
        return
    };
    async obtener_registros_agrupados(req, res) {
        var { desde, hasta } = req.params

        //obteniendo numero total de fechas
        var fechas = await radiobaseSchema.aggregate([{
            $group: {
                _id: '$FECHA'
            }
        }]).sort({ _id: 1 })

        //obteniendo agrupaciones por radiobase
        var radiobases = await radiobaseSchema.aggregate([{
            $group: {
                _id: '$RADIOBASE',
                count: { $sum: 1 },
                fechas: {
                    $push: '$FECHA'
                },
                trafico: {
                    $push: '$TRAFICO'
                }
            }
        }]).skip(parseInt(desde)).limit(parseInt(hasta))
        var new_vector_fechas=[]
        for (let index = 0; index < fechas.length; index++) {
            const element = fechas[index];
            new_vector_fechas.push(new Date(element._id).getTime())
        }
        var new_vector=[]


        var vec_aux=[]
        for (let index = 0; index < new_vector_fechas.length; index++) {
            vec_aux[index]=null
        }

        for (let index = 0; index < radiobases.length; index++) {
            const element = radiobases[index];
            var obj={
                radiobase:element._id,
                vec_trafico:vec_aux
            }

            for (let index = 0; index < element.fechas.length; index++) {
                const fecha = element.fechas[index];
                var i=new_vector_fechas.indexOf(new Date(fecha).getTime())
                
                if(i>=0){
                    obj.vec_trafico[i]=element.trafico[index]
                }
            }
            new_vector.push(obj)
        }
        res.json({ fechas:new_vector_fechas, content:new_vector })
        return
    }
};
module.exports = Radiobase;