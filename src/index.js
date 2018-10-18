// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quotesList = document.getElementById('quote-list')
let quotesNotFromServer

const quoteForm = document.querySelector('#new-quote-form')
const quoteInputField = document.querySelector('#new-quote')
const authorInputField = document.querySelector('#author')
const quotesOrderOfCreation = []
const authors = []

function appendQuote (quote) {
  const quoteItem = renderQuote(quote)
  quotesList.appendChild(quoteItem)
}

function appendQuotes (quotes) {
  quotes.forEach(quote => appendQuote(quote))
}

function renderQuote (quote) {
  const quoteItem = document.createElement('li')
  quoteItem.classList.add('quote-card')
  quoteItem.innerHTML = `
    <blockquote class="blockquote" id="${quote.id}">
        <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
            <br>
          <button class='btn-success'>Likes: ${quote.likes}<span></span></button>
        <button class='btn-edit'>🙈 Edit quote 😅</button>
      <button class='btn-danger'> ☠️ Delete 🏳️</button>
    </blockquote>
  `
  // Delete function
  const deleteButt = quoteItem.querySelector('.btn-danger')
  deleteButt.addEventListener('click', () => {
    API.deleteQuote(quote.id) // not optimistically rendering
      .then(quoteItem.remove())
  })

  // Like function
  const likeButt = quoteItem.querySelector('.btn-success')
  likeButt.addEventListener('click', () => {
    quote.likes++
    API.likeQuote(quote.id, quote.likes)
      .then(() => {
        likeButt.innerText = `Likes: ${quote.likes}`
      })
  })

  // Edit a quote
  const editButt = quoteItem.querySelector('.btn-edit')
  const quoteWords = quoteItem.querySelector('.mb-0')
  const quoteAuthor = quoteItem.querySelector('.blockquote-footer')

  // const editableQuoteItem = document.createElement('form')
  // editableQuoteItem.style.display = 'hidden'
  editButt.addEventListener('click', () => {
    if (quoteWords.style.display !== false) {
      // clock is visible. hide it
      quoteWords.style.display = 'none'
      quoteAuthor.style.display = 'none'
      const editableQuoteInput = document.createElement('input')
      editableQuoteInput.value = quoteWords.innerText
      editableQuoteInput.className = "form-control"
      const editableAuthorInput = document.createElement('input')
      editableAuthorInput.value = quoteAuthor.innerText
      editableAuthorInput.className = "form-control"
      const saveEditButt = document.createElement('button')
      saveEditButt.innerText = 'Save changes'
      quoteItem.prepend(editableQuoteInput, editableAuthorInput, saveEditButt)
      saveEditButt.addEventListener('click', () => {
        const editedQuote = {
          quote: editableQuoteInput.value,
          author: editableAuthorInput.value
        }
        API.editQuote(quote.id, editedQuote)
          .then(resp => {
            editableQuoteInput.remove()
            editableAuthorInput.remove()
            saveEditButt.remove()
            quoteWords.innerText = resp.quote
            quoteAuthor.innerText = resp.author
            quoteWords.style.display = 'block'
            quoteAuthor.style.display = 'block'
            // don't need to append, because quoteWords / quoteAuthor are already viewable elements on the page
          })
      })
    }
  })
  return quoteItem
}
/// /// OUTSIDE OF RENDER ///////
// Create a new Quote

quoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const quoteTitle = quoteInputField.value
  const quoteAuthor = authorInputField.value
  let likes = 0
  const newQuote = {
    quote: quoteTitle,
    author: quoteAuthor,
    likes: likes
  }
  API.addQuote(newQuote)
    .then(newQuote => appendQuote(newQuote))
  event.target.reset()
})

function sort () {            // sort is called upon in the HTML - 'onclick=sort()'
  const listEl = document.getElementById('quote-list')   // the entire quoteList 
  quoteArray = [...listEl.children]    // get each of the <li> quotecards
  quoteArray.sort(function (object1 , object2) {     // arr.sort([compareFunction])
    author1 = object1.firstElementChild.firstElementChild.nextElementSibling.innerText
    author2 = object2.firstElementChild.firstElementChild.nextElementSibling.innerText

    if (author1 > author2) {
      return 1
    } else {
      return -1
    }
  }).forEach((item) => {           
    listEl.appendChild(item)
  })
}

// Run the app
API.getQuotes()
  .then(quotesFromServer => {
    quotesNotFromServer = quotesFromServer
    appendQuotes(quotesFromServer)
  })
