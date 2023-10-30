function openAI(callbackfunction, prompt_p, apiKey_p) {
  const apiUrl = 'https://api.openai.com/v1/completions';

  console.log("openAI(" + callbackfunction + ", " + prompt_p + ", " + apiKey_p + ")");  

    GM_xmlhttpRequest({
    method: 'POST',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey_p}`
    },
    data: JSON.stringify({
      'model': 'gpt-3.5-turbo-instruct',
      'prompt': prompt_p,
      'max_tokens': 500,
      'temperature': 0.6
    }),
    onload: function (response) {
      console.log(response);
      if (response.status === 200) {
        const responseData = JSON.parse(response.responseText);
        callbackfunction(responseData.choices[0].text.trim());
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
