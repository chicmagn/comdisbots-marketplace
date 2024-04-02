import express from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { verifySIWS } from "@talismn/siws"
import jwt from 'jsonwebtoken'
const auth = express.Router();

auth.get('/nonce', async function (req, res) {
    req.session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(req.session.nonce);
});

auth.post('/verifyEVM', async function (req, res) {
    try {
        if (!req.body.message) {
            res.status(422).json({ message: 'Expected prepareMessage object as body.' });
            return;
        }

        let SIWEObject = new SiweMessage(req.body.message);
        const { data: message } = await SIWEObject.verify({ signature: req.body.signature, nonce: req.session.nonce });
        if (req.session.nonce !== message.nonce)
            res.status(401).json({ error: "Invalid nonce! Please try again." })

        req.session.siwe = message;
        req.session.cookie.expires = new Date(message.expirationTime);
        req.session.save(() => res.status(200).send(true));
    } catch (e: any) {
        req.session.siwe = null;
        req.session.nonce = null;
        console.error(e);
        switch (e) {
            case ErrorTypes.EXPIRED_MESSAGE: {
                req.session.save(() => res.status(440).json({ message: e.message }));
                break;
            }
            case ErrorTypes.INVALID_SIGNATURE: {
                req.session.save(() => res.status(422).json({ message: e.message }));
                break;
            }
            default: {
                req.session.save(() => res.status(500).json({ message: e.message }));
                break;
            }
        }
    }
});


auth.post('/verifyPolkadot', async function (req, res) {
    try {
        if (!req.body.message) {
            res.status(422).json({ message: 'Expected prepareMessage object as body.' });
            return;
        }
        const { signature, message, address, nonce } = req.body
        // let SIWEObject = new SiweMessage(req.body.message);
        const siwsMessage = await verifySIWS(message, signature, address);
        console.log(siwsMessage, "--------------------------")
        if (req.session.nonce !== nonce)
            res.status(401).json({ error: "Invalid nonce! Please try again." })

        // validate that domain is correct to prevent phishing attack
        // if (siwsMessage.domain !== process.env.VITE_DOMAIN)
        //     throw new Error("SIWS Error: Signature was meant for different domain.")
        
        const jwtPayload = {
            address: siwsMessage.address,
        }
        const VITE_JWT_SECRET='6b8b2fcc9c50d2c30f9ef6504298f9fd32a7cde4363bddac64c2193bfd16a2a9'
// console.log(process.env.VITE_JWT_SECRET)
        const jwtToken = jwt.sign(jwtPayload, VITE_JWT_SECRET!, {
            algorithm: "HS256",
        })
        req.session.swis = siwsMessage;

        req.session.save(() => res.status(200).json({ jwtToken }));
        // req.session.save(() => res.status(200).send(true));
    } catch (e: any) {
        req.session.siws = null;
        req.session.nonce = null;
        res.status(401).json({ error: e.message ?? "Invalid signature!" })
    }
});

auth.get('/userInfo/evm', function (req, res) {
    if (!req.session.siwe) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }
    console.log("User is authenticated!");
    res.setHeader('Content-Type', 'text/plain');
    res.send(`You are authenticated and your address is: ${req.session.siwe.address}`);
});

auth.get('/userInfo/polkadot', function (req, res) {
    if (!req.session.siws) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }
    console.log("User is authenticated!");
    res.setHeader('Content-Type', 'text/plain');
    res.send(`You are authenticated and your address is: ${req.session.siwe.address}`);
});

export default auth;