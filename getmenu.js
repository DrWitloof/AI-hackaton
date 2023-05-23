function openAI(callbackfunction, apiKey, prompt) {
  const apiUrl = 'https://api.openai.com/v1/completions';

  GM_xmlhttpRequest({
    method: 'POST',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    data: JSON.stringify({
      'prompt': prompt,
      'max_tokens': 500,
      'temperature': 0.6,
      'model': 'text-davinci-002'
    }),
    onload: function (response) {
      const responseData = JSON.parse(response.responseText);

      callbackfunction(responseData.choices[0].text);
    },
    onerror: function (error) {
      console.error('Er is een fout opgetreden bij het genereren van het recept:', error);
    },
  });
}

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
