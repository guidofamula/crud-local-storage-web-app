const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function() {
	const uncompletedBookList = document.getElementById('incompleteBookshelfList');
	uncompletedBookList.innerHTML ="";

	const completedBookList = document.getElementById('completeBookshelfList');
	completedBookList.innerHTML ="";

	for (const bookItem of books) {
		const bookElement = makeBook(bookItem);
		if (!bookItem.isCheckBook) {	
			uncompletedBookList.append(bookElement);	
		}else {	
			completedBookList.append(bookElement);
		}
	}
});

document.addEventListener('DOMContentLoaded', function() {
	const inputBook = document.getElementById('inputBook');
	inputBook.addEventListener('submit', function(event) {
		event.preventDefault();
		addBook();
	});
	if (isStorageBooksExist()) {
		loadBookFromstorage();
	}
});

const containerButtonClick = document.getElementById('inputBookIsComplete');
const changeWord = document.querySelector('button#bookSubmit span');
containerButtonClick.addEventListener('change', function() {
	if (containerButtonClick.checked) {
		changeWord.innerText = 'Selesai dibaca';
	} else {
		changeWord.innerText = 'Belum selesai dibaca';
	}
});

const bookId = () => {
	return +new Date();
}

const generateBookObj = (id, title, author, year, isCheckBook) => {
	return {
		id,
		title,
		author,
		year,
		isCheckBook,
	}
}

const addBook = () => {
	const bookID = bookId();
	const titleBook = document.getElementById('inputBookTitle').value;
	const authorBook = document.getElementById('inputBookAuthor').value;
	const yearBook = document.getElementById('inputBookYear').value;
	const checkBook = document.getElementById('inputBookIsComplete').checked;

	const bookObj = generateBookObj(bookID, titleBook, authorBook, yearBook, checkBook);
	books.push(bookObj);

	alert(`Buku dengan judul ${bookObj.title} berhasil ditambahkan`);

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBooks();
}

const makeBook = (bookObj) => {
	const fillTitleBook = document.createElement('h3');
	fillTitleBook.innerText = bookObj.title;

	const fillAuthorBook = document.createElement('p');
	fillAuthorBook.innerText = `Penulis: ${bookObj.author}`;

	const fillYearBook = document.createElement('p');
	fillYearBook.innerText = `Tahun: ${bookObj.year}`;
	

	const fillContainer = document.createElement('article');
	fillContainer.classList.add('book_item');
	fillContainer.append(fillTitleBook, fillAuthorBook, fillYearBook);
	fillContainer.setAttribute('id', `book-${bookObj.id}`);

	const makeContainer = document.getElementById('incompleteBookshelfList');
	makeContainer.append(fillContainer);

	if (bookObj.isCheckBook) {
		const unfinishButton = document.createElement('button');
		unfinishButton.classList.add('green');
		unfinishButton.innerText = 'Belum Selesai dibaca';

		unfinishButton.addEventListener('click', function() {	
			unfinishBookFromCompleted(bookObj.id);	
		});

		const trashButton = document.createElement('button');
		trashButton.classList.add('red');
		trashButton.innerText = 'Hapus buku';

		trashButton.addEventListener('click', function() {
			removeBookFromCompleted(bookObj.id);
		});
		const bookAction1 = document.createElement('div');
		bookAction1.classList.add('action');
		bookAction1.append(unfinishButton, trashButton);

		fillContainer.append(bookAction1)
	} else {
		const finishButton = document.createElement('button');
		finishButton.classList.add('green');
		finishButton.innerText = 'Selesai dibaca';

		finishButton.addEventListener('click', function() {
			addBookToCompleted(bookObj.id);
		});
		const trashButton2 = document.createElement('button');
		trashButton2.classList.add('red');
		trashButton2.innerText = 'Hapus buku';

		trashButton2.addEventListener('click', function() {
			removeBookFromCompleted(bookObj.id);
		});
		const bookAction2 = document.createElement('div');
		bookAction2.classList.add('action');
		bookAction2.append(finishButton, trashButton2);

		fillContainer.append(bookAction2);
	}

	return fillContainer;
}

const addBookToCompleted = (bookId) => {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;
	bookTarget.isCheckBook = true;	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBooks();
}

const findBook = (bookId) => {
	for (const booksItem of books) {
		if (booksItem.id === bookId) {
			return booksItem;
		}
	}
	return null;
}

const removeBookFromCompleted = (bookId) => {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	const confirmRemove = confirm(`Yakin ingin menghapus buku ?`);
	if (confirmRemove !== false) {
		books.splice(bookTarget, 1);		
		document.dispatchEvent(new Event(RENDER_EVENT));	
		saveDataBooks();
		alert('Buku sedang sedang proses dihapus dari rak, klik oke untuk menyelesaikan...');
	} else {
		alert('Batal menghapus buku...');
		return -1;
	}
}

const unfinishBookFromCompleted = (bookId) => {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;

	bookTarget.isCheckBook = false;	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBooks();
}

const findBookIndex = (bookId) => {
	for (const bookIndex in books) {
		if (books[bookIndex].id === bookId) {
			return bookIndex;
		}
	}
	return -1;
}

const searchBooksButton = document.getElementById('searchSubmit');
searchBooksButton.addEventListener('click', function(event) {
	event.preventDefault();

	const searchBooks = document.getElementById('searchBookTitle').value.toLowerCase();
	const booksListItem = document.querySelectorAll('.book_item > h3');
	for (bookItem of booksListItem) {
		if (searchBooks !== bookItem.innerText.toLowerCase()) {	
			bookItem.parentElement.style.display = "none";	
		} else {
			bookItem.parentElement.style.display = "block";			
		}
	}
});

const SAVED_EVENT_BOOKS = 'saved-book';
const STORAGE_BOOKS_KEY = 'BOOKSHELF_APPS';

const saveDataBooks = () => {
	if (isStorageBooksExist()) {
		const parsedBooks = JSON.stringify(books);
		localStorage.setItem(STORAGE_BOOKS_KEY, parsedBooks);
		document.dispatchEvent(new Event(SAVED_EVENT_BOOKS));
	}
}

const isStorageBooksExist = () => {
	if (typeof (Storage) === undefined) {
		alert('Maaf, ternyata browser kamu tidak mendukung penyimpanan lokal');
		return false;
	}
	return true;
}

const loadBookFromstorage = () => {
	const bookSeriesItem = localStorage.getItem(STORAGE_BOOKS_KEY);
	let booksData = JSON.parse(bookSeriesItem);

	if (booksData !== null) {
		for (const book of booksData) {
			books.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}
