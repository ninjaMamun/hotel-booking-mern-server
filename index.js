var express = require('express')
var app = express()

const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config()




app.use(cors());
app.use(bodyParser.json());





var serviceAccount = require("./configs/pick-me-b1533-firebase-adminsdk-jau6y-61f4b023c8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const pass = '!D.627x-U$$XFj8';



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://Mamun:${process.env.DB_PASS}@cluster0.iokbq.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  // perform actions on the collection object
  console.log('db connected');

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    console.log(newBooking);
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorizations
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log({ idToken });
      // authorizations token
      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          let tokenEmail = decodedToken.email;
          if (tokenEmail == req.query.email) {
            bookings.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents);
              })
          }
          // ...
        })
        .catch((error) => {
          res.status(401).send('Unauthorized Access!');
        });

    } else {
      res.status(401).send('Unauthorized Access!');

    }


  })

});












app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(5000)