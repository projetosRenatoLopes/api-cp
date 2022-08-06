const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');



exports.getBackup = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const exactmeasure = await db.query("SELECT * FROM exactmeasure;")
            const feedstock = await db.query("SELECT * FROM feedstock;")
            const feedstockused = await db.query("SELECT * FROM feedstockused;");
            const production = await db.query("SELECT * FROM production;");
            const simplemeasure = await db.query("SELECT * FROM simplemeasure;");
            const users = await db.query("SELECT * FROM users;");
            const wpo = await db.query("SELECT * FROM wpo;")
            const wpoused = await db.query("SELECT * FROM wpoused;");

            var exactmeasureQuery = [];
            exactmeasure.rows.forEach(item => {
                exactmeasureQuery.push(`INSERT INTO exactmeasure(uuid,name,createby,createdate,modifyby,modifydate,ordenation)VALUES('${item.uuid}','${item.name}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}','${item.ordenation}');`)
            });
            var feedstockQuery = [];
            feedstock.rows.forEach(item => {
                feedstockQuery.push(`INSERT INTO feedstock(uuid,name,measurement,quantity,price,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.measurement}','${item.quantity}','${item.price}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
            });
            var feedstockusedQuery = [];
            feedstockused.rows.forEach(item => {
                feedstockusedQuery.push(`INSERT INTO feedstockused(uuid,feedstockid,quantity,productionid)VALUES('${item.uuid}','${item.feedstockid}','${item.quantity}','${item.productionid}');`)
            });
            var productionQuery = [];
            production.rows.forEach(item => {
                productionQuery.push(`INSERT INTO production(uuid,name,price,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.price}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
            });
            var simplemeasureQuery = [];
            simplemeasure.rows.forEach(item => {
                simplemeasureQuery.push(`INSERT INTO simplemeasure(uuid,name,typemeasure,quantity,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.typemeasure}','${item.quantity}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
            });
            var usersQuery = [];
            users.rows.forEach(item => {
                usersQuery.push(`INSERT INTO users(uuid,nickname,name,pass)VALUES('${item.uuid}','${item.nickname}','${item.name}','${item.pass}');`)
            });
            var wpoQuery = [];
            wpo.rows.forEach(item => {
                wpoQuery.push(`INSERT INTO wpo(uuid,name,quantity,price,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.quantity}','${item.price}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
            });
            var wpousedQuery = [];
            wpoused.rows.forEach(item => {
                wpousedQuery.push(`INSERT INTO wpoused(uuid,wpoid,quantity,productionid)VALUES('${item.uuid}','${item.wpoid}','${item.quantity}','${item.productionid}');`)
            });
            const response = [
                {
                    date: Date.now(),
                    querys: [
                        exactmeasureQuery,
                        feedstockQuery,
                        feedstockusedQuery,
                        productionQuery,
                        simplemeasureQuery,
                        usersQuery,
                        wpoQuery,
                        wpousedQuery
                    ]
                }
            ]
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}
