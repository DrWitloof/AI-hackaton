
function getProductName(element) { getSpecificClassValue(element, "c-product-name__long"); }
function getProductBrand(element) { getSpecificClassValue(element, "c-product-name__brand"); }
  
function getSpecificClassValue(element, classname) {
  if (!element) { return null; }
  if (element.classList.contains(classname)) { return element.textContent.trim(); }

  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var foundElement = getSpecificClassValue(child, classname);
    if (foundElement) { return foundElement; }
  }
  return null;
}

function findPlpItem(element) {
  let currentElement = element;
  while (currentElement) {
    if (currentElement.classList && currentElement.classList.contains('plp-item')) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}
