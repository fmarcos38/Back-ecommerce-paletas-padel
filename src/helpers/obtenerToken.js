const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generar URL de autenticación
const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
});

console.log("Abre este enlace en tu navegador:", authUrl);

// Leer código de autorización
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Introduce el código de autorización: ", async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tu Refresh Token es:", tokens.refresh_token);
    rl.close();
});
