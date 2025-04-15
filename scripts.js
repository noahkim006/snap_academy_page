//I DONT THINK NEED MORE THAN A MAP SINCE CAN ASSOCIATE THE OBJECT WITH THE HTML ELEMENT
const pets = [];

//extracts data from CSV as soon as page loaded
document.addEventListener("DOMContentLoaded", extractDataFromCSV);

//if popupContainer is present and click anywhere NOT in the popup, clear it from the screen
const popupContainer = document.getElementById("pet-popup-container");
window.onclick = function(e) {

  if(e.target == popupContainer) {
    popupContainer.style.display = "none";
  }
}

//reload all cards using original array, which should  be unaffected the entire time
function resetCards() {

  showCards(pets);
}

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
        petObject["timeSpent"] = inDateToTimeSpent(petObject.inDate); //creating a new value associated with each pet that was not included in the CSV

        // console.log(petObject);
        pets.push(petObject);
      }
      showCards(pets);
    })
    .catch(error => console.error("ERROR FETCHING FILE", error));
}



function editCardContent(card, petObject) {

  card.style.display = "block";

  card.value = petObject;
  const cardHeader = card.querySelector("h2");

  cardHeader.textContent = petObject.petName.replace("*", "").replace(" ", ""); //get rid of unneccessary white spaces and asterisk that came with data in CSV

  const cardImage = card.querySelector("img");
  cardImage.src = petObject.petImage;
  cardImage.alt = "Picture of " + petObject.petName + " the " + petObject.animalType;
  
  const cardPetInfo = card.querySelector("p");
  
  cardPetInfo.textContent = petObject.animalID;
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

function loadMorePetInfo(petObject) {

  const popupContainer = document.getElementById("pet-popup-container");
  const popupContentList = popupContainer.querySelector("ul");
  const popupContentListElement = popupContentList.querySelectorAll("li");

  const popupContainerImg = popupContainer.querySelector("img");
  popupContainerImg.src = petObject.petImage;

  popupContentListElement[0].textContent = "Name: " + petObject.petName.replace("*", "");
  popupContentListElement[1].textContent = "Age: " + petObject.petAge;
  popupContentListElement[2].textContent = "Breed: " + petObject.breed;
  popupContentListElement[3].textContent = "Time Spent In Shelter: " + Math.trunc(petObject.timeSpent) + " days";

  let genderString;
  //find if there is a better way to do this, prob can use conditional operator when initally loading CSV data 
  if(petObject.petGender === "M") {
    genderString = "Male (Not Neutered)";
  } else if (petObject.petGender === "F") {
    genderString = "Female (Not Spayed)";
  } else if (petObject.petGender === "N") {
    genderString = "Male (Neutered)";
  } else if (petObject.petGender === "S") {
    genderString = "Female (Spayed)";
  } else {
    genderString = "Unknown";
  }

  popupContentListElement[4].textContent = "Gender: " + genderString;

  popupContainer.style.display = "block";
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

function inDateToTimeSpent(inDateAsString) {

  const today = new Date();
  
  const inDateValues = inDateAsString.split('/'); //inDate array is defined as [MONTH, DAY, YEAR]

  //need to subtract month by one since monthIndex in the Date constructor starts at index 0 for January
  //the monthIndex passed in through inDateValue does not account for this so need to manually do it 
  const inDate = new Date(inDateValues[2], inDateValues[0] - 1, inDateValues[1]); 

  // subtracting 2 Date objects returns the time difference in milliseconds, change into time difference in days for easier reference - can change this later if needed 
  const timeSpent = (today - inDate) / (1000 * 60 * 60 * 24);

  return timeSpent;
}

function findSearchValue(value) {

  //if the inputted value is empty just show original data set 
  if(!value.length) {
    showCards(pets);
    return;
  }
  //use trim and replace to get rid of any white spaces and asterisk in og and inputted names - make them me same case
  const inputtedName = value.toUpperCase().trim().replace(" ", "");
  let searchedValArray = [];
  for(let i = 0; i < pets.length; i++) {
    if(pets[i].petName.replace("*", "").replace(" ", "") == inputtedName) {
      searchedValArray.push(pets[i]);
    }
    console.log(inputtedName);
    console.log(pets[i].petName);
  }
  showCards(searchedValArray);
}

// implement quickSort algorithm for sorting pets by in date 
function sortByInDate(filterOption) {

  let petCopy = pets.slice(0); //without creating a copy, the sort would work on the original dataset, changing how ALL filter works after it the sort is run
  quickSort(petCopy, 0, pets.length - 1, filterOption);
  showCards(petCopy);
  
}

function quickSort(array, lowIndex, highIndex, filterOption) {

  if(lowIndex < highIndex) {
    const partition = findPartition(array, lowIndex, highIndex, filterOption);

    quickSort(array, lowIndex, partition - 1, filterOption);
    quickSort(array, partition + 1, highIndex, filterOption);
  }
}

function findPartition(array, lowIndex, highIndex, filterOption) {

  const pivotCell = array[highIndex].timeSpent;
  let i = lowIndex - 1;

  //probably not the best way of implementation, but i could not think of another option besides defining an entirely differnt funciton for just one thing changed 
  if(filterOption == "mostRecentlyIn") {
    for(let j = lowIndex; j < highIndex; j++) {
      //change the comparision operator for changing the order in which the pets are displayed by indate -- implement a bool function so the user can choose whcih on they sort by
      if(array[j].timeSpent < pivotCell) { 
        i++
        swapArrayElements(array, i, j);
      }
    } 
    swapArrayElements(array, i + 1, highIndex);
    
    return i + 1;

  } else if (filterOption == "oldestIn") {
    for(let j = lowIndex; j < highIndex; j++) {
      //change the comparision operator for changing the order in which the pets are displayed by indate -- implement a bool function so the user can choose whcih on they sort by
      if(array[j].timeSpent > pivotCell) { 
        i++
        swapArrayElements(array, i, j);
      }
    } 
    swapArrayElements(array, i + 1, highIndex);
    
    return i + 1;
    
  }
}

///have to pass in the array since JS cant pass values by reference unlike C++
//objects like arrays are passed by ref. so can edit the array param which makes changes to the original data set
function swapArrayElements(array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}

