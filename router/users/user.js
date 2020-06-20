var express = require('express');
var admin = require('./admin');
var customer = require('./customer');
var employee = require('./employee');
var password = require('./password');
var router = express.Router();
const userMiddleware = require('../../middleware/userValidate');
const admins = require('../../model/admin');
const employees = require('../../model/employee');
const customers = require('../../model/customers/customer');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(200).send('good morning');
});

router.get('/login', async function(req, res) {
    let username = req.body["username"];
    let password = reqbody["password"];

    if (username == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "username param is missing"
        });
        return;
    }
    if (password == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "username param is missing"
        });
        return;
    }

    let result = customers.login(username, password);
    if (!(result instanceof Error)) {
        res.status(200).send({
            "Status": true,
            "Message" : "Login successfully",
            "Type": 1,
            "Token": result.token,
            "Customer": result.customer,
        });
        return;
    }

    result = admins.login(username, password);
    if (!(result instanceof Error)) {
        res.status(200).send({
            "Status": true,
            "Message" : "Login successfully",
            "Type": 6,
            "Token": result.token,
            "Admin": result.admin,
        });
        return;
    }

    result = employees.login(username, password);
    if (!(result instanceof Error)) {
        res.status(200).send({
            "Status": true,
            "Message" : "Login successfully",
            "Type": 9,
            "Token": result.token,
            "Employee": result.employee,
        });
        return;
    }

    res.status(200).send({
        "Status": false,
        "Message" : "Login failed"
    });
});

router.post('/notify', [userMiddleware], function(req, res) {
    res.status(200).send({
        "Status": true,
        "Message": "",
    });
});

router.use('/admin', admin);
router.use('/customer', customer);
router.use('/employee', employee);
router.use('/password', password);

module.exports = router;
