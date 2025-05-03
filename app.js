const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://kalp2002prajapati:SbjvllYj1oo6osxn@cluster0.xfojzlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

module.exports = app;
