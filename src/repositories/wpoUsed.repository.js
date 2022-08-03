
const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');

exports.getWPOUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const wpoUsed = await db.query("SELECT U.uuid, U.wpoid, F.name AS wpo, U.quantity, U.productionid FROM wpoused U LEFT JOIN wpo F ON CAST(U.wpoid AS VARCHAR)=CAST(F.uuid AS VARCHAR) ORDER BY wpo");
            const wpo = await db.query("SELECT F.uuid, F.name, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM wpo F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;")
            var result = [];
            wpoUsed.rows.forEach(fsu => {
                var newPrice = 0;
                wpo.rows.forEach(fs => {
                    if (fsu.wpoid === fs.uuid) {
                        newPrice = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                const price = newPrice.toFixed(2)
                result.push({ "uuid": fsu.uuid, "wpoid": fsu.wpoid, "wpo": fsu.wpo, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })
            const response = {
                length: wpoUsed.rows.length,
                wpoUsed: result
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postWPOUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await db.query("SELECT * FROM wpoused WHERE wpoid='" + [req.body.wpoid] + "' AND productionid='" + [req.body.productionid] + "';");
            if (result.rowCount > 0) {                
                return res.status(200).send({ "status": 200, "message": "WPO já utilizado" });
            } else {
                await db.query("INSERT INTO wpoused (wpoid, quantity, productionid) VALUES ('" + [req.body.wpoid] + "','" + [req.body.quantity] + "','" + [req.body.productionid] + "');");
                db.query("UPDATE production SET modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.productionid] + "';")
                return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.updateWPOUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await db.query("SELECT wpoid FROM wpoused WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
            } else {
                await db.query("UPDATE wpoused SET quantity='" + [req.body.quantity] + "' WHERE uuid='" + [req.body.uuid] + "';")
                console.log(req.body.productionid)
                db.query("UPDATE production SET modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.productionid] + "' AS VARCHAR);")
                return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.deleteWPOUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await db.query("SELECT wpoid FROM wpoused WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
            } else {
                await db.query("DELETE FROM wpoused WHERE uuid='" + [req.body.uuid] + "';")
                return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}
