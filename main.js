const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOK_APPSS';

const generatedId = () => +new Date();

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

const findBook = (bookId) => books.find((book) => book.id === bookId) || null;

const findBookIndex = (bookId) => books.findIndex((book) => book.id === bookId);

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

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = serializedData ? JSON.parse(serializedData) : [];
  books.push(...data);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

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
    document.getElementById('bookFormYear').value = bookToEdit.year;
    document.getElementById('bookFormIsComplete').checked =
      bookToEdit.isComplete;

    editBookId = bookId;
  }
}

function createBookElement(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const bookHTML = `
    <div class="book-item" data-testid="bookItem" data-bookid="${id}">
      <h3 data-testid="bookItemTitle">${title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${author}</p>
      <p data-testid="bookItemYear">Tahun: ${year}</p>
      <div class="book-actions">
        <button data-testid="bookItemIsCompleteButton">
          ${isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    </div>
  `;

  const bookElement = document.createElement('div');
  bookElement.innerHTML = bookHTML.trim();
  const container = bookElement.firstChild;

  const toggleButton = container.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  toggleButton.addEventListener('click', () => {
    taskBookReadComplete(id);
  });

  const deleteButton = container.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );
  deleteButton.addEventListener('click', () => {
    deleteBookById(id);
  });

  const editButton = container.querySelector(
    '[data-testid="bookItemEditButton"]'
  );
  editButton.addEventListener('click', () => {
    document.getElementById('section-title').innerText = 'Edit Buku';
    document.getElementById('bookFormSubmit').innerText =
      'Simpan Perubahan Buku';
    editBookByid(id);
  });

  return container;
}

function taskBookReadComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (!bookTarget) return;

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
