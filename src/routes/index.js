const express = require("express");
const router = express.Router();

// Controllers
const Home = require("../controllers/Home");
home = new Home();
const Radiobase = require("../controllers/Radiobase");
radiobase = new Radiobase();

module.exports = function(app) {
    router.get("/", home.index);

    //Api
    router.get('/api/total_de_registros', radiobase.total_de_registros)
    router.get('/api/registros/:desde/:hasta', radiobase.obtener_registros)

    router.get('/api/total_de_registros_agrupados', radiobase.total_de_registros_agrupados)
    router.get('/api/registros_agruptados/:desde/:hasta', radiobase.obtener_registros_agrupados)

    //test

    router.get("/*", (req, res) => {
        res.redirect("/");
        return;
    });

    app.use(router);
};