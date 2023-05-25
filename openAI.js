function openAI(callbackfunction, prompt_p, apiKey_p) {
  console.log("openAI(" + callbackfunction + ", " + prompt_p + ", " + apiKey_p + ")");
  const apiUrl = 'https://api.openai.com/v1/completions';

  GM_xmlhttpRequest({
    method: 'POST',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey_p}`
    },
    data: JSON.stringify({
      'prompt': prompt_p,
      'max_tokens': 500,
      'temperature': 0.6,
      'model': 'text-davinci-002'
    }),
    onload: function (response) {
      console.log(response);
      if (response.status === 200) {
        const responseData = JSON.parse(response.responseText);
        callbackfunction(responseData.choices[0].text);
      } else {
        console.error('Fout bij het ophalen van de respons. Statuscode:', response.status);
        console.error(response.responseText);
        callbackfunction(response.responseText);
        // Verwerk de foutmelding op de juiste manier
      }
    },
    onerror: function (error) {
      console.error('Er is een fout opgetreden bij het genereren van het recept:', error);
    },
  });
}
