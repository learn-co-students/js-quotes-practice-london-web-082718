const quoteCont = document.querySelector('#quote-cont');
const quoteUl = document.querySelector('#quote-list');
const quoteForm = document.querySelector('#new-quote-form');
const inputText = document.querySelector('#new-quote');
const inputAuthor = document.querySelector('#new-author');
const editText = document.getElementsByClassName('#edit-quote');
const editAuthor = document.getElementsByClassName('#edit-author');
const editForm = document.getElementsByClassName('.edit-form');
const sortButton = document.querySelector('.sort-button')
let sorted = false;

const renderQuote = function(quote){
    const quoteLi = document.createElement('li');
        quoteLi.className = "quote-card";
        quoteLi.id = `li-${quote.id}`;
        quoteLi.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0" id="quote-text-${quote.id}">${quote.quote}</p>
          <footer class="blockquote-footer" id="quote-author-${quote.id}">${quote.author}</footer>
          <br>
          <button class='btn-success' id="${quote.id}">Likes: <span id="like-${quote.id}">${quote.likes}</span></button>
          <button class='btn-danger' id="${quote.id}">Delete</button>
          <button class='btn-warning edit-form-button' id="${quote.id}">Edit</button>
          <form class="edit-form" style="display:none" id="edit-form-${quote.id}">
          <div class="form-group">
            <label for="edit-quote">Edit</label>
            <input type="text" class="form-control edit-quote" id="edit-text-${quote.id}" value="${quote.quote}">
          </div>
          <div class="form-group">
            <label for="Author">Author</label>
            <input type="text" class="form-control edit-author" id="edit-author-${quote.id}" value="${quote.author}">
          </div>
          <button type="submit" class="btn-warning edit-button-submit" id="${quote.id}">Edit</button>
        </form>
        </blockquote>
        `
    quoteUl.appendChild(quoteLi);
    }

    const renderQuotes = function(quotes) {
        quotes.forEach(renderQuote)
    }

    const renderAndSortQuotes = function(quotes){
       let sortedQuotes = quotes.sort(function(a, b){
            let nameA = a.author.toUpperCase();
            let nameB = b.author.toUpperCase(); 
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
        
            return 0;
        })
      renderQuotes(sortedQuotes)  
    }

    API.getQuotes().then(renderQuotes)

    quoteForm.addEventListener('submit', event => {
        event.preventDefault();
        let text = inputText.value;
        let author = inputAuthor.value;
        let likes = 0;
        API.createQuote(text, author, likes).then(event.target.reset())
    })

    document.addEventListener('click', event => {
        if (event.target.className === 'btn-success'){
        const id = event.target.id;
        const currentLikes = document.querySelector(`#like-${id}`)
        const increasedLike = parseInt(currentLikes.innerText) + 1
        API.increaseLikes(id, increasedLike).then(resp => currentLikes.innerText = increasedLike)
        }})

    document.addEventListener('click', event => {
        if (event.target.className === 'btn-danger'){
        const id = event.target.id;
        const quoteLi = document.querySelector(`#li-${id}`);
        API.deleteQuote(id).then(quoteLi.remove())
    }})

    document.addEventListener('click', event => {
        if (event.target.classList.contains('edit-form-button')){           
            const id = event.target.id;
            const editForm = document.querySelector(`#edit-form-${id}`)
            const displayStyle = editForm.style.display
            editForm.style.display = displayStyle === '' ? 'none' : ''
        }
    })

    document.addEventListener('click', event => {
        if (event.target.classList.contains('edit-button-submit')){
            event.preventDefault();
            const id = event.target.id;
            const quoteText = document.querySelector(`#quote-text-${id}`)
            const quoteAuthor = document.querySelector(`#quote-author-${id}`)
    let updatedText = document.querySelector(`#edit-text-${id}`).value;
    let updatedAuthor = document.querySelector(`#edit-author-${id}`).value;
    const editForm = document.querySelector(`#edit-form-${id}`)
    API.editQuote(id, updatedText, updatedAuthor)
    .then(() => quoteText.innerText = updatedText)
    .then(() => quoteAuthor.innerText = updatedAuthor)
    .then(editForm.style= "display: none;")
    }})

    document.addEventListener('click', event =>{
        if (event.target.classList.contains('sort-button')){
            if (sorted === false){
            quoteUl.innerHTML = ' ';
            API.getQuotes().then(renderAndSortQuotes)
            sorted = true;
            sortButton.innerText = 'Sorted By Author';
        }
            else if (sorted === true)  {
                quoteUl.innerHTML = ' ';
                API.getQuotes().then(renderQuotes)
                sorted = false;
                sortButton.innerText = 'Sort By Author';
            }
        }
    })