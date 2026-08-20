import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "general";

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize folder name
        const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
        const uploadDir = join(process.cwd(), `public/uploads/${safeFolder}`);
        
        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Create a unique filename with original extension
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const rawExt = file.name.split('.').pop() || 'jpg';
        const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
        const filename = `${uniqueSuffix}.${cleanExt || 'jpg'}`;
        
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);
        
        // Return the public URL
        const imageUrl = `/uploads/${safeFolder}/${filename}`;
        
        return NextResponse.json({ url: imageUrl, success: true });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
