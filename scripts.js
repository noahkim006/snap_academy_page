/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

const FRESH_PRINCE_URL =
  "https://upload.wikimedia.org/wikipedia/en/3/33/Fresh_Prince_S1_DVD.jpg";
const CURB_POSTER_URL =
  "https://m.media-amazon.com/images/M/MV5BZDY1ZGM4OGItMWMyNS00MDAyLWE2Y2MtZTFhMTU0MGI5ZDFlXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_FMjpg_UX1000_.jpg";
const EAST_LOS_HIGH_POSTER_URL =
  "https://static.wikia.nocookie.net/hulu/images/6/64/East_Los_High.jpg";

// This is an array of strings (TV show titles)
let titles = [
  "Fresh Prince of Bel Air",
  "Curb Your Enthusiasm",
  "East Los High",
];
// Your final submission should have much more data than this, and
// you should use more than just an array of strings to store it all.



// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", extractDataFromCSV);

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  );
}

function removeLastCard() {
  titles.pop(); // Remove last item in titles array
  showCards(); // Call showCards again to refresh
}



//============================================================================================================
//============================================================================================================
//============================================================================================================
// ALL CODE ABOVE THIS WILL BE EDITED OR REMOVED -- CAME WITH THE FILE TEMPLATE 



// TODO: create a tree of pets for O(log(n)) search speed --  need to implement search bar & feature 
//       maybe save data as a hash table for O(1) lookup time, but idk what to put as the key??
const pets = [];

function extractDataFromCSV() {
  fetch("pets.csv")
    .then(response => {
      if(!response.ok) {
        console.log("ERROR READING DATA FROM FILE");
        throw new Error("Reading File Failed");
      }
      return response.text();
    })
    .then((csvFile) => {
      const csvRows = csvFile.split('\n');
      const csvHeaders = csvRows[0].split(',');

      //start at index 1 since first row of CSV is header values 
      for(let i = 1; i < csvRows.length; i++) {
        const petValues = csvRows[i].split(',');
        const petObject = {};

        for(let j = 0; j < petValues.length; j++) {
          petObject[csvHeaders[j]] = petValues[j];
        }
        pets.push(petObject);
      }
      //console.log(csvHeaders);  
      showCards();

    })
    .catch(error => console.error("ERROR FETCHING FILE", error));
}


function editCardContent(card, newImageURL, petObject) {

  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  console.log(petObject.petName);
  cardHeader.textContent = petObject.petName;

  const cardImage = card.querySelector("img");
  cardImage.src = newImageURL;
  cardImage.alt = "Picture of " + petObject.petName + " the " + petObject.animalType;

  const cardUnorderedList = card.querySelector("ul");
  const cardListElements = cardUnorderedList.querySelectorAll("li");

  console.log(petObject.petAge);
  cardListElements[0].textContent = String(petObject.petAge);
  cardListElements[1].textContent = String(petObject.breed);
  
}

function showCards() {

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML =  "";
  const template = document.querySelector(".card");

  for(let i = 0; i < pets.length; i++) {
    let currentPet = pets[i];

    let imageURL = currentPet.imageURL;
    const card = template.cloneNode(true);
    editCardContent(card, imageURL, currentPet);
    cardContainer.appendChild(card);
  }
}
