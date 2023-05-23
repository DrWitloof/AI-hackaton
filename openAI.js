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
