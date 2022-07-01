//Library to store books infromation
let library = []
const libraryContainer = document.querySelector('.library')
let allInputs = document.querySelectorAll('input, select')

function Book(title, author, page, status) {
    this.title = title.value
    this.author = author.value
    this.page = page.value
    this.status = status.value
}

//Making books
function returnVisibleInputs() {
    const visibleInputs = []
    allInputs.forEach (input => {
        const inputStyle = window.getComputedStyle(input)
        const inputVisibility = inputStyle.getPropertyValue('visibility')
        if (inputVisibility === 'visible') visibleInputs.push(input)
    })
    return visibleInputs
}

function makeElementAndClass(element, className, appendTo) {
    const elementCreated = document.createElement(element)
    elementCreated.classList.add(...className)
    if (appendTo) appendTo.appendChild(elementCreated)
    return elementCreated
}

function addLibraryToDOM() {

    clearDOMLibrary()

    //Loops through book objects in array library. This loop focuses on one 
    //book at a time and binds functions to the books respectively
    for (book of library) {

        const bookObject = book

        const bookCard = makeElementAndClass('div', ['book'])
        bookObject.appendBookToStatusBelonged(bookCard)
        
        //Loops through propertiestatusContainers in book object, then add
        //each to book card and DOM
        for (key in bookObject) {
            if (bookObject.hasOwnProperty(key)) {
            
                const element = makeElementAndClass
                ('p', [key, 'book-info'], bookCard)

                if (key === 'page') {
                    if (parseInt(bookObject[key]) < 2) {
                        element.textContent = `${bookObject[key]} Page`
                    }
                    else element.textContent = `${bookObject[key]} Pages`
                }
                else element.textContent = bookObject[key]
            }
        }

        const deleteButton = makeElementAndClass
        ('i', ['fa-solid', 'fa-xmark'], bookCard)
        bookObject.deleteBook(bookCard, deleteButton) 

        const editBookButton = makeElementAndClass
        ('i', ['fa-solid', 'fa-ellipsis'], bookCard)
        bookObject.editBook(bookCard, editBookButton)   
    }
}

//Modifying books
Book.prototype.deleteBook = function(bookCard, button) {
    button.onclick = () => {
        library.splice(library.indexOf(this), 1)
        bookCard.remove()
        this.reduceBookTotal()
        totalBooks()
    }
}

Book.prototype.editBook = function (bookCard, button) {
    button.onclick = () => {
        toggleForm(bookFormEdit)

        const bookValuesArray = Object.values(this)
        const bookKeysArray = Object.keys(this)
        const bookInfoArray = (bookCard.querySelectorAll('.book-info'))

        for (i = 0; i < bookValuesArray.length; i++) {
            returnVisibleInputs()[i].value = bookValuesArray[i]
        }

        bookFormEdit.onsubmit = e => {
            e.preventDefault() 
            this.reduceBookTotal()

            for (i = 0; i < 4; i++) {
                this[bookKeysArray[i]] = returnVisibleInputs()[i].value
                bookInfoArray[i].textContent = returnVisibleInputs()[i].value 
            }

            this.appendBookToStatusBelonged(bookCard, this)
            toggleForm(bookFormEdit)
        }
    }
}



//Status groups and total
const bookStatusContainers = document.querySelectorAll('.book-container')
const containerTotal = document.querySelectorAll('.status-total')
const allTotal = document.querySelector('.all-total')

function clearDOMLibrary() {
    for (container of bookStatusContainers) container.innerHTML = ''
    for (total of containerTotal) {
        if (total.textContent !== 'All') total.textContent = 0
    }
}

function totalBooks() {
    allTotal.textContent = library.length
}

Book.prototype.reduceBookTotal = function() {
    for (total of this.statusContainerTotal()) {
        total.innerHTML = parseInt(total.innerHTML) - 1
    }
}
//---------------This 3 functions are connected-------------------
Book.prototype.statusContainerBelonged = function() {
    let converted = this.status.toLowerCase()
    converted = converted.replace(/ /g, '-') + '-container'
    return document.querySelector(`.${converted} .book-container`)
}

Book.prototype.statusContainerTotal = function () {
    let converted = this.status.toLowerCase()
    converted = converted.replace(/ /g, '-') + '-total'
    return document.querySelectorAll(`.${converted}`)
}

Book.prototype.appendBookToStatusBelonged = function(bookCard) {
    this.statusContainerBelonged().appendChild(bookCard)
    for (total of this.statusContainerTotal()) {
        total.innerHTML = parseInt(total.innerHTML) + 1
    }
}
// ---------------------------------------------------------------



//Book form add and edit functionality
const bookFormAdd = document.querySelector('#book-form-add')
const buttonsForTogglingAddForm = document.querySelectorAll 
('.fa-plus, #book-form-add .fa-xmark, .form-add-background')

const bookFormEdit = document.querySelector('#book-form-edit')
const buttonsForTogglingEditForm = document.querySelectorAll 
('#book-form-edit .fa-xmark, .form-edit-background')


function toggleForm(whatToToggle) {
    whatToToggle.classList.toggle('book-form-collapsed')
    whatToToggle.previousElementSibling.classList.toggle
    ('form-background-collapsed')
    for(input of returnVisibleInputs()) input.value = ''
}

buttonsForTogglingAddForm.forEach(button => button.onclick = () => {
    toggleForm(bookFormAdd)
})
buttonsForTogglingEditForm.forEach(button => button.onclick = () => {
    toggleForm(bookFormEdit)})



//Library info menu functionality
const libraryInfoBackground = document.querySelector('.library-info-background')
const libraryInfo = document.querySelector('.library-info')
const libraryMenuButton = document.querySelector('.fa-bars')
const libraryInfoXMark = document.querySelector('.library-info .fa-xmark')

function toggleMenu(action) {
    libraryInfo.classList[action]('library-info-collapsed')
    libraryInfoBackground.classList[action]('library-info-background-collapsed')
    libraryInfoXMark.classList[action]('fa-xmark-collapsed')
}

buttonsForTogglingMenu = 
[libraryMenuButton, libraryInfoBackground, libraryInfoXMark]
buttonsForTogglingMenu.forEach(button => button.onclick = () => {
    toggleMenu('toggle')
})



//Escape button functionality
function escapeToExit(e) {
    if (e.key === "Escape") {
        bookFormAdd.classList.add('book-form-collapsed')
        bookFormEdit.classList.add('book-form-collapsed')
        formBackground.classList.add('form-background-collapsed')

        libraryInfo.classList.add('library-info-collapsed')
        libraryInfoBackground.classList.add('library-info-background-collapsed')
        libraryInfoXMark.classList.add('fa-xmark-collapsed')
    }
}
window.onkeydown = e => escapeToExit(e)



//Filter book status and select book status
const libraryInfoItems = document.querySelectorAll('.library-info-item-container')
const statusContainer = document.querySelectorAll('.status-container')

libraryInfoItems.forEach((selectedStatus) => {
    selectedStatus.onclick = () => {
        let selectedStatusContainer =
        selectedStatus.firstElementChild.className + '-container'
        selectedStatusContainer = document.querySelector(`.${selectedStatusContainer}`)

        for (container of statusContainer) container.classList.add
        ('books-container-collapsed')
        for (container of libraryInfoItems) container.classList.remove
        ('container-selected')

        if (selectedStatus.firstElementChild.textContent === 'All') {
            statusContainer.forEach(container => {
                container.classList.remove('books-container-collapsed')
            })
            selectedStatus.classList.add('container-selected')
        }
        else {
            selectedStatusContainer.classList.remove('books-container-collapsed')
            selectedStatus.classList.add('container-selected')
        }
        toggleMenu('add')
    }
})



//Add book to library when form is submitted
bookFormAdd.onsubmit = e => {
    e.preventDefault()
    const newBook = new Book (...returnVisibleInputs())
    library.push(newBook)
    addLibraryToDOM()
    totalBooks()
    toggleForm(bookFormAdd)
}