
const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');

exports.getProduction = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const productionsRes = await db.query("SELECT P.uuid, P.name, P.price, U.name AS createby, P.createdate, R.name AS modifyby, P.modifydate FROM production P LEFT JOIN users U ON P.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON P.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY P.name;");

            const feedstockUsed = await db.query("SELECT U.uuid, U.feedstockid, F.name AS feedstock, F.measurement AS measurementid, S.name AS measurement,  U.quantity, U.productionid FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;");
            const feedstock = await db.query("SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;")
            var feedstockUsedRes = [];
            feedstockUsed.rows.forEach(fsu => {
                var price;
                feedstock.rows.forEach(fs => {
                    if (fsu.feedstockid === fs.uuid) {
                        price = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                feedstockUsedRes.push({ "uuid": fsu.uuid, "feedstockid": fsu.feedstockid, "feedstock": fsu.feedstock, "measurementid": fsu.measurementid, "measurement": fsu.measurement, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })

            var productions = [];
            productionsRes.rows.forEach(prod => {
                var feedstockUsed = [];
                var cost = 0;
                feedstockUsedRes.forEach(fdUs => {
                    if (fdUs.productionid === prod.uuid) {
                        cost += fdUs.price
                        feedstockUsed.push(fdUs)
                    }
                })
                productions.push({ "uuid": prod.uuid, "name": prod.name, "price": prod.price, "cost": cost, "feedstockused": feedstockUsed, "createby": prod.createby, "createdate": prod.createdate, "modifyby": prod.modifyby, "modifydate": prod.modifydate })
            })

            const response = {
                length: productions.length,
                productions: productions
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postProduction = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await db.query("INSERT INTO production (name, price, createby, createdate, modifyby, modifydate) VALUES ('" + [req.body.name] + "','" + [req.body.price] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "');");
            return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });
        }

    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }

}

exports.updateProduction = async (req, res, next) => {
    try {        
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await db.query("SELECT name FROM production WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
            } else {
                const result = await db.query("UPDATE production SET name='" + [req.body.name] + "', price='" + [req.body.price] + "', modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.uuid] + "';")
                return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.deleteProduction = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await db.query("SELECT name FROM production WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
            } else {
                await db.query("DELETE FROM production WHERE uuid='" + [req.body.uuid] + "';")
                await db.query("DELETE FROM feedstockused WHERE productionid='" + [req.body.uuid] + "';")
                return res.status(200).send({ "status": 200, "message": "Dados excluidos com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}