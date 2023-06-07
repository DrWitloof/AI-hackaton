// ==UserScript==
// @name         Recepten Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toont een overlay met recepten wanneer je met de rechtermuisknop klikt op de website.
// @author       Jouw Naam
// @match        https://*.collectandgo.be/*
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/helperfunctions.js
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/openAI.js
// @require      https://raw.githubusercontent.com/DrWitloof/AI-hackaton/main/cookies.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let currentPopup = null;

const apiKey = '';

// Voeg aangepaste stijlen toe voor de popup
GM_addStyle(`
.popup {
  position: fixed;
  top: 0%;
  left: 0%;
  // transform: translate(-50%, -50%);
  background-color: white;
  width: 80%;
  max-width: 800px;
  height: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup h2 {
  margin-top: 0;
}

.popup button {
  margin-top: 10px;
}

.popup .content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.popup .block-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}
.popup .block-container pre { overflow: auto; height: 200px;  width: 200px;}
.popup .block-container textarea { overflow: auto; height: 180px;  width: 200px;}
`);

// Functie om de popup weer te geven
function showPopup() {
    console.log("showPopup()");
    const popup = document.createElement('div');
    popup.className = 'popup';

    const elementInfo = document.createElement('h2');
    elementInfo.textContent = 'Collect and Go Inspirator';
    popup.appendChild(elementInfo);

    const contentContainer = document.createElement('div');
    contentContainer.className = 'content';
    popup.appendChild(contentContainer);

    addBlock("recipe1",contentContainer, popup,"recipe1","switch", false);
    addBlock("recipe2",contentContainer, popup,"recipe2","switch", false);
    addBlock("recipe3",contentContainer, popup,"recipe3","switch", false);

    addBlock("bijkomende boodschappen",contentContainer, popup,"weekbasket", "", true);
    addBlock("algemene aanwijzingen",contentContainer, popup,"constraints","maak bestellijst", true);

    addBlock("bestellijst",contentContainer, popup,"productlist","bestel", true);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Sluiten';
    closeButton.addEventListener('click', clearCurrentPopup);
    popup.appendChild(closeButton);

    popup.appendChild(document.createElement('span'));

    document.body.appendChild(popup);

    currentPopup = popup;
}

function addBlock(content, contentContainer, popup, id, buttonName, inputonly) {
    const cont = document.createElement('div');
    cont.className = 'block-container'; // Add a class for styling

    if( inputonly == false) {
        const pre = document.createElement('pre');
        pre.textContent = content;
        pre.id = id;
        cont.appendChild(pre);
    }

    const editField = document.createElement('textarea');
    editField.id = id + '_edit';
    //editField.value = "Veggie";
    cont.appendChild(editField);
    const buttonContainer = document.createElement('div');

    if(buttonName != "") {
        const button1 = document.createElement('button');
        button1.textContent = buttonName;
        button1.id = id + '_button';
        button1.addEventListener('click', function() { clickButton(id); });
        buttonContainer.appendChild(button1);
    }

    const button2 = document.createElement('button');
    button2.textContent = "clear";
    button2.id = id + '_button2';
    button2.addEventListener('click', function() { document.getElementById(id).textContent = ""; });
    buttonContainer.appendChild(button2);

    cont.appendChild(buttonContainer);

    popup.appendChild(cont);

    contentContainer.appendChild(cont);
}

function clickButton( id) {
    if( id == "recipe1") { getRecipe(document.getElementById('constraints_edit').value, document.getElementById('recipe1_edit').value, "recipe1"); }
    if( id == "recipe2") { getRecipe(document.getElementById('constraints_edit').value, document.getElementById('recipe2_edit').value, "recipe2"); }
    if( id == "recipe3") { getRecipe(document.getElementById('constraints_edit').value, document.getElementById('recipe3_edit').value, "recipe3"); }
    //    if( id == "weekbasket") {  }
    if( id == "constraints") { vulBestellijst(); }
    if( id == "productlist") { bestel("welzijnskippenbil"); }
}

// Functie om een recept op te halen op basis van ingrediënten, familiesamenstelling, kooktijd, samenstelling in volwassenen, eetvoorkeuren en beperkingen
function getRecipe(generic_constraints, recipe_constraints, recipefield) {
    const prompt = `Stel je voor dat je een chef-kok bent die mensen helpt bij hun dagelijkse kookbehoeften, vergelijkbaar met bekende koks zoals Jeroen Meus en Piet Huysentruit.\
 Geef me alsjeblieft een recept voor een maaltijd. Hou rekening met de volgende voorkeuren en beperkingen: ${generic_constraints} en ${recipe_constraints}.\
 Geef me een heerlijk recept met een pakkende titel, een beschrijving van de maaltijd, de geschatte tijdsbesteding, een lijst van benodigde ingrediënten en gedetailleerde instructies.\
 Graag allemaal in het Nederlands.\n\n`;

    openAI(function(r) { document.getElementById(recipefield).textContent = r.replace(/\n+/g, '\n').replace(/^\n+/, ''); }, prompt, apiKey);
}

function vulBestellijst() {
    document.getElementById("productlist").textContent = "";

    console.log(document.getElementById("recipe1"));

    vulBestellijstRecept(document.getElementById("recipe1").textContent);
    vulBestellijstRecept(document.getElementById("recipe2").textContent);
    vulBestellijstRecept(document.getElementById("recipe2").textContent);
}

function vulBestellijstRecept(recept) {

    const prompt = "Geef de ingredientenlijst uit volgend recept : [[ \n" + recept + "\n ]] \n" +
          "1 lijn per ingredient, met hoeveelheid, eenheid en ingredient op elke lijn.\n" +
          "In het Nederlands.\n\n";

    openAI(function(r) { document.getElementById("productlist_edit").textContent += r.replace(/\n+/g, '\n').replace(/^\n+/, ''); }, prompt, apiKey);
}

// Voeg een contextmenugebeurtenisluisteraar toe aan de hele pagina
document.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // Voorkom dat het standaard contextmenu wordt weergegeven

    const clickedElement = event.target;

    clearCurrentPopup();

    //showPopup();
});

function clearCurrentPopup() {
    if (currentPopup) {
        document.body.removeChild(currentPopup);
    }
    currentPopup = null;
}

function bestel(ingredient)
{
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.collectandgo.be/colruyt/nl/zoek?searchTerm=' + ingredient;
    iframe.id = 'myIframe';

    // Apply CSS styles to center the iframe
iframe.style.position = 'fixed';
iframe.style.top = '0%';
iframe.style.left = '0%';
//iframe.style.transform = 'translate(-50%, -50%)';
iframe.style.width = '80%'; // Adjust the width as needed
iframe.style.height = '80%'; // Adjust the height as needed

    document.body.appendChild(iframe);
    console.log( "bestel(ingredient) 1 ");

    iframe.addEventListener('load', function() {
        console.log( "bestel(ingredient) 2 ");
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const addBasketButton = iframeDocument.querySelector('a.add-to-basket__icon.--add');
        if (addBasketButton) {
            addBasketButton.click();
            console.log( "bestel(ingredient)");
        }
    });

}

document.addEventListener('receiptEvent', function(e) {
    var recepten = e.detail;

    document.getElementById("recipe1_edit").value = recepten[0];
    document.getElementById("recipe2_edit").value = recepten[1];
    document.getElementById("recipe3_edit").value = recepten[2];
});

showPopup();
