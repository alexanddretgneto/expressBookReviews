const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }}

  

  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

  

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

 

//Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Obtendo o ISBN do livro da rota
  const review = req.query.review; // Obtendo a revisão do livro da consulta de solicitação
  const username = req.session.username; // Obtendo o nome de usuário armazenado na sessão

  // Verificando se o usuário já possui uma revisão para o ISBN fornecido
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // Modificando a revisão existente do usuário para o ISBN fornecido
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully."});
  } else {
    // Adicionando uma nova revisão para o ISBN fornecido
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully."});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // ISBN do livro
  const username = req.session.username; // Nome de usuário da sessão

  // Verificando se o livro existe no objeto de livros
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];

    // Verificando se o livro possui alguma avaliação
    if (book.hasOwnProperty('reviews')) {
      const reviews = book.reviews;

      // Verificando se o usuário tem uma avaliação para esse livro
      if (reviews.hasOwnProperty(username)) {
        delete reviews[username]; // Excluindo a avaliação do usuário

        res.status(200).json({ message: "Avaliação excluída com sucesso." });
      } else {
        res.status(404).json({ message: "O usuário não possui uma avaliação para este livro." });
      }
    } else {
      res.status(404).json({ message: "O livro não possui avaliações." });
    }
  } else {
    res.status(404).json({ message: "Livro não encontrado." });
  }
});

regd_users.get("/auth", (req,res)=>{
  res.send(books);

});

module.exports = books;

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
