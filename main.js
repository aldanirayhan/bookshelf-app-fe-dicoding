const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-todos';
const STORAGE_KEY = 'BOOK_APPSS';

function generatedId() {
  return +new Date();
}

function generatebookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser-mu tidak memiliki Storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const titleBook = document.getElementById('bookFormTitle').value;
  const authorBook = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const isCompletedBook = document.getElementById('bookFormIsComplete').checked;

  const generatedID = generatedId();

  const bookObject = generatebookObject(
    generatedID,
    titleBook,
    authorBook,
    bookYear,
    isCompletedBook
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function createBookElement(bookObject) {
  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book-item');
  bookContainer.setAttribute('data-bookid', bookObject.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const bookTtile = document.createElement('h3');
  bookTtile.setAttribute('data-testid', 'bookItemTitle');
  bookTtile.innerText = bookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = `Tahun: ${bookObject.year}`;

  const bookDetails = document.createElement('span');
  bookDetails.append(bookAuthor, bookYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('book-actions');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = bookObject.isCompleted
    ? 'Belum selesai dibaca'
    : 'Selesai dibaca';

  toggleButton.addEventListener('click', function () {
    bookObject.isCompleted = !bookObject.isCompleted;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus Buku';

  deleteButton.addEventListener('click', () => {
    const bookIndex = books.findIndex((item) => item.id === book.id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  });

  actionContainer.append(toggleButton, deleteButton);
  bookContainer.append(bookTtile, bookDetails, actionContainer);

  return bookContainer;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completedBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completedBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);

    if (book.isCompleted) {
      completedBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const submitBookForm = document.getElementById('bookForm');
  submitBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
