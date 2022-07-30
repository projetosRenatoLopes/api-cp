const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


if (process.env.NODE_ENV !== 'production') {
    require('dotenv/config');
}

app.use(morgan('dev'));

// PERMISSOES DE ENTRADA NA API
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header(
    //     'Access-Control-Allow-Headers: *, */*, Content-Type, application/json, text/html, charset=utf-8'
    //     // 'Access-Control-Allow-Header',
    //     //'Origin, X-Requested-With, Content-Type, application/json, Accept, Authorization'
    // );
    // res.header("Access-Control-Allow-Headers: Content-Type");;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});


// rotas
const routeSimpleMeasure = require('./routes/simpleMeasure');
const routeExactMeasure = require('./routes/exactMeasure');
const routeFeedstock = require('./routes/feedstock');
const routeUsers =  require('./routes/users');
const routeProduction = require('./routes/production');
const routeFeedstockUsed = require('./routes/feedstockUsed');

app.use('/simplemeasure', routeSimpleMeasure);
app.use('/exactmeasure', routeExactMeasure);
app.use('/feedstock', routeFeedstock);
app.use('/users', routeUsers);
app.use('/production', routeProduction);
app.use('/feedstockused', routeFeedstockUsed);

app.use('/api', (req, res, next) => {
    res.status(200).send('API Custo de Produção');
});

app.use((req, res, next) => {
    const erro = new Error('Enedreço não encontrado');
    // @ts-ignore
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
})

module.exports = app; 