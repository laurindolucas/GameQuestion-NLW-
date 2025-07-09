const form = document.getElementById('form-input')
const apiKeyInput = document.getElementById('input-key');
const gameSelect = document.getElementById('select-games');
const questionInput = document.getElementById('input-massage');
const askButton = document.getElementById('btn-submit');
const aiResponse = document.getElementById('iaResponse');

const markdownToHTML = (text) => {
    const converter =  new showdown.Converter()
    return converter.makeHtml(text)
}

const askAi = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash";
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const ask = `
    olha, tenho esse jogo ${game} e queria saber ${question}`

    const contents = [{
        parts: [{
            text: ask
        }]
    }]
    
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify({
            contents
        })
    })

    const data = await response.json()
    return  data.candidates[0].content.parts[0].text
}

const sendform =  async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true;
    askButton.textContent = 'perguntando...'
    askButton.classList.add('loading')

    try {
        const text = await askAi(question, game, apiKey)
        aiResponse.querySelector('response-content').innerHTML =
        markdownToHTML(text)

    } catch (error) {
        console.log('Erro: ', error)

    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}


form.addEventListener('submit', sendform)