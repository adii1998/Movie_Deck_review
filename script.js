// to store movies data
let movies = [];
//store page number
let currentPage = 1;

const API_KEY = 'f531333d637d0c44abc85b3e74db2186'

const movieList = document.getElementById('movies-list');

// Step 1
async function fetchMovies(page){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);

      const  result = await response.json();
      movies = result.results;

    //   console.log(result);

        renderMovies(movies);
         

    }catch(error){
        console.log(error)
    }
    
}

fetchMovies(currentPage)

function getMovieNamesFromLocalStorage(){
    const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

    // console.log('favouriteMovies',favouriteMovies)

    return favouriteMovies === null ? [] : favouriteMovies;
}

//getMovieNamesFromLocalStorage()
function addMovieNameToLocalStorage(movieName){
    //add movie name to local storage
    const favMoviesName =  getMovieNamesFromLocalStorage();
    //localStorage.setItem (key,data)
    localStorage.setItem("favouriteMovies", JSON.stringify([...favMoviesName,movieName]));
    
}

function removeMovieNameFromLocalStorage(movieName){
    const favMoviesName =  getMovieNamesFromLocalStorage();

    let filteredMoviesNames = favMoviesName.filter((movie) => movie != movieName);

    localStorage.setItem("favouriteMovies",JSON.stringify(filteredMoviesNames))
}

//Step 2

const renderMovies = (movies) => {
    
  
     const favMoviesName =  getMovieNamesFromLocalStorage();

     movieList.innerHTML ="";

     movies.map((movie) =>{
        // console.log(movie);

        const {poster_path, title, vote_count, vote_average} = movie;

        let listItem = document.createElement('li');
        
        listItem.className = 'card';
         
        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}`: "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png"
         

        listItem.innerHTML += `
        
        <img
             class="poster"
             src=${imgSrc}
             alt=${title}
        />

        <p class="title">${title}</p>


        <section class="vote-favoriteIcon">
        <section class="vote">
            <p class="vote-count">Votes: ${vote_count}</p>
            <p class="vote-average">Rating: ${vote_average}</p>
        </section>
        <i class="favourite-icon ${favMoviesName.includes(title) ? "fa-solid" : null}
        fa-regular fa-heart fa-2xl" id="${title}"></i>
    </section>

        `;


        const favouriteIconBtn = listItem.querySelector('.favourite-icon');

        favouriteIconBtn.addEventListener('click', (event) => {
            // console.log(event.target)
            const { id } = event.target;
           console.log(id)

           if(favouriteIconBtn.classList.contains("fa-solid")){
            //remove the movie name from the local storage and from favourite array
            removeMovieNameFromLocalStorage(id)
          // remove this class from favouriteIconBtn
          favouriteIconBtn.classList.remove("fa-solid");
      }else{
            //add the movie name from the local storage and from favourite array
            addMovieNameToLocalStorage(id)
            favouriteIconBtn.classList.add("fa-solid");
           // add this class from favouriteIconBtn
      }
         
        })
    
        
        movieList.appendChild(listItem);

     })
}
//Sort by date
const sortByDateButton = document.getElementById('sort-by-date');

sortByDateButton.addEventListener("click",sortByDate);

let firstSortByDateClicked = true;
function sortByDate(){
    let sortedMovies;

    if(firstSortByDateClicked){
        sortedMovies = movies.sort(function (a, b){

            return new Date(a.release_date) - new Date(b.release_date)

        });
   
 
      sortByDateButton.textContent = "Sort by date (latest to oldest)";

      firstSortByDateClicked = false
    }else if(!firstSortByDateClicked){

    sortedMovies = movies.sort(function(a, b){
        return new Date(b.release_date)- new Date(a.release_date)
    });
    sortByDateButton.textContent = "Sort by date (oldest to latest)";
     firstSortByDateClicked = true;


       console.log(sortedMovies);
 }
   

 

 

    renderMovies(sortedMovies);
}

//Sort by rating
const sortByRatingButton = document.getElementById('sort-by-rating');

let firstSortByRatingClicked = true;

function sortByRating(){
 let sortedMovies;

 if(firstSortByRatingClicked){
    //use sort function to create a new array of movie sorted based on votr average on ascending order
    sortedMovies = movies.sort(function(a,b){
        return a.vote_average - b.vote_average;
    })
    sortByRatingButton.textContent = "Sort by rating (most to least)";
    firstSortByRatingClicked = false;
 }else if (!firstSortByRatingClicked){
        //use sort function to create a new array of movie sorted based on votr average on ascending order
        sortedMovies = movies.sort(function(a,b){
            return b.vote_average - a.vote_average;
        })
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        firstSortByRatingClicked = true;
 }
 renderMovies(sortedMovies);
}

sortByRatingButton.addEventListener('click', sortByRating)

//pagination element

const pagnination = document.querySelector("div.pagnination");
const prevButton = document.querySelector("button#prev-button")
const pageNumberButton = document.querySelector("button#page-number-button");
const nextButton = document.querySelector("button#next-button");

prevButton.addEventListener('click', () =>{
       //decrease the current page by 1;
       currentPage --;

       //fetch the movies for the previous page

       fetchMovies(currentPage);

       //update the page number button text

       pageNumberButton.textContent = `Current Page: ${currentPage}`;

       //Disable the previous button when the current page is 1
       
       if(currentPage === 1){
        prevButton.disabled = true;
        nextButton.disabled = false;
       }else if(currentPage === 2){
        prevButton.disabled = false;
        nextButton.disabled = false;
       }
} );


nextButton.addEventListener('click', () =>{
    //increase the current page by 1
    currentPage ++;

    //fetch the movies based on current page
    fetchMovies(currentPage);

    //update the page number button

    pageNumberButton.textContent = `Current Page: ${currentPage}`;

    //Disable the next button when the current page is 3

    if(currentPage === 30){
        prevButton.disabled = false;
        nextButton.disabled = true;
    }else if(currentPage ===2){
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
})

//search by movie name API response

const searchMovies = async (searchedMovie) =>{
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json(); 
        movies = result.results;
        renderMovies(movies);
    }catch(error){
        console.log(error);
    }
}

//Search element
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');

  searchButton.addEventListener('click', () =>{
    searchMovies(searchInput.value);
    pagnination.style.dispaly = 'none';
  })

const allTab = document.getElementById("all-tab");

const favouritesTab = document.getElementById('favourites-tab');

const sortBtns = document.querySelector('.sorting-options');

//switch between tabs

const getMovieByName = async (movieName) => {
    console.log('movieName', movieName);
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`)
        const result = await response.json();

        // console.log(result);
        return result.results[0];
    }catch(error){
        console.log(error);
    }
}

const showFavourites = (favMovie) => {
    console.log(favMovie);
    const {poster_path , title , vote_average , vote_count} = favMovie;

    let listItem = document.createElement('li');
        
    listItem.className = 'card';
     
    let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}`: "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png"
     

    listItem.innerHTML += `
    
    <img
         class="poster"
         src=${imgSrc}
         alt=${title}
    />

    <p class="title">${title}</p>


    <section class="vote-favoriteIcon">
    <section class="vote">
        <p class="vote-count">Votes: ${vote_count}</p>
        <p class="vote-average">Rating: ${vote_average}</p>
    </section>
    <i class="favourite-icon fa-solid fa-xmark fa-heart fa-2xl xmark" id="${title}"></i>
</section>

    `;

    const removeFromWishListBtn = listItem.querySelector(".xmark");

    removeFromWishListBtn.addEventListener('click', (event) => {
        const {id} = event.target;

        removeMovieNameFromLocalStorage(id);
        fetchWishListMovies();
    })

    movieList.appendChild(listItem);
}


const fetchWishListMovies = async () =>{
     movieList.innerHTML ="";

     const movieNameList = getMovieNamesFromLocalStorage();

     for(let i=0; i<movieNameList.length; i++){
        const movieName = movieNameList[i];

        let movieDataFromName = await getMovieByName(movieName);
        showFavourites(movieDataFromName);
     }
}
//will display in based on active tab
function displayMovies(){

    if(allTab.classList.contains("active-tab")){
        renderMovies(movies);
    }else if(favouritesTab.classList.contains("active-tab")){
        fetchWishListMovies();
        sortBtns.style = "revert";
        pagnination.style = "revert";
    }
}
function switchTab(event){
    //remove the active-tabs class from both the tabs
    allTab.classList.remove("active-tab");
    favouritesTab.classList.remove("active-tab");

    //add the active-tab class to the click tab

    event.target.classList.add("active-tab");

    //display the movies for that tab
    displayMovies();
}

allTab.addEventListener('click', switchTab);
favouritesTab.addEventListener('click', switchTab)