class API {
    static init () {
      this.baseUrl = 'http://localhost:3000/quotes'
    }
  
    static getQuotes() {
      return fetch(this.baseUrl)
        .then(resp => resp.json())
    }
  
    static getQuote (id) {
      return fetch(`${this.baseUrl}/${id}`)
        .then(resp => resp.json())
    }
  
    static createQuote (quote, author, likes) {
      // 'POST'
      return fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'quote': quote,
          'author': author,
          'likes': likes
        })
      }).then(resp => resp.json())
      .then(renderQuote)
    }
  
    static deleteQuote (id) {
      return fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      })
    }
  
    static increaseLikes (id, increasedLike) {
      return fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'likes': increasedLike })
      }).then(resp => resp.json())
    }
  
    static editQuote (id, editedQuote, editedAuthor) {
      return fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'quote': editedQuote,
            'author': editedAuthor
        })
      }).then(resp => resp.json())
    }
  }
  
  API.init()