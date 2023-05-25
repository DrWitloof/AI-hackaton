// ==UserScript==
// @name         Element Popup Demo
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Demonstration of element popup using Tampermonkey
// @author       Your Name
// @match        https://*.collectandgo.be/*
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/helperfunctions.js
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/openAI.js
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/cookies.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let currentPopup = null;
let currentRecipeContent = null;

// Voeg aangepaste stijlen toe voor de popup
GM_addStyle(`
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 800px;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.popup h2 {
  margin-top: 0;
}

.popup button {
  margin-top: 10px;
}

.popup .content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.popup .ingredient {
  flex: 1;
  margin-right: 20px;
}

.popup .recipe {
  flex: 2;
}
`);

// Functie om de popup weer te geven
function showPopup(plpItem, ingredient, merk) {
  const popup = document.createElement('div');
  popup.className = 'popup';

  const elementInfo = document.createElement('h2');
  elementInfo.textContent = 'Collect and Go Inspirator';
  popup.appendChild(elementInfo);

  const contentContainer = document.createElement('div');
  contentContainer.className = 'content';
  popup.appendChild(contentContainer);

  const ingredientContainer = document.createElement('div');
  ingredientContainer.className = 'ingredient';

  const recipeContainer = document.createElement('div');
  recipeContainer.className = 'recipe';

  contentContainer.appendChild(ingredientContainer);
  contentContainer.appendChild(recipeContainer);

  const ingredientData = document.createElement('span');
  ingredientData.innerHTML = plpItem.outerHTML;
  ingredientContainer.appendChild(ingredientData);

  const recipeButton = document.createElement('button');
  recipeButton.textContent = 'Toon Recept';
  recipeButton.addEventListener('click', function () {
    getRecipe(merk + ' ' + ingredient, '4', '30', '2 volwassenen', 'vegetarisch', 'geen gluten', function (recipe) { toonRecept( merk + ' ' + ingredient, recipe, recipeContainer); });
  });
  popup.appendChild(recipeButton);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.addEventListener('click', function () {
    document.body.removeChild(popup); // Verwijder de popup uit het DOM
    currentPopup = null;
  });
  popup.appendChild(closeButton);

  popup.appendChild(document.createElement('span'));

  const maandagButton = document.createElement('button');
  maandagButton.textContent = 'maandag';
  maandagButton.addEventListener('click', function () {
    console.log("maandagrecept was " + getCookie("maandag"));
    if( currentRecipeContent == null) { console.log("no recipe"); putCookie("maandag",""); }
    else { putCookie("maandag", currentRecipeContent.textContent); }
    console.log("maandagrecept is " + getCookie("maandag"));
  });
  popup.appendChild(maandagButton);

  document.body.appendChild(popup);
  currentPopup = popup;
  let currentRecipeContent = null;
}

function toonRecept(ingredient, recipe, recipeContainer) {
    console.log("toonRecept("+ingredient+", "+recipe+", "+recipeContainer+")");
    console.log("currentRecipeContent : " + currentRecipeContent);
    if( currentRecipeContent == null)
    {
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = 'Recept voor ' + ingredient;
        recipeContainer.appendChild(recipeTitle);

        const recipeContent = document.createElement('pre');
        recipeContent.textContent = recipe.replace(/\n+/g, '\n').replace(/^\n+/, '');
        recipeContent.style.whiteSpace = 'pre-wrap';
        recipeContent.style.overflow = 'auto'; // Voeg deze regel toe
        recipeContent.style.maxHeight = '300px'; // Voeg deze regel toe om een maximale hoogte in te stellen
        recipeContainer.appendChild(recipeContent);

        currentRecipeContent = recipeContent;
    }
    else { currentRecipeContent.textContent = recipe.replace(/\n+/g, '\n'); }
}

// Functie om een recept op te halen op basis van ingrediënten, familiesamenstelling, kooktijd, samenstelling in volwassenen, eetvoorkeuren en beperkingen
function getRecipe(ingredient, familySize, cookingTime, adultComposition, dietaryPreferences, restrictions, callback) {
    const apiKey = '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';
    const prompt = `Stel je voor dat je een chef-kok bent die mensen helpt bij hun dagelijkse kookbehoeften, vergelijkbaar met bekende koks zoals Jeroen Meus en Piet Huysentruit.\
 Geef me alsjeblieft een recept voor een maaltijd dat het ingrediënt "${ingredient}" bevat, geschikt voor ${familySize} personen, waarvan ${adultComposition}.\
 Ik heb slechts ${cookingTime} minuten beschikbaar om te koken. Houd rekening met de volgende voorkeuren en beperkingen: ${dietaryPreferences} en ${restrictions}.\
 Geef me een heerlijk recept met een pakkende titel, een beschrijving van de maaltijd, de geschatte tijdsbesteding, een lijst van benodigde ingrediënten en gedetailleerde instructies.\
 Let op: het is belangrijk dat het recept niet alleen bestaat uit het opgegeven ingrediënt, maar dat het daadwerkelijk gebruikt wordt als een van de ingrediënten in de maaltijd.\
 Graag allemaal in het Nederlands.\n\n`;

    openAI(callback, prompt, apiKey);
}

// Voeg een contextmenugebeurtenisluisteraar toe aan de hele pagina
document.addEventListener('contextmenu', function (event) {
  event.preventDefault(); // Voorkom dat het standaard contextmenu wordt weergegeven

  const clickedElement = event.target;
  const plpItem = findPlpItem(clickedElement);

  if (currentPopup) {
    document.body.removeChild(currentPopup);
    currentPopup = null;
  }

  if (plpItem) {
    const ingredient = getProductName(plpItem);
    const merk = getProductBrand(plpItem);
    console.log(ingredient);
    showPopup(plpItem, ingredient, merk);
  }
});
