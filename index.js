const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_51K8NugJywlKEoracNg51Is7lOVkrW33qrshFLZmpe0teEkktl6c10jM7UigRcQCeo33ZT99wu71xrpQPn8079SqF00kQyLD1Yd");
const { uuid } = require('uuidv4');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
    res.send("somthing")
});

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT: ", product);
    console.log("PRICE: ", token);

    const idempontencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
        .then(customer => {
            stripe.charges.create({
                amount: product.price * 100,
                currency: 'usd',
                customer: customer.id,
                recepit_email: token.email,
                description: product.name,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, { idempontencyKey });
        })
        .then(result => { 
            console.log(res);
            res.status(200).json(result) })
        .catch(err => console.log(err));

});



// listen
app.listen(6969, () => console.log("listning to 6969"));
