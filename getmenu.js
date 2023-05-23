
function getProductName(element) {
  if (!element) { return null; }
  if (element.classList.contains("c-product-name__long")) { return element.textContent.trim(); }

  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var foundElement = getProductName(child);
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
