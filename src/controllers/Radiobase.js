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
};
module.exports = Radiobase;