const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');



exports.getDashboard = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const productionsRes = await db.query("SELECT P.uuid, P.name, P.price, U.name AS createby, P.createdate, R.name AS modifyby, P.modifydate FROM production P LEFT JOIN users U ON P.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON P.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY P.name;");

            const feedstockUsed = await db.query("SELECT U.uuid, U.feedstockid, F.name AS feedstock, F.measurement AS measurementid, S.name AS measurement,  U.quantity, U.productionid FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;");
            const wpoUsed = await db.query("SELECT U.uuid, U.wpoid, F.name AS wpo, U.quantity, U.productionid FROM wpoused U LEFT JOIN wpo F ON CAST(U.wpoid AS VARCHAR)=CAST(F.uuid AS VARCHAR) ORDER BY F.name;");
            const wpo = await db.query("SELECT F.uuid, F.name, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM wpo F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;")
            const feedstock = await db.query("SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;")
            var feedstockUsedRes = [];

            var fdsUQtd = [];
            feedstock.rows.forEach(fs => {
                var qtdU = 0;
                feedstockUsed.rows.forEach(fsu => {
                    if (fs.uuid === fsu.feedstockid) {
                        qtdU += 1;
                    }
                })
                fdsUQtd.push({ "uuid": fs.uuid, "name": fs.name, "value": qtdU })
            });

            var wpoUQtd = [];
            wpo.rows.forEach(wpo => {
                var qtdU = 0;
                wpoUsed.rows.forEach(wpou => {
                    if (wpo.uuid === wpou.wpoid) {
                        qtdU += 1;
                    }
                })
                wpoUQtd.push({ "uuid": wpo.uuid, "name": wpo.name, "value": qtdU })
            });


            feedstockUsed.rows.forEach(fsu => {
                var price;
                feedstock.rows.forEach(fs => {
                    if (fsu.feedstockid === fs.uuid) {
                        price = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                feedstockUsedRes.push({ "uuid": fsu.uuid, "feedstockid": fsu.feedstockid, "feedstock": fsu.feedstock, "measurementid": fsu.measurementid, "measurement": fsu.measurement, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })

            var wpoUsedRes = [];
            wpoUsed.rows.forEach(fsu => {
                var price;
                wpo.rows.forEach(fs => {
                    if (fsu.wpoid === fs.uuid) {
                        price = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                wpoUsedRes.push({ "uuid": fsu.uuid, "wpoid": fsu.wpoid, "wpo": fsu.wpo, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })



            var costArr = [];
            var priceArr = [];
            var margemArr = [];
            productionsRes.rows.forEach(prod => {
                var cost = 0.0;
                feedstockUsedRes.forEach(fdUs => {
                    if (fdUs.productionid === prod.uuid) {
                        cost += fdUs.price
                    }
                })
                wpoUsedRes.forEach(wpou => {
                    if (wpou.productionid === prod.uuid) {
                        cost += wpou.price
                    }
                })
                const price = prod.price * 1
                const costs = cost
                costArr.push({ "uuid": prod.uuid, "name": prod.name, "value": costs, typevalue: "R$" })
                priceArr.push({ "uuid": prod.uuid, "name": prod.name, "value": price, typevalue: "R$" })
                const lucro = (prod.price - cost);
                const margem = (lucro * 100) / cost;
                if (margem < 100) {
                    margemArr.push({ "uuid": prod.uuid, "name": prod.name, "value": margem, typevalue: "%" })
                }
            })

            function compare(a, b) {
                if (a.value < b.value) return 1;
                if (a.value > b.value) return -1;
                return 0;
            }
            function compareAsc(a, b) {
                if (a.value > b.value) return 1;
                if (a.value < b.value) return -1;
                return 0;
            }
            function compareDesc(a, b) {
                if (a.value < b.value) return 1;
                if (a.value > b.value) return -1;
                return 0;
            }
            const price = priceArr.sort(compare)
            const cost = costArr.sort(compareDesc)
            const margem = margemArr.sort(compareAsc)
            const feedstockUsedQtd = fdsUQtd.sort(compareDesc)
            const wpoUsedQtd = wpoUQtd.sort(compareDesc)

            const response = [
                {
                    name: "Top 5 produ????es mais caras:",
                    data: price,
                    typevalue: "R$"
                },
                {
                    name: "Top 5 custos mais caros:",
                    data: cost,
                    typevalue: "R$"
                },
                {
                    name: "Produ????es com margem abaixo de 100%:",
                    data: margem,
                    typevalue: "%"
                },
                {
                    name: "Mat??rias-primas mais utilizadas:",
                    data: feedstockUsedQtd,
                    typevalue: "Quantidade"
                },
                {
                    name: "Outros custos mais utilizados:",
                    data: wpoUsedQtd,
                    typevalue: "Quantidade"
                },
            ]

            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}
