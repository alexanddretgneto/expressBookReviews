const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const app = express();
app.use(express.json());



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// implementado
public_users.get('/',function (req, res) {
  
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let buscar_por_isbn = Object.values(books).find(book => book.isbn === isbn);
  
  if (buscar_por_isbn) {
    res.send(buscar_por_isbn);
  } else {
    res.send("Livro não encontrado para o ISBN especificado.");
  }
});



public_users.get('/books', async function (req, res) {
  try {
    const bookList = Object.values(books);

    // Adding a delay of 5 seconds
    setTimeout(() => {
      res.send(bookList);
    }, 5000); // 5000 milliseconds = 5 seconds
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Erro ao obter a lista de livros da loja.');
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  let buscar_por_autor = Object.values(books).filter(book => book.author === author);

  if (buscar_por_autor.length > 0) {
    // Adding a delay of 5 seconds
    setTimeout(() => {
      res.send(buscar_por_autor);
    }, 5000); // 5000 milliseconds = 5 seconds
  } else {
    res.send("Nenhum livro encontrado para o autor especificado.");
  }
});


// public_users.get('/author/:author',  function (req, res) {
//   const author = req.params.author;
//   let buscar_por_autor = Object.values(books).filter(book => book.author === author);
  
//   if (buscar_por_autor.length > 0) {
//     res.send(buscar_por_autor);
//   } else {
//     res.send("Nenhum livro encontrado para o autor especificado.");
//   }
// });

public_users.get('/books', async function (req, res) {
  try {
    const author = req.query.author;
    
    // Simulating a 2-second delay
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(book => book.author === author);
      res.send(filteredBooks);
    }, 2000); // 2000 milliseconds = 2 seconds
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Erro ao obter a lista de livros da loja.');
  }
});








  



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let buscar_por_titulo = Object.values(books).filter(book => book.title === title);
  
  if (buscar_por_titulo.length > 0) {
    res.send(buscar_por_titulo);
  } else {
    res.send("Livro não encontrado.");
  }
});





 





//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let livro = Object.values(books).find(book => book.isbn === isbn);
  
  if (livro) {
    res.send(livro.reviews);
  } else {
    res.send("{}");
  }
});


// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});


module.exports.general = public_users;
