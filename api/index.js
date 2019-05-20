//Imports
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
//App Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router
//============[ROUTES]===============
router.get('/products/:scenario_id', function (req, res) {
    log('Received request for products for user ' + req.params.scenario_id);
    //Step # 1 : get products
    let productsToRender = getProductsForScenario(req.params.scenario_id.toLowerCase());
    //Step # 2 : Parse response
    let messages = buildTextMessages(productsToRender);
    res.json(messages);
});
router.get('/products-images/:scenario_id', function (req, res) {
    log('Received request for products with images for user ' + req.params.scenario_id);
    //Step # 1 : get products
    let productsToRender = getProductsForScenario(req.params.scenario_id.toLowerCase());
    //Step # 2 : Parse response
    let messages = buildImageMessages(productsToRender);
    res.json(messages);
});
app.use('/api', router);
//============[SERVER START]===========
app.listen(port);
console.log('Mercury Bot Data API is alive and runs on port ' + port);
//============[PRODUCT DATABASE]============
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

//
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
    log("Retrieved products for user:"+scenarioId);
    log("products are:"+JSON.stringify(productsForScenario));
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
    return {'text': product.title};
}

function buildImageMessages(products) {
    let accumElements = [];
    for (i = 0; i < products.length; i++) {
        accumElements.push(buildImageElement(products[i]));
    }
    messagesTemplate.messages[0].attachment.payload.elements = [];
    messagesTemplate.messages[0].attachment.payload.elements = accumElements;
    return messagesTemplate;
}

function buildTextMessages(products) {
    let accumTexts = [];
    for (i = 0; i < products.length; i++) {
        accumTexts.push(buildTextElement(products[i]));
    }
    return {messages: accumTexts};
}

function log(message) {
    setTimeout(() => {
        console.log('[' + new Date().toUTCString() + '] ' + message)
    }, 1500);
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
