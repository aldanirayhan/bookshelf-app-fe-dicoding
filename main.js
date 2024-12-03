const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOK_APPSS';

function generatedId() {
  return +new Date();
}

function generateBookObject(id, title, author, number, isComplete) {
  return {
    id,
    title,
    author,
    number: parseInt(number),
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
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

let editBookId = null;
function addBook() {
  const titleBook = document.getElementById('bookFormTitle').value;
  const authorBook = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const isCompletedBook = document.getElementById('bookFormIsComplete').checked;

  if (editBookId) {
    const bookIndex = findBookIndex(editBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = generateBookObject(
        editBookId,
        titleBook,
        authorBook,
        bookYear,
        isCompletedBook
      );
      editBookId = null;
      document.getElementById('section-title').innerText = 'Tambah Buku Baru';
      document.getElementById('bookFormSubmit').innerText = 'Tambahkan Buku';
    }
  } else {
    const generatedID = generatedId();
    const bookObject = generateBookObject(
      generatedID,
      titleBook,
      authorBook,
      bookYear,
      isCompletedBook
    );
    books.push(bookObject);
  }

  document.getElementById('bookForm').reset();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBookByid(bookId) {
  const bookToEdit = findBook(bookId);
  if (bookToEdit) {
    document.getElementById('bookFormTitle').value = bookToEdit.title;
    document.getElementById('bookFormAuthor').value = bookToEdit.author;
    document.getElementById('bookFormYear').value = bookToEdit.number;
    document.getElementById('bookFormIsComplete').checked =
      bookToEdit.isComplete;

    editBookId = bookId;
  }
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
  bookYear.innerText = `Tahun: ${bookObject.number}`;

  const bookDetails = document.createElement('span');
  bookDetails.append(bookAuthor, bookYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('book-actions');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = bookObject.isComplete
    ? 'Belum selesai dibaca'
    : 'Selesai dibaca';

  toggleButton.addEventListener('click', function () {
    taskBookReadComplete(bookObject.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus Buku';

  deleteButton.addEventListener('click', () => {
    deleteBookById(bookObject.id);
  });

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit Buku';

  editButton.addEventListener('click', () => {
    document.getElementById('section-title').innerText = 'Edit Buku';
    document.getElementById('bookFormSubmit').innerText =
      'Simpan Perubahan Buku';
    editBookByid(bookObject.id);
  });

  actionContainer.append(toggleButton, deleteButton, editButton);
  bookContainer.append(bookTtile, bookDetails, actionContainer);

  function taskBookReadComplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = !bookTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function deleteBookById(bookId) {
    const bookIndex = findBookIndex(bookId);

    if (bookIndex === -1) return;

    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

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

    if (book.isComplete) {
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

document
  .getElementById('searchBook')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document
      .getElementById('searchBookTitle')
      .value.toLowerCase();
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completedBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const book of books) {
      if (book.title.toLowerCase().includes(searchInput)) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completedBookList.append(bookElement);
        } else {
          incompleteBookList.append(bookElement);
        }
      }
    }
  });
