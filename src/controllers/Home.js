const radiobaseSchema = require('../models/radiobase')

class Home {
    async index(req, res) {
        var desde = 0
        var hasta = 1000
        var radiobases = await radiobaseSchema.find().skip(desde).limit(hasta)
        var total_radiobases = await radiobaseSchema.count()
        res.render('index', { radiobases, total_radiobases })
        return
    };
};
module.exports = Home;