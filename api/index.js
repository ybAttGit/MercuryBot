var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
router.get('/products/:scenario_id', function (req, res) {
    console.log('Received request for products for scenario ' + req.params.scenario_id);
    switch(req.params.scenario_id.toLowerCase()) {
        case 'tom':
            res.json(tomProducts);
            break;
        default:
            res.json(benProducts);
            break;
    }
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Mercury Bot Data API is alive and runs on port ' + port);

const benProducts = {'messages': [{'text': 'Apple Watch'}, {'text': 'Osprey'}]}
const tomProducts = {'messages': [{'text': 'Galaxy s10+'}, {'text': 'IPhone XS Max'}]}
