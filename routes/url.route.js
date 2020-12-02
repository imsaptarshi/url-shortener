const router = require("express").Router();
const db = require("../server");
const getHostName = require("../utils/getHostName")

router.route("/add").post((req, res) => {
    const actual_url = req.body.actual_url;
    console.log(actual_url)
    const query_count = `SELECT COUNT(actual_url) FROM urls WHERE actual_url='${actual_url}';`;
    db.raw(query_count)
        .then((resp) => {
            if (Number(resp.rows[0].count) == 0) {
                const shortened_url = {
                    base: "http://localhost:3000",
                    url: "/"
                };




                const query_add = `INSERT INTO urls (shortened_url,actual_url) VALUES ('${shortened_url.url}','${actual_url}');`;
                db.raw(query_add)
                    .then((respo) => {
                        res.send({
                            shortened_url: shortened_url,
                            actual_url: actual_url,
                            successfull: true,
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
                res.send({
                    message: "actual_url already exists",
                    isExisting: true
                });
            }
        })
        .catch((e) => {
            console.log("Something went wrong l:43", e);
        })
})

module.exports = router;