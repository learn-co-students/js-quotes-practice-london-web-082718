class API {

  static init () {
    this.baseUrl = 'http://localhost:3000/quotes'
  }

  static getQuotes () {
    return fetch(this.baseUrl)
      .then(resp => resp.json())
  }

  static getQuote (id) {
    return fetch(`${this.baseUrl}/${id}`)
      .then(resp => resp.json())
  }
  
  static addQuote (newQuote) {               // where newQuote is a JSON object
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote)
    }).then(resp => resp.json())
  }

  static deleteQuote (id) {             
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    })
  }

  static likeQuote (id, likes) {             
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'likes': likes})
    }).then(resp => resp.json())
  }

  static editQuote (id, editedQuote) {             
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedQuote)
    }).then(resp => resp.json())
  }

}

API.init()