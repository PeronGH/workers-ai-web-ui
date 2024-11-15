// Modify this before use.
// Set up your reverse proxy of workers ai first.
// You need to proxy https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/
// And set up authentication in your reverse proxy
const BASE_URL = '/your_proxy_of_workers_ai/';

async function run(model, input) {
    return fetch(BASE_URL + model, {
        method: 'POST',
        body: typeof input === 'string' ? input : JSON.stringify(input),
    })
        .then(res => res.json())
        .catch(e => ({
            success: false,
            errors: [{ message: e.toString() }],
            messages: [],
            result: null,
        }));
}

async function generateImage(prompt) {
    const { success, errors, result } = await run(
        '@cf/black-forest-labs/flux-1-schnell',
        { prompt }
    );
    if (!success) {
        message = errors.reduce(
            (prev, e) => `${prev}${JSON.stringify(e)}\n`,
            'Error generating image:\n'
        );
        alert(message);
        return;
    }
    return result.image;
}
