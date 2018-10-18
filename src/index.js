// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

//First, select relevant elements
const inputQuote = document.getElementById('new-quote')
const inputAuthor = document.getElementById('author')
const myFavQuotes = document.getElementById('quote-list')
const myForm = document.getElementsByClassName('form-group')
const form = document.querySelector('form')

//Then, call the api to get the quotes
const getQuotes = () =>
fetch('http://localhost:3000/quotes')
.then(resp => resp.json())


//Then, render an individual quote, interpolating relevant object properties in the HTML.
//Then insert into document, usually '.innerHTML +=' but can also do '.appendChild' or ' 

const renderQuote = (post) => {
    let newQuoteEl = `<li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${post.quote}</p>
      <footer class="blockquote-footer">${post.author}</footer>
      <br>
<button class='btn-success'>Likes:<span>${post.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
myFavQuotes.innerHTML += newQuoteEl;
}

// To render all quotes on the page
const renderQuotes = quotes => {
    quotes.forEach(renderQuote)
}

// Call functions
getQuotes()
.then(renderQuotes)


// POST - adding a new quote
const createQuote = quote => 
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(quote)
    }).then(resp => resp.json())

// PATCH - update
const updateQuote = (id, quote) => 
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            likes: quote.likes,
            quote: quote.quote
        })
        }).then(resp => resp.json())

// DELETE
function deleteQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
    }).then(resp => resp.json())
}     
 

// Input form data
form.addEventListener('submit', event => {
event.preventDefault()
const quote = {
    quote: inputQuote.value,
    author: inputAuthor.value,
    likes: 0
}
    createQuote(quote)
    .then(renderQuote)
    
event.target.reset()    
})

// Like button
document.addEventListener('click', (e) => {

if (e.target.className === "btn-success") {
    let likeNum = e.target.firstElementChild
    likeNum.innerText = parseInt(likeNum.innerText) + 1
    updateQuote(e.target.dataset.id, {likes: parseInt(likeNum.innerText)})
}
})
// Delete button
document.addEventListener('click', (e) => {

if (e.target.className === "btn-danger") {
    let deleteEl = e.target.parentElement.parentElement
    deleteEl.remove() 
    let removeElId = parseInt(e.target.previousElementSibling.dataset.id)  
    deleteQuote(removeElId)
}
})











