import { onRequest } from "firebase-functions/v2/https";
import { google } from "googleapis";
import * as path from "path";
import * as fs from "fs";

export const driveExport = onRequest(
  { region: "asia-south1", cors: true, memory: "256MiB" },
  async (req, res) => {
    // Enable CORS manually just in case
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { playerName, reportHtml } = req.body;

    if (!playerName || !reportHtml) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      // Load service account key dynamically at runtime
      const saPath = path.resolve(__dirname, "../sa-key.json");
      if (!fs.existsSync(saPath)) {
        console.error("Service account credentials not found at:", saPath);
        res.status(500).json({ error: "Service account credentials not configured on backend." });
        return;
      }

      const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
      });

      const drive = google.drive({ version: "v3", auth });

      // Find or create ScoutAI Reports folder
      const folderSearch = await drive.files.list({
        q: "name='ScoutAI Reports' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: "files(id)",
      });

      let folderId: string;
      if (folderSearch.data.files && folderSearch.data.files.length > 0) {
        folderId = folderSearch.data.files[0].id!;
      } else {
        const folder = await drive.files.create({
          requestBody: {
            name: "ScoutAI Reports",
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id",
        });
        folderId = folder.data.id!;
      }

      // Create stream from HTML content
      const { Readable } = await import("stream");
      const stream = Readable.from([reportHtml]);

      // Upload file as Google Doc (converts HTML to GDoc layout)
      const file = await drive.files.create({
        requestBody: {
          name: `ScoutAI_${playerName}_${new Date().toISOString().split("T")[0]}.html`,
          parents: [folderId],
          mimeType: "text/html",
        },
        media: {
          mimeType: "text/html",
          body: stream,
        },
        fields: "id, webViewLink",
      });

      // Grant anyone read permissions to make the link viewable
      await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: { role: "reader", type: "anyone" },
      });

      res.status(200).json({
        success: true,
        fileId: file.data.id,
        viewLink: file.data.webViewLink,
      });
    } catch (error) {
      console.error("Drive export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  }
);
