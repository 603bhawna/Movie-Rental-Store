const express = require('express');
const mongoose=require('mongoose');
require('express-async-errors');
const app = express();

const customers=require('./routes/customers');
const movies=require('./routes/movies');
const users=require('./routes/users');
const login = require("./routes/login");
const rental = require("./routes/rental");

mongoose
.connect("mongodb://localhost/store", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => {
  console.log("connected to mongodb");
})
.catch((err) => {
  console.log("unable to connect to mongodb", err.message);
});

app.use(express.json());

app.use('/api/customers',customers);
app.use('/api/users',users);
app.use('/api/movies',movies);
app.use("/api/login", login);
app.use("/api/rental", rental);

const port=process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port} ....`);
});

