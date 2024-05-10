import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import fs from "fs/promises";
import { google } from 'googleapis';

async function appendDataToSheet(auth, data) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1QoHnm1uRLN8VOrxTrkINykgG5xdCKRmPKthb3LBF5wI'; // Replace with your actual sheet ID
    const range = 'A2'; // Start from cell A1
    const resource = {
        values: [
            [data.firstName, data.lastName, data.email, data.dateOfBirth, data.address, data.gender, data.phoneNumber1, data.phoneNumber2]
        ]
    };

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource
    });

    console.log(`${response.data.updates.updatedCells} cells appended.`);
}

async function main(filePath) {
    // Set up Azure Form Recognizer client
    const formRecognizerEndpoint = "https://westus2.api.cognitive.microsoft.com/";
    const formRecognizerApiKey = "9179f704ab5d487fa048c0ba7a38238a"; // Use your actual API key
    const formRecognizerCredential = new AzureKeyCredential(formRecognizerApiKey);
    const formRecognizerClient = new DocumentAnalysisClient(formRecognizerEndpoint, formRecognizerCredential);

    // Specify the custom model ID if using a custom model
    const modelId = "ElkindyModel";

    // Read the file content
    const fileContent = await fs.readFile(filePath);

    // Analyze the document
    const poller = await formRecognizerClient.beginAnalyzeDocument(modelId, fileContent);

    // Wait for analysis to complete
    const { documents: [document] } = await poller.pollUntilDone();

    // Handle results
    if (!document) {
        throw new Error("Expected at least one document in the result.");
    }

    // Prepare data for Google Sheets from document fields
    const data = {
        firstName: document.fields['first Name']?.content || "",
        lastName: document.fields['last Name']?.content || "",
        email: document.fields.Email?.content || "",
        dateOfBirth: document.fields['Date of Birth']?.content || "",
        address: document.fields.Addresse?.content || "",
        gender: document.fields.Gender?.content || "",
        phoneNumber1: document.fields['Phone Number 1']?.content || "",
        phoneNumber2: document.fields['Phone Number 2']?.content || ""
    };

    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
        keyFile: './controllers/bamboo-dryad-422120-eaa568f474dd.json', 
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const authClient = await auth.getClient();

    // Append data to Google Sheet
    await appendDataToSheet(authClient, data);
    console.log("Extracted data saved to Google Sheets.");
}

export default main;
