// googleSheetUtils.js
import { google } from "googleapis";
import fs from "fs";

// Load service account credentials from file
const credentials = JSON.parse(fs.readFileSync("service-account.json"));

// Set up authentication using service account credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

// Initialize Google Drive and Sheets clients
const drive = google.drive({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });

/**
 * Create a new Google Sheet.
 * @returns {Promise<string>} The ID of the created sheet.
 */
export async function createSheet() {
  try {
    const fileMetadata = {
      name: "My New Google Sheet",
      mimeType: "application/vnd.google-apps.spreadsheet",
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    const sheetId = response.data.id;
    console.log(`Sheet created: https://docs.google.com/spreadsheets/d/${sheetId}`);
    return sheetId;
  } catch (error) {
    console.error("Error creating sheet:", error);
    throw error;
  }
}

/**
 * Share the sheet with a specific user by email.
 * @param {string} fileId - The ID of the sheet.
 * @param {string} email - The email address to share with.
 */
export async function addEditor(fileId, email) {
  try {
    const permission = {
      type: "user",
      role: "writer", // Use 'reader' for view-only
      emailAddress: email,
    };

    await drive.permissions.create({
      fileId,
      resource: permission,
    });
    console.log(`Access granted to ${email}`);
  } catch (error) {
    console.error(`Error sharing sheet with ${email}:`, error);
    throw error;
  }
}

/**
 * Fetch data from a specified range in the sheet.
 * @param {string} spreadsheetId - The sheet ID.
 * @param {string} range - The A1 notation range (e.g., "Sheet1!A1:C4").
 * @returns {Promise<Array>} Data retrieved from the sheet.
 */
export async function fetchSheetData(spreadsheetId, range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    console.log("Fetched Data:", response.data.values);
    return response.data.values;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
}

/**
 * Update a specified range in the sheet with new data.
 * @param {string} spreadsheetId - The sheet ID.
 * @param {string} range - The A1 notation range.
 * @param {Array} newValue - The new data (array of arrays).
 */
export async function updateSheetValue(spreadsheetId, range, newValue) {
  try {
    const body = { values: newValue };
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: body,
    });
    console.log(`Updated range ${range} successfully!`);
  } catch (error) {
    console.error("Error updating sheet value:", error);
    throw error;
  }
}

/**
 * Append a new row of data to the sheet.
 * @param {string} spreadsheetId - The sheet ID.
 * @param {string} range - The target sheet name or range (e.g., "Sheet1").
 * @param {Array} rowData - The row data to append.
 */
export async function appendRow(spreadsheetId, range, rowData) {
  try {
    const body = { values: [rowData] };
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: body,
    });
    console.log("Row appended:", response.data.updates);
    return response.data;
  } catch (error) {
    console.error("Error appending row:", error);
    throw error;
  }
}

/**
 * Batch update multiple ranges/cells in the sheet.
 * @param {string} spreadsheetId - The sheet ID.
 * @param {Array} data - An array of objects with 'range' and 'values' keys.
 */
export async function batchUpdateSheet(spreadsheetId, data) {
  try {
    const body = { data, valueInputOption: "RAW" };
    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: body,
    });
    console.log("Batch update successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in batch update:", error);
    throw error;
  }
}

/**
 * Get metadata for the sheet (e.g., name, createdTime).
 * @param {string} spreadsheetId - The sheet ID.
 * @returns {Promise<Object>} Metadata object.
 */
export async function getSheetMetadata(spreadsheetId) {
  try {
    const response = await drive.files.get({
      fileId: spreadsheetId,
      fields: "id, name, mimeType, createdTime",
    });
    console.log("Sheet Metadata:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting sheet metadata:", error);
    throw error;
  }
}

/**
 * Create a copy of the specified Google Sheet.
 * @param {string} spreadsheetId - The sheet ID to copy.
 * @returns {Promise<string>} The ID of the copied sheet.
 */
export async function copySheet(spreadsheetId) {
  try {
    const response = await drive.files.copy({
      fileId: spreadsheetId,
      resource: { name: "Copied Google Sheet" },
    });
    const copyId = response.data.id;
    console.log(`Sheet copied: https://docs.google.com/spreadsheets/d/${copyId}`);
    return copyId;
  } catch (error) {
    console.error("Error copying sheet:", error);
    throw error;
  }
}

/**
 * Delete the specified Google Sheet.
 * @param {string} spreadsheetId - The sheet ID to delete.
 */
export async function deleteSheet(spreadsheetId) {
  try {
    await drive.files.delete({
      fileId: spreadsheetId,
    });
    console.log(`Sheet with ID ${spreadsheetId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting sheet:", error);
    throw error;
  }
}

/**
 * Test harness function to run several operations.
 * This demonstrates creating a sheet, sharing it, updating values,
 * appending rows, fetching data, batch updating, getting metadata, and copying.
 */
async function test() {
  try {
    // 1. Create a new sheet
    const sheetId = await createSheet();

    // 2. Share the sheet with a test email (replace with your email)
    await addEditor(sheetId, "example@gmail.com");

    // 3. Insert initial data into the sheet
    const initialData = [
      ["Name", "Age", "City"],
      ["Alice", 25, "New York"],
      ["Bob", 30, "Los Angeles"],
    ];
    await updateSheetValue(sheetId, "Sheet1!A1", initialData);

    // 4. Append a new row
    await appendRow(sheetId, "Sheet1", ["Charlie", 28, "Chicago"]);

    // 5. Fetch the current data
    await fetchSheetData(sheetId, "Sheet1!A1:C4");

    // 6. Batch update: change Alice's age and Bob's city
    await batchUpdateSheet(sheetId, [
      { range: "Sheet1!B2", values: [["26"]] },
      { range: "Sheet1!C3", values: [["San Francisco"]] },
    ]);

    // 7. Retrieve sheet metadata
    await getSheetMetadata(sheetId);

    // 8. Copy the sheet
    const copiedSheetId = await copySheet(sheetId);

    // 9. (Optional) Delete the copied sheet for cleanup
    // await deleteSheet(copiedSheetId);

    console.log("Test sequence completed successfully!");
  } catch (error) {
    console.error("Error during test execution:", error);
  }
}

// Export all functions (default export as an object for convenience)
export default {
  createSheet,
  addEditor,
  fetchSheetData,
  updateSheetValue,
  appendRow,
  batchUpdateSheet,
  getSheetMetadata,
  copySheet,
  deleteSheet,
};

// Run the test harness if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  test();
}
