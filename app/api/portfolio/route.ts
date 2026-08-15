import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json");

async function readPortfolioData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error: any) {
    console.error("Error reading portfolio data, returning fallback initial data", error);
    return { skills: [], projects: [] };
  }
}

export async function GET() {
  try {
    const data = await readPortfolioData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to read portfolio data: " + error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteConfig, shifts, offers, skills, projects, passphrase } = body;

    // Check password securely from environment variables only
    const expectedPassword = process.env.ADMIN_PASSWORD;
    
    if (!expectedPassword) {
      return NextResponse.json({ error: "Server misconfiguration: ADMIN_PASSWORD environment variable is not set." }, { status: 500 });
    }

    if (passphrase !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized: Invalid passphrase" }, { status: 401 });
    }

    if (!Array.isArray(skills) || !Array.isArray(projects)) {
      return NextResponse.json({ error: "Invalid data format: skills and projects must be arrays" }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || "Portfolio";
    const githubOwner = process.env.GITHUB_OWNER || "hardiksinghofficial";

    // Process file uploads for project thumbnails if any are sent as base64 objects
    for (let project of projects) {
      if (project.thumbnail && typeof project.thumbnail === "object" && project.thumbnail.data) {
        try {
          const { name, data: fileDataStr } = project.thumbnail;
          const base64Data = fileDataStr.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");
          
          const safeName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          
          if (githubToken) {
            // Upload the image directly to GitHub!
            const imgPathInRepo = `public/uploads/${safeName}`;
            const imgUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${imgPathInRepo}`;
            
            const imgPutRes = await fetch(imgUrl, {
              method: "PUT",
              headers: {
                "Authorization": `token ${githubToken}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                message: `media: upload project thumbnail ${safeName} via admin panel`,
                content: base64Data,
                branch: "main"
              })
            });
            
            if (!imgPutRes.ok) {
              const errText = await imgPutRes.text();
              throw new Error(`GitHub API image upload failed: ${errText}`);
            }
            
            project.thumbnail = `/uploads/${safeName}`;
          } else {
            // Local fallback
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(path.join(uploadDir, safeName), buffer);
            project.thumbnail = `/uploads/${safeName}`;
          }
        } catch (uploadError: any) {
          console.error("Error writing uploaded file: ", uploadError);
          return NextResponse.json({ error: "Failed to upload project image: " + uploadError.message }, { status: 500 });
        }
      }
    }

    // Process file upload for logo if sent as base64 object
    if (siteConfig?.logoImage && typeof siteConfig.logoImage === "object" && siteConfig.logoImage.data) {
      try {
        const { name, data: fileDataStr } = siteConfig.logoImage;
        const base64Data = fileDataStr.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        const safeName = `${Date.now()}_logo_${name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        
        if (githubToken) {
          const imgPathInRepo = `public/uploads/${safeName}`;
          const imgUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${imgPathInRepo}`;
          
          const imgPutRes = await fetch(imgUrl, {
            method: "PUT",
            headers: {
              "Authorization": `token ${githubToken}`,
              "Accept": "application/vnd.github.v3+json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: `media: upload logo ${safeName} via admin panel`,
              content: base64Data,
              branch: "main"
            })
          });
          
          if (!imgPutRes.ok) throw new Error("GitHub logo upload failed");
          
          siteConfig.logoImage = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/public/uploads/${safeName}`;
        } else {
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          await fs.mkdir(uploadDir, { recursive: true });
          await fs.writeFile(path.join(uploadDir, safeName), buffer);
          siteConfig.logoImage = `/uploads/${safeName}`;
        }
      } catch (uploadError: any) {
        console.error("Error writing logo file: ", uploadError);
      }
    }

    // Process file upload for hero image if sent as base64 object
    if (siteConfig?.hero?.image && typeof siteConfig.hero.image === "object" && siteConfig.hero.image.data) {
      try {
        const { name, data: fileDataStr } = siteConfig.hero.image;
        const base64Data = fileDataStr.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        const safeName = `${Date.now()}_hero_${name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        
        if (githubToken) {
          const imgPathInRepo = `public/uploads/${safeName}`;
          const imgUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${imgPathInRepo}`;
          
          const imgPutRes = await fetch(imgUrl, {
            method: "PUT",
            headers: {
              "Authorization": `token ${githubToken}`,
              "Accept": "application/vnd.github.v3+json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: `media: upload hero ${safeName} via admin panel`,
              content: base64Data,
              branch: "main"
            })
          });
          
          if (!imgPutRes.ok) throw new Error("GitHub hero upload failed");
          
          siteConfig.hero.image = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/public/uploads/${safeName}`;
        } else {
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          await fs.mkdir(uploadDir, { recursive: true });
          await fs.writeFile(path.join(uploadDir, safeName), buffer);
          siteConfig.hero.image = `/uploads/${safeName}`;
        }
      } catch (uploadError: any) {
        console.error("Error writing hero file: ", uploadError);
      }
    }

    const updatedData = { siteConfig, shifts: shifts || [], offers: offers || [], skills: skills || [], projects: projects || [] };

    if (githubToken) {
      // Commit directly to GitHub!
      const pathInRepo = "data/portfolio.json";
      const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${pathInRepo}`;

      // 1. Get the current file SHA to update it
      let sha = "";
      try {
        const getRes = await fetch(url, {
          headers: {
            "Authorization": `token ${githubToken}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch (err) {
        console.error("Error fetching file SHA from GitHub:", err);
      }

      // 2. Commit the new file content
      const contentBase64 = Buffer.from(JSON.stringify(updatedData, null, 2)).toString("base64");
      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "feat: update portfolio database via admin panel",
          content: contentBase64,
          sha: sha || undefined,
          branch: "main"
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub API commit failed: ${errText}`);
      }

      return NextResponse.json({ success: true, message: "Portfolio database updated and committed to GitHub!" });
    }

    // Local fallback when running locally
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Portfolio database updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to write portfolio data: " + error.message }, { status: 500 });
  }
}
