/**********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 * 
 * Name: JIHYUN NAM Student ID: 130641210 Date: 2nd FEB, 2023
 * 
 * ********************************************************************************/
 
// Page number
let page = 1;

// Items per page
const perPage = 10;

// Loading The Data
function loadMovieData(title = null) {
    let url = title 
    ? `https://fair-plum-cocoon-slip.cyclic.app/api/movies?page=1&perPage=${perPage}&title=${title}` 
    : `https://fair-plum-cocoon-slip.cyclic.app/api/movies?page=${page}&perPage=${perPage}`

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);

        // Creating the <tr> Elements
            let movieRows = `
            ${data.map(movie => (
                `<tr data-id=${movie._id}>
                    <td>${movie.year}</td>
                    <td>${movie.title}</td>
                    <td>${movie.plot ? movie.plot : "N/A"}</td>
                    <td>${movie.rated ? movie.rated : "N/A"}</td>
                    <td>${movie.runtime? Math.floor(movie.runtime/60) + ":" + (movie.runtime % 60).toString().padStart(2,'0') : "0:0" }</td>
                </tr>`
            )).join('')}
            `;              // Array

        // Adding <tr> Elements to the Table
        document.querySelector('#moviesTable tbody').innerHTML = movieRows;

        // Controlling pagination
        const element = document.getElementById('paginations');
        if(title) {    
            element.classList.add('d-none');
        } else {
            element.classList.remove('d-none')
        }

        // Updating the "Current Page"
        document.querySelector('#current-page').innerHTML = page;

        // Add the "click" event listener to the newly created rows
        document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
            row.addEventListener('click', (e) => {
                let clickedId = row.getAttribute('data-id');
                // console.log(clickedId);
                let url = `https://fair-plum-cocoon-slip.cyclic.app/api/movies/${clickedId}`;

                fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data);
                    let movieDetails;

                    if(data.poster) {
                        movieDetails = `
                        <img class="img-fluid w-100" src=${data.poster} /><br /> <br />
                        <strong>Directed By:</strong>  ${data.directors.join(',')} <br /><br />
                        <p>${data.fullplot}</p>
                        <strong>Cast:</strong> ${data.cast? data.cast.join(",") : "N/A"} <br /><br />
                        <strong>Awards:</strong> ${data.awards.text} <br />
                        <strong>IMDB Rating:</strong>${data.imdb.rating} (${data.imdb.votes} votes)
                        `
                        ;
                    } else {
                        movieDetails = `
                        <strong>Directed By:</strong>  ${data.directors.join(',')} <br /><br />
                        <p>${data.fullplot}</p>
                        <strong>Cast:</strong> ${data.cast? data.cast.join(",") : "N/A"} <br /><br />
                        <strong>Awards:</strong> ${data.awards.text} <br />
                        <strong>IMDB Rating:</strong>${data.imdb.rating} (${data.imdb.votes} votes)
                        `
                        ;
                    }

                    //  Open Modal Windows
                    document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
                    document.querySelector('#detailsModal .modal-body').innerHTML = movieDetails;

                    let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                        backdrop: 'static',
                        keyboard: false,
                    });

                    modal.show();
                });
            });
        });
    });
}

// Execute when the DOM is 'ready'
document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        // populate the movie table with the title value
        loadMovieData(document.querySelector('#title').value);
    });

    document.querySelector('#clearForm').addEventListener('click', function(e) {
        // reset page number
        page  = 1;
        // clear searchForm
        document.querySelector('#title').value = "";
        // populate the movie table newly
        loadMovieData();
    });

    // Click event for the "previous page" pagination button
    document.querySelector("#previous-page").addEventListener("click", function(e) {
        if(page > 1) {
            page --;
            loadMovieData();
        } 
    });

    // Click event for the "next page" pagination button
    document.querySelector("#next-page").addEventListener("click", function(e) {
        
        page ++;
        loadMovieData();
    
    });

});

