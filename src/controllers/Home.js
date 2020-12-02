const radiobaseSchema = require('../models/radiobase')

class Home {
    async index(req, res) {
        var desde = 0
        var hasta = 1000
        var radiobases = await radiobaseSchema.find().skip(desde).limit(hasta)
        var total_radiobases = await radiobaseSchema.count()

        //registros agrupados
        //obteniendo numero total de fechas
        var fechas = await radiobaseSchema.aggregate([{
            $group: {
                _id: '$FECHA'
            }
        }]).sort({ _id: 1 })

        res.render('index', {
            radiobases,
            total_radiobases,
            fechas
        })
        return
    };
};
module.exports = Home;