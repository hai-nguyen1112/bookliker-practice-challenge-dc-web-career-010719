document.addEventListener("DOMContentLoaded", init)

function init() {
  getAllBooks()
}

function getAllBooks() {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(allBookObjs => {
    allBookObjs.forEach(renderBook)
  })
}

function renderBook(bookObj) {
  let bookList = getBookList()

  let p = document.createElement('p')
  bookList.appendChild(p)

  let bookButton = document.createElement('button')
  p.appendChild(bookButton)
  bookButton.innerText = bookObj.title
  bookButton.addEventListener('click', () => {handleClickOfBookButton(bookObj)})
}

function handleClickOfBookButton(bookObj) {
  renderBookInfo(bookObj)
}

function renderBookInfo(bookObj) {
  let bookPanel = getBookPanel()
  bookPanel.innerHTML = ''

  let img = document.createElement('img')
  bookPanel.appendChild(img)
  img.src = bookObj.img_url

  let likeButton = document.createElement('button')
  bookPanel.appendChild(likeButton)
  likeButton.id = 'book-like-' + bookObj.id
  likeButton.innerText = "Like <3"
  likeButton.addEventListener('click', () => {handleClickOfLikeButton(bookObj)})

  let p = document.createElement('p')
  bookPanel.appendChild(p)
  p.innerText = bookObj.description

  let listOfUsersWhoLikeThisBook = document.createElement('p')
  bookPanel.appendChild(listOfUsersWhoLikeThisBook)
  listOfUsersWhoLikeThisBook.id = 'book-users-' + bookObj.id
  listOfUsersWhoLikeThisBook.innerHTML = `<h3>Users Who Have Liked This Book:</h3>`
  bookObj.users.forEach(user => {
    listOfUsersWhoLikeThisBook.innerHTML += `<li>${user.username}</li>`
  })
}

function handleClickOfLikeButton(bookObj) {
  if (getLikeButton(bookObj).innerText === 'Like <3') {
    bookObj.users.push({id: 1, username: "pouros"})
  } else {
    bookObj.users.pop()
  }
  patchBookUsers(bookObj)
}

function patchBookUsers(bookObj) {
  fetch(`http://localhost:3000/books/${bookObj.id}`, {
      method: "PATCH",
      body: JSON.stringify(bookObj.users),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }).then(() => {
      if (getLikeButton(bookObj).innerText === 'Like <3') {
        getListOfUsersWhoLikeThisBook(bookObj).innerHTML += `<li>pouros</li>`
        getLikeButton(bookObj).innerText = 'Dislike'
      } else {
        getListOfUsersWhoLikeThisBook(bookObj).lastChild.remove()
        getLikeButton(bookObj).innerText = 'Like <3'
      }
    }
  )
}

//Helper Functions
function getBookList() {
  return document.querySelector('#list')
}

function getBookPanel() {
  return document.querySelector('#show-panel')
}

function getLikeButton(bookObj) {
  return document.querySelector(`#book-like-${bookObj.id}`)
}

function getListOfUsersWhoLikeThisBook(bookObj) {
  return document.querySelector(`#book-users-${bookObj.id}`)
}
