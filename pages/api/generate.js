
import { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
import { pipeline } from 'stream'

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const generateAction = async (req, res) => {
    console.log('Received request')

    const input = JSON.parse(req.body).input;

    const hfKey = process.env.HF_AUTH_KEY;
    const hf = new HfInference(hfKey);

    // Checking that the user is authenticated.
    // if (!request.auth) {
    //   // Throwing an HttpsError so that the client gets the error details.
    //   throw new HttpsError("failed-precondition", "The function must be " +
    //       "called while authenticated.");
    // }

    /**
     * @type {Blob}
     */
    const output = await hf.textToImage({
        model: "jonaylor89/sd-johannes",
        inputs: input,
    }, {
        retry_on_error: false,
        wait_for_model: false,
    });

    console.log(output);

    // res.status(200).json({image: arrayBuf});
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': output.size,
    })
    const imageStream = output.stream();
    pipeline(imageStream, res, (error) => {
        if (error) console.error(error)
    })
}

export default generateAction;