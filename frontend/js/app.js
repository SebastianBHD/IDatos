allBooks = [];


function loadBooks() {
    fetch('http://localhost:3000/api/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            allBooks = data;
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function filterBooks() {
    const searchTerm = document.getElementById('searchBar').value;
    console.log('Término de búsqueda:', searchTerm);
    fetch(`http://localhost:3000/api/books/search?search=${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            allBooks = data;
            displayBooks(allBooks);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function displayBooks(books) {
    const bookGrid = document.getElementById('bookGrid');
    bookGrid.innerHTML = '';

    books.forEach(book => {

        const bookElement = document.createElement('div');
        bookElement.className = 'book-card';
        const imageUrls = [book.image_url_l, book.image_url_m, book.image_url_s];

        const checkImageSize = (urlIndex) => {
            if (urlIndex >= imageUrls.length) {
                let bookImage = 'https://via.placeholder.com/200x300/cccccc/ffffff?text=No+Image';
                return bookImage;
            }

            const img = new Image();
            img.src = imageUrls[urlIndex] || '';

            return new Promise((resolve) => {
                img.onload = () => {
                    if (img.naturalWidth >= 50 && img.naturalHeight >= 50) {
                        resolve(imageUrls[urlIndex]);
                    } else {
                        resolve(checkImageSize(urlIndex + 1));
                    }
                };

                img.onerror = () => {
                    resolve(checkImageSize(urlIndex + 1));
                };
            });
        };

        checkImageSize(0).then((validImageUrl) => {

            const imgElement = document.createElement('img');
            imgElement.src = validImageUrl;
            imgElement.alt = book.book_title;

            bookElement.innerHTML = `
            <div class="book-info">
                <h3>${book.book_title}</h3>
                <p><span class="label">Author:</span> ${book.book_author}</p>
                <p><span class="label">Year of Publication:</span> ${book.year_of_publication}</p>
                <p><span class="label">Editorial:</span> ${book.publisher}</p>
                <p><span class="label">Rating:</span> ${book.promedio_rating}</p>
            </div>
            `;
            bookElement.insertBefore(imgElement, bookElement.firstChild);
            bookGrid.appendChild(bookElement);
        });
    });
}


function loadMoreBooks() {
    loadBooks();
}
function loadFilterBooks() {
    filterBooks();
}
