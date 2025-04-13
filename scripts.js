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
        petObject["timeSpent"] = inDateToTimeSpent(petObject.inDate);
        console.log(petObject);
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

  card.value = petObject.petName;
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
  cardListElements[2].textContent = "In Date: " + petObject.inDate;
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
  showCards(pets); //reload page - updates UI
}

function sortByAnimalType(animalType) {
  
  const sortedPetsByType = [];

  for(let i = 0; i < pets.length; i++) {
    let currentPet = pets[i];
    if(currentPet.animalType == animalType) {
      sortedPetsByType.push(currentPet);
    }
  }

  showCards(sortedPetsByType);
}


//CHANGE THIS FUCNTION TO WORK WITH THE PARAMETER PASSED IN 
function inDateToTimeSpent(inDateAsString) {
  // console.log(pets[1].inDate);

  //const inDateAsString = pets[2].inDate; 
  const today = new Date();

  // const day = String(today.getDate()).padStart(2, '0');
  // const month = String(today.getMonth() + 1).padStart(2, '0'); // have to add one since month starts at 0 like an
  // const year = today.getFullYear();
  
  const inDateValues = inDateAsString.split('/'); //inDate array is defined as [MONTH, DAY, YEAR]


  //need to subtract month by one since monthIndex in the Date constructor starts at index 0 for January
  //the monthIndex passed in through inDateValue does not account for this so need to manually do it 
  const inDate = new Date(inDateValues[2], inDateValues[0] - 1, inDateValues[1]); 

  // console.log(today);
  // console.log(inDate);

  // subtracting 2 Date objects returns the time difference in milliseconds, change into time difference in days for easier reference - can change this later if needed 
  // console.log((today - inDate) / (1000 * 60 * 60 * 24)); 

  const timeSpent = (today - inDate) / (1000 * 60 * 60 * 24);
  return timeSpent;



  // figure out how this function  is going to handle the time spent
  // need to handle cases where certain months have more days than another and account animals that were dropped off in years that are not the current
}

function sortByInDate() {

  const sortedByInDate= [];
  
}