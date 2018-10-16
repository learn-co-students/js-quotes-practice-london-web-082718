// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

// document.addEventListener('DOMContentLoaded', () => {

    const listEl = document.getElementById('quote-list')
    const formEl = document.getElementById('new-quote-form')
    const inputQuote = document.getElementById('new-quote')
    const inputAuthor = document.getElementById('author')
    const editFormEl = document.getElementById('edit-task-form')
    // const inputQuoteEl = document.getElementById('edit-quote')


    // API CALLS

    // GET
    const getQuotes = () => 
        fetch('http://localhost:3000/quotes')
            .then(resp => resp.json())

    // POST
    const createQuote = quote => 
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(quote)
        }).then(resp => resp.json())
  
    // PATCH
    const updateQuote = (quoteId, data) => 
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                likes: data.likes,
                quote: data.quote
            })
            }).then(resp => resp.json())
   
    // DELETE
    function deleteQuote(id) {
        fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
        }).then(resp => resp.json())
    }     
 

    // RENDER ALL QUOTES 

    const renderAllQuotes = quotes => {
        quotes.forEach(renderQuote)

    }    

    getQuotes()
        .then(renderAllQuotes)

    const renderQuote = entry => {
        const liEl = document.createElement('li')
        liEl.className = 'quote-card'
        liEl.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${entry.quote}</p>
            <footer class="blockquote-footer">${entry.author}</footer>
            <br>
            <button class='btn-success' data-id=${entry.id}>Likes: <span >${entry.likes}</span></button>
            <button data-id=${entry.id} class='btn-edit' >EDIT</button>
            <button data-id=${entry.id} class='btn-danger'>Delete</button> 
        </blockquote>
        <form id="edit-task-form-${entry.id}" action="#" method="post" style="display: none">
            <label for="edit-quote">Task description:</label>
            <input type="text" id="edit-quote-${entry.id}" name="edit-task-description" placeholder="description">
            <input type="submit" value="Update Task">
            // <button id="cancel" type="button">Cancel</button>
        </form>
        `
        listEl.append(liEl)   
        
    }

    ////////////////////////////////////////////////


    // QUOTE FUNCTION
    formEl.addEventListener('submit', event => {
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

    // LIKE FUNCTION
    document.addEventListener('click', (e) => {
        // conditionally render the like number
        if (e.target.className === "btn-success") {
            let likeNum = e.target.firstElementChild
            likeNum.innerText = parseInt(likeNum.innerText) + 1
            updateQuote(e.target.dataset.id, {likes: parseInt(likeNum.innerText)})
        }
    })


    // DELETE FUNCTION
    document.addEventListener('click', (e) => {
        // conditionally render the like number
        if (e.target.className === "btn-danger") {
            let deleteEl = e.target.parentElement.parentElement
            deleteEl.remove() 
            let removeElId = parseInt(e.target.previousElementSibling.dataset.id)  
            deleteQuote(removeElId)
        }
    })

    // EDIT FUNCTION
    document.addEventListener('click', (e) => {
        // conditionally render the like number
        console.log(e.target.className)
        if (e.target.className === "btn-edit") {
            const formDisplayEl = e.target.parentElement.nextElementSibling
            formDisplayEl.style.display = 'block'
            let updatedtext = e.target.parentElement.firstElementChild

            formDisplayEl.addEventListener('submit', event => {
                event.preventDefault()
                let quoteEditId = parseInt(formDisplayEl.children[1].id.split("-")[2])
                let quoteString = formDisplayEl.children[1].value
                updatedtext.innerText = quoteString

                updateQuote(quoteEditId, {quote: quoteString})            
            })
        }
    })

 
// // End of Main
// })














