const ViewSearchHistory = document.querySelector("#ViewSearchHistory");

ViewSearchHistory.addEventListener("click", () => {
  window.location.href = "history.html";
});

const form = document.querySelector("form");
const input = document.querySelector("input");
const resultsDiv = document.querySelector("#results");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedSearchTerm}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // display book results
      resultsDiv.innerHTML = `<h2>Book Results For '${searchTerm}'</h2>`;
      console.log("data", data);

      data.items.forEach((book) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors
          ? book.volumeInfo.authors.join(", ")
          : "Unknown";
        const pageCount = book.volumeInfo.pageCount
          ? book.volumeInfo.pageCount
          : "Unknown";
        const publisher = book.volumeInfo.publisher
          ? book.volumeInfo.publisher
          : "Unknown";
        const image = book.volumeInfo.imageLinks
          ? book.volumeInfo.imageLinks.thumbnail
          : "https://via.placeholder.com/150x200";
        const buyLink = book.saleInfo.buyLink ? book.saleInfo.buyLink : "#";

        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
                    <h3>${title}</h3>
                    <img src="${image}" alt="${title} book cover">
                    <p>Author(s): ${authors}</p>
                    <p>Page count: ${pageCount}</p>
                    <p>Publisher: ${publisher}</p>
                    <a href="${buyLink}" target="_blank"><button>Buy Now</button></a>
                `;

        resultsDiv.appendChild(bookDiv);
      });

      // store search term in localStorage
      saveSearch(searchTerm, data);
      //   localStorage.setItem("lastSearch", searchTerm);
    })
    .catch((error) => {
      console.error(error);
    });
});

// // check if there is a last search term in localStorage and display results
// const lastSearch = localStorage.getItem("lastSearch");
// if (lastSearch) {
//   input.value = lastSearch;
//   form.dispatchEvent(new Event("submit"));
// }

function saveSearch(searchTerm, data) {
  const timestamp = new Date();
  console.log(searchTerm, timestamp, data);
  let searches = localStorage.getItem("bookSearches");
  searches = searches ? JSON.parse(searches) : [];

  searches.unshift([
    { searchTerm: searchTerm, timestamp: timestamp, data: data },
  ]);
  localStorage.setItem("bookSearches", JSON.stringify(searches));
}
