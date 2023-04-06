/* eslint-disable prefer-const */
/* eslint-disable no-else-return */
// Memanggil NanoId
const {nanoid} = require('nanoid');
// Mengekspor Bookshelf
const books = require('./books');

// Handler untuk menambahkan buku
const savingBookHandler = (request, h) => {
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	let finished = false;
	if (pageCount === readPage) {
		finished = true;
	}
	if (name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}
	// Ketika halaman terbaca lebih besar dari jumlah halaman
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	const newBook = {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		id,
		insertedAt,
		updatedAt,
		finished,
	};

	// Menambahkan nilai NewBookshelf ke Bookshelf
	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	// Ketika berhasil
	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}
};

// Handler untuk menampilkan semua buku
const getAllBooksHandler = (request, h) => {
	const newBooks = books.map(({id, name, publisher}) => {
		return {id, name, publisher};
	});
	const {name, reading, finished} = request.query;
	const bookByName = books.filter((book) => {
		let bookName = `${book.name}`.toLowerCase();
		let bookNameQuery = `${name}`.toLowerCase();
		return bookName.includes(bookNameQuery);
	});
	const readingBook = books.find((book) => book.reading === true);
	const unreadingBook = books.find((book) => book.reading === false);
	const finishedReadingBook = books.find((book) => book.finished === true);
	const unfinishedReadingBook = books.find((book) => book.finished === false);

	if (name !== undefined) {
		return {
			status: 'success',
			data: {
				bookByName,
			},
		};
	}
	if (reading === 1) {
		return {
			status: 'success',
			data: {
				readingBook,
			},
		};
	} else if (reading === 0) {
		return {
			status: 'success',
			data: {
				unreadingBook,
			},
		};
	}
	if (finished === 1) {
		return {
			status: 'success',
			data: {
				finishedReadingBook,
			},
		};
	} else if (finished === 0) {
		return {
			status: 'success',
			data: {
				unfinishedReadingBook,
			},
		};
	}
	return {
		status: 'success',
		data: {
			books: newBooks,
		},
	};
};

// Handler untuk menampilkan detail buku menggunakan ID
const getBookByIdHandler = (request, h) => {
	const {bookId} = request.params;
	const book = books.filter((b) => b.bookId === bookId)[0];

	if (book === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		});
		response.code(404);
		return response;
	}
	const response = h.response({
		status: 'success',
		data: {
			book,
		},
	});
	response.code(200);
	return response;
};

// Handler untuk mengubah data buku
const editBookByIdHandler = (request, h) => {
	const {id} = request.params;
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === id);

	// Bila user tidak mengisi nilai name
	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}
	// Bila nilai halaman terbaca lebih besar dari jumlah halaman
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}
	// Bila ID tidak ditemukan
	if (index === -1) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	}
};

// Handler untuk menghapus buku
const deleteBookByIdHandler = (request, h) => {
	const {id} = request.params;
	const index = books.findIndex((book) => book.id === id);

	// Bila ID tidak ditemukan
	if (index === -1) {
		const response = h.response({
			status: 'fail',
			message: 'Buku gaagl dihapus. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}
};

module.exports = {savingBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
