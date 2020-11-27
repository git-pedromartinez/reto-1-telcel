const path = require('path')
const csvtojson = require('csvtojson')
var csvFilePath = path.join(__dirname, '../../docs/RadiobasesExamen2019-v2.csv')
const jsonArray = await csvtojson().fromFile(csvFilePath);

class CsvToJson {
    async CsvToJson(csvFilePath) {
        for (let index = 0; index < jsonArray.length; index++) {
            const element = jsonArray[index];
            element.FECHA = new Date(element.FECHA)
            element.REGION = parseInt(element.REGION)
            element.TRAFICO = parseFloat(element.TRAFICO)
        }
        res.json(jsonArray)
        return
    }
}
module.exports = CsvToJson;