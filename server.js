"use strict"

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
const PORT = 3001;

const mongoose = require('mongoose')
server.use(express.json());
server.get('/', homeRouteHandler);
function homeRouteHandler(req, res) {
    res.send('home route')
}
server.get('/books', getBooksHandler);
server.post('/addBooks', addBooksHandler);
server.delete('/deleteBook/:index', deleteBooksHandler);
server.put('/updateBooks/:index', updateBooksHandler);



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const BookSchema = new mongoose.Schema({
    name: String,
    discription: String,
    imageUrl: String,
});
const UserSchema = new mongoose.Schema({
    email: String,
    books: [BookSchema]
});
const userModel = mongoose.model('books', UserSchema);

function seedBooksCollection() {
    const hiba = new userModel({
        email: 'salemhiba.hs@gmail.com',
        books: [
            {
                name: 'Night Train to Lisbon',
                discription: 'Raimund Gregorius teaches classical languages at a Swiss lycée, and lives a life governed by routine. One day, a chance encounter with a Portuguese woman inspires him to question his life--and leads him to an extraordinary book that will open the possibility of changing it. Inspired by the words of Amadeu de Prado, a doctor whose intelligence and magnetism left a mark on everyone who met him and whose principles led him into a confrontation with Salazars dictatorship, Gergorius boards a train to Lisbon. As Gregorius becomes fascinated with unlocking the mystery of who Prado was, an extraordinary tale unfolds.',
                imageUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/8021/9780802143976.jpg',
            },
            {
                name: 'The Power of Habit',
                discription: 'Why do we do develop habits? And how can we change them',
                imageUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/8479/9781847946249.jpg',
            },
            {
                name: 'And Then There Were None',
                discription: 'An exclusive authorized edition of the most famous and beloved stories from the Queen of Mystery ,ten people, each with something to hide and something to fear, are invited to an isolated mansion on Indian Island by a host who, surprisingly, fails to appear. On the island they are cut off from everything but each other and the inescapable shadows of their own past lives. One by one, the guests share the darkest secrets of their wicked pasts. And one by one, they die...',
                imageUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0620/9780062073488.jpg',
            }
        ]
    })

    const sokiyna = new userModel({
        email: 'sokiyna.naser@gmail.com',
        books: [
            {
                name: 'gone with the wind',
                discription: 'classic',
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbFbscfoKvmc9ZTSn-RWO4VtoQReYx1cy4Og&usqp=CAU'
            },
            {
                name: 'the alchemist',
                discription: 'novel',
                imageUrl: 'https://kbimages1-a.akamaihd.net/32ad8373-9cc5-4c4f-aa82-8155edbc7029/1200/1200/False/the-alchemist-a-graphic-novel.jpg',
            },
            {
                name: 'men are from mars women are from venus',
                discription: 'Classic Guide',
                imageUrl: 'https://m.media-amazon.com/images/I/51evEGvOpRL.jpg',
            }
        ]
    })

    hiba.save();
    sokiyna.save();
}


seedBooksCollection();

function getBooksHandler(req, res) {

    let userEmail = req.query.email;

    userModel.find({ email: userEmail }, function (err, userModel) {
        if (err) {
            return console.log('No data');
        } else {
            res.send(userModel[0].books);
        }
    })
}

function addBooksHandler(req, res) {

    const { bookName, bookDiscription, bookImageUrl, userEmail } = req.body;
    console.log("test add");


    userModel.find({ email: userEmail }, function (err, userModel) {
        if (err) {
            return console.log('No data');
        } else {

            userModel[0].books.push({
                name: bookName,
                discription: bookDiscription,
                imageUrl: bookImageUrl,
            })
            userModel[0].save();
            res.send(userModel[0].books)
        }
    })
}

function deleteBooksHandler(req, res) {

    console.log("test delete");
    let email = req.query.email;
    let index = req.params.index;

    console.log(email, index);

    userModel.find({ email: email }, (error, userModel) => {
        const newBookArr = userModel[0].books.filter((book, idx) => {
            if (idx != index) {
                return book;
            }
        })
        userModel[0].books = newBookArr;
        userModel[0].save();
        res.send(userModel[0].books);
    })
}

function updateBooksHandler(req, res) {
    console.log("test update",req);
    let index = req.params.index;
    const { email, name, discription, imageUrl } = req.body;

    console.log("value", email, name, discription, imageUrl ,index);


    userModel.find({ email: email }, function (err, userModel) {
        console.log("userModel",userModel);
        if (err) {
            return console.log('No data');
        } else {
            userModel[0].books.splice(index, 1, {
                name: name,
                discription: discription,
                imageUrl: imageUrl,
            })

            userModel[0].save();
            res.send(userModel[0].books);
        }
    })

}

server.get('*', errorsHandler);
function errorsHandler(req, res) {
    res.status(404).send('Something went wrong');
}


server.listen(PORT, () => {
    console.log(`listen on Port ${PORT}`);
});
