
const MODEL_URL = 'https://api-inference.huggingface.co/models/jonaylor89/sd-johannes'

const generateAction = async (req, res) => {
    console.log('Received request')

    const input = JSON.parse(req.body).input;

    const response = await fetch(
        MODEL_URL,
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                inputs: input,
            }),
        }
    );

    console.log(`Response received from HF API with status ${response.status}`);

    if (response.ok) {
        const buffer = await response.arrayBuffer();
        console.log(`Response converted to buffer of length ${buffer.byteLength}`)
        res.status(200).json({ image: buffer });
    } else if (response.status === 503) {
        const json = await response.json();
        res.status(503).json(json);
    } else {
        const json = await response.json();
        res.status(response.status).json({ error: response.statusText });
    }
}

export default generateAction;