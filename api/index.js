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
    //Step # 1 : get products
    let productsToRender = getProductsForScenario(req.params.scenario_id.toLowerCase());
    //Step # 2 : Parse response
    let messages = buildTextMessages(tomProductsDetails);
    res.json(messages);
});

router.get('/products-images/:scenario_id', function (req, res) {
    console.log('Received request for products with images for scenario ' + req.params.scenario_id);
    //Step # 1 : get products
    let productsToRender = getProductsForScenario(req.params.scenario_id.toLowerCase());
    //Step # 2 : Parse response
    let messages = buildImageMessages(tomProductsDetails);
    res.json(messages);
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

const benProductsDetails = [{
    title: 'Apple Watch',
    imageUrl: 'https://www.att.com/catalog/en/idse/Apple/Apple%20Watch%20Series%204%20-%2040mm/Space%20Gray%20Aluminum%20-%20Black%20Sport%20Loop-hero-zoom.png',
    subtitle: 'Apple Watch Series 4. Fundamentally redesigned and re-engineered to help you be even more active, healthy, and connected.',
    url: 'https://www.att.com/buy/wearables/apple-watch-series-4-40mm-16gb-space-gray-aluminum-black-sport-loop.html'
}];
const tomProductsDetails = [{
    title: 'Samsung Galaxy S10+ 128GB',
    imageUrl: 'https://www.att.com/catalog/en/idse/Samsung/Samsung%20Galaxy%20S10+%20128GB/Prism%20White-hero-zoom.png',
    subtitle: 'After 10 years of mobile pioneering firsts, it\'s time to meet our latest and greatest innovation yet.',
    url: 'https://www.att.com/buy/phones/samsung-galaxy-s10-plus-128gb-prism-white.html'
}];
function getProductsForScenario(scenarioId) {
    let productsForScenario = {};
    switch (scenarioId) {
        case 'tom':
            productsForScenario = tomProductsDetails;
            break;
        default:
            productsForScenario = benProductsDetails;
            break;
    }
    return productsForScenario;
}
function buildImageElement(product) {
    return {
        "title": product.title,
        "image_url": product.imageUrl,
        "subtitle": product.subtitle,
        "buttons": [
            {
                "type": "web_url",
                "url": product.url,
                "title": "View Item"
            }
        ]
    }
}
function buildTextElement(product) {
    return {'text':product.title};
}
function buildImageMessages(products) {
    let accumElements = [];
    for (i = 0; i < products.length; i++) {
        accumElements.push(buildImageElement(products[i]));
    }
    console.log(accumElements);
    messagesTemplate.messages[0].attachment.payload.elements = [];
    messagesTemplate.messages[0].attachment.payload.elements = accumElements;
    return messagesTemplate;
}
function buildTextMessages(products) {
    let accumTexts = [];
    for (i = 0; i < products.length; i++) {
        accumTexts.push(buildTextElement(products[i]));
    }
    console.log(accumTexts);
    return {messages: accumTexts};
}
const messagesTemplate = {
    messages: [
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    image_aspect_ratio: "square",
                    elements: []
                }
            }
        }
    ]
}
