const router = require("express").Router();
const db = require("../server");
const getHostName = require("../utils/getHostName")

//POST METHOD
router.route("/add").post((req, res) => {
    const actual_url = req.body.actual_url;
    const query_count = `SELECT COUNT(actual_url) FROM urls WHERE actual_url='${actual_url}';`;
    db.raw(query_count)
        .then((resp) => {
            if (Number(resp.rows[0].count) == 0) {
                const shortened_url = {
                    base: "http://localhost:3000",
                    url: "/"
                };

                shortened_url.url += (getHostName(actual_url) + String('_' + Math.random().toString(36).substr(2, 9))).replace(".", "").replace("com", "");

                const query_add = `INSERT INTO urls (shortened_url,actual_url) VALUES ('${shortened_url.url}','${actual_url}');`;
                db.raw(query_add)
                    .then((respo) => {
                        res.send({
                            shortened_url: shortened_url.url,
                            actual_url: actual_url,
                            successfull: true,
                            isExisting: false,
                            response: respo
                        });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            successfull: false,
                            error: err
                        });
                    })
            }
            else {
                const query_actual_url = `SELECT * FROM urls WHERE actual_url='${actual_url}';`;
                db.raw(query_actual_url)
                    .then((response) => {
                        res.send({
                            message: "actual_url already exists",
                            id: response.rows[0].id,
                            shortened_url: response.rows[0].shortened_url,
                            actual_url: response.rows[0].actual_url,
                            isExisting: true,
                            successfull: true
                        });
                    })
                    .catch((err) => {
                        res.status(400).send({
                            successfull: false,
                            error: err
                        });
                    })
            }
        })
        .catch((e) => {
            console.log("Something went wrong l:43", e);
        })
});

//GET METHOD : WITH SHORTENED_URL AS PARAMS
router.route("/:surl").get((req, res) => {
    const shortened_url = req.params.surl;
    const query = `SELECT * FROM urls WHERE shortened_url='/${shortened_url}';`;
    db.raw(query)
        .then((resp) => {
            res.send({
                id: resp.rows[0].id,
                shortened_url: "/" + shortened_url,
                actual_url: resp.rows[0].actual_url,
                successfull: true
            });
        })
        .catch((err) => {
            res.status(400).send({
                successfull: false,
                error: err
            });
        })
});

//GET METHOD
router.route("/").get((req, res) => {
    const query = `SELECT * FROM urls;`;
    db.raw(query)
        .then((resp) => {
            res.send({
                successfull: true,
                rows: resp.rows
            });
        })
        .catch((err) => {
            res.status(400).send({
                successfull: false,
                error: err
            });
        })
})

module.exports = router;