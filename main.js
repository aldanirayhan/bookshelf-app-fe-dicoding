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
      books.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const titleBook = document.getElementById('bookFormTitle').value;
  const authorBook = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const isCompletedBook = document.getElementById('bookFormIsCompleted').value;

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
