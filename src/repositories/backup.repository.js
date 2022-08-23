const { application } = require('express');
const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');



exports.getBackup = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const exactmeasure = await db.query("SELECT * FROM exactmeasure ORDER BY name;")
            const feedstock = await db.query("SELECT * FROM feedstock ORDER BY name;")
            const feedstockused = await db.query("SELECT U.uuid, U.feedstockid, F.name AS feedstock, S.name AS measurement,  U.quantity, U.productionid, P.name as production FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) LEFT JOIN production P ON CAST(U.productionid AS VARCHAR)=CAST(P.uuid AS VARCHAR) ORDER BY P.name, F.name ASC");
            const production = await db.query("SELECT * FROM production ORDER BY name;");
            const simplemeasure = await db.query("SELECT * FROM simplemeasure ORDER BY name;");
            const users = await db.query("SELECT * FROM users ORDER BY name;");
            const wpo = await db.query("SELECT * FROM wpo ORDER BY name;")
            const category = await db.query("SELECT * FROM category;");
            const wpoused = await db.query("SELECT U.uuid, U.wpoid, F.name AS wpo, U.quantity, U.productionid, P.name as production FROM wpoused U LEFT JOIN wpo F ON CAST(U.wpoid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN production P ON CAST(U.productionid AS VARCHAR)=CAST(P.uuid AS VARCHAR) ORDER BY P.name, F.name ASC");

            const response =
            {
                date: Date.now(),
                rows: { exactmeasure: exactmeasure.rows, feedstock: feedstock.rows, feedstockused: feedstockused.rows, production: production.rows, category: category.rows, simplemeasure: simplemeasure.rows, users: users.rows, wpo: wpo.rows, wpoused: wpoused.rows }
            }

            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postBackup = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const dataReq = req.body;

            setTimeout(async () => {



                if (dataReq.table === 'exactmeasure') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM exactmeasure WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO exactmeasure(uuid,name,createby,createdate,modifyby,modifydate,ordenation)VALUES('${item.uuid}','${item.name}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}','${item.ordenation}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'feedstock') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM feedstock WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO feedstock(uuid,name,measurement,quantity,price,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.measurement}','${item.quantity}','${item.price}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'feedstockused') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM feedstockused WHERE uuid='${item.uuid}' OR feedstockid='${item.feedstockid}' AND productionid='${item.productionid}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO feedstockused(uuid,feedstockid,quantity,productionid)VALUES('${item.uuid}','${item.feedstockid}','${item.quantity}','${item.productionid}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }

                } else if (dataReq.table === 'production') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM production WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO production(uuid,name,price,categoryid,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.price}','${item.categoryid}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'simplemeasure') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM simplemeasure WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO simplemeasure(uuid,name,typemeasure,quantity,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.typemeasure}','${item.quantity}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'users') {
                    var item = dataReq.reg
                    const verify = await db.query(`SELECT * FROM users WHERE uuid='${item.uuid}' OR nickname='${item.nickname}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO users(uuid,nickname,name,pass)VALUES('${item.uuid}','${item.nickname}','${item.name}','${item.pass}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'wpo') {
                    var item = dataReq.reg
                    const verify = await db.query(`SELECT * FROM wpo WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO wpo(uuid,name,quantity,price,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.quantity}','${item.price}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'wpoused') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM wpoused WHERE uuid='${item.uuid}' OR wpoid='${item.wpoid}' AND productionid='${item.productionid}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO wpoused(uuid,wpoid,quantity,productionid)VALUES('${item.uuid}','${item.wpoid}','${item.quantity}','${item.productionid}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else if (dataReq.table === 'category') {
                    var item = dataReq.reg

                    const verify = await db.query(`SELECT * FROM category WHERE uuid='${item.uuid}' OR name='${item.name}'`)
                    if (verify.rowCount === 0) {
                        await db.query(`INSERT INTO category(uuid,name,,createby,createdate,modifyby,modifydate)VALUES('${item.uuid}','${item.name}','${item.createby}','${item.createdate}','${item.modifyby}','${item.modifydate}');`)
                        return res.status(201).send({ "uuid": item.uuid, "status": "Cadastrado", "code": "0" });
                    } else {
                        return res.status(200).send({ "uuid": item.uuid, "status": "Item já cadastrado", "code": "1" });
                    }
                } else { return res.status(204).send('ERRO') }

            }, 3000);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

