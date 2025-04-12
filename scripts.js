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


//============================================================================================================
//============================================================================================================
//============================================================================================================
// ALL CODE ABOVE THIS WILL BE EDITED OR REMOVED -- CAME WITH THE FILE TEMPLATE 



// TODO: create a tree of pets for O(log(n)) search speed --  need to implement search bar & feature 
//       maybe save data as a hash table for O(1) lookup time, but idk what to put as the key??
const pets = [];
//const petTypeOptions = new Set();

const mapOfPets = new Map();

function test() {
  const reader = new FileReader();
  reader.readAsText("pets.csv");

  console.log(reader);
}

//extracts data from CSV as soon as page loaded
document.addEventListener("DOMContentLoaded", extractDataFromCSV);

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
          petObject[csvHeaders[j]] = petValues[j]; // since header and petValues are parallel, can use one index to loop through both
        }
        pets.push(petObject);
        //petTypeOptions.add(petObject.animalType);
      }
      //console.log(csvHeaders);  
      showCards(pets);

    })
    .catch(error => console.error("ERROR FETCHING FILE", error));
}


function editCardContent(card, petObject) {

  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  //console.log(petObject.petName);
  cardHeader.textContent = petObject.petName.replace("*", "").replace(" ", ""); //get rid of unneccessary white spaces and asterisk that came with data in CSV

  const cardImage = card.querySelector("img");
  cardImage.src = petObject.petImage;
  cardImage.alt = "Picture of " + petObject.petName + " the " + petObject.animalType;

  const cardUnorderedList = card.querySelector("ul");
  const cardListElements = cardUnorderedList.querySelectorAll("li");

  //console.log(petObject.petAge);

  //hard coding this because easier than to loop through a list of 2 elements
  //change this to a loop if need more list elements inside the card, but realistically just have the card redirect to a page holding more information about the pet itself
  cardListElements[0].textContent = "Age: " + petObject.petAge;  
  cardListElements[1].textContent = "Breed: " + petObject.breed;
}

function showCards(petsList) {

  //console.log(petTypeOptions);
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML =  "";
  const template = document.querySelector(".card");

  for(let i = 0; i < petsList.length; i++) {
    let currentPet = petsList[i];

    const card = template.cloneNode(true);
    editCardContent(card, currentPet);
    cardContainer.appendChild(card);
  }
}

function removeLastCard() {

  pets.pop();  //removes the last thing in the array
  showCards(); //reload page - updates UI
}

function sortByAnimalType(animalType) {
  
  //console.log(animalType);
  const sortedPetsByType = [];
  //console.log(pets);
  for(let i = 0; i < pets.length; i++) {
    let currentPet = pets[i];
    if(currentPet.animalType == animalType) {
      sortedPetsByType.push(currentPet);
    }
  }
  //console.log(sortedPetsByType);
  showCards(sortedPetsByType);
}