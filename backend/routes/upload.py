import os
import httpx
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from typing import Optional

from auth import get_current_user
from database import execute_query, execute_returning

router = APIRouter(prefix="/upload", tags=["File Upload"])

BLOB_READ_WRITE_TOKEN = os.environ.get("BLOB_READ_WRITE_TOKEN", "")
BLOB_STORE_ID = os.environ.get("BLOB_STORE_ID", "")


async def upload_to_vercel_blob(file: UploadFile, folder: str = "") -> dict:
    """Upload a file to Vercel Blob storage."""
    if not BLOB_READ_WRITE_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Blob storage not configured"
        )
    
    # Read file content
    content = await file.read()
    
    # Create the path with folder prefix
    filename = file.filename or "unnamed"
    pathname = f"{folder}/{filename}" if folder else filename
    
    # Upload to Vercel Blob
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"https://blob.vercel-storage.com/{pathname}",
            content=content,
            headers={
                "Authorization": f"Bearer {BLOB_READ_WRITE_TOKEN}",
                "x-api-version": "7",
                "Content-Type": file.content_type or "application/octet-stream",
            },
        )
        
        if response.status_code not in (200, 201):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {response.text}"
            )
        
        return response.json()


async def delete_from_vercel_blob(url: str) -> bool:
    """Delete a file from Vercel Blob storage."""
    if not BLOB_READ_WRITE_TOKEN:
        return False
    
    async with httpx.AsyncClient() as client:
        response = await client.request(
            "DELETE",
            "https://blob.vercel-storage.com/delete",
            headers={
                "Authorization": f"Bearer {BLOB_READ_WRITE_TOKEN}",
                "x-api-version": "7",
                "Content-Type": "application/json",
            },
            json={"urls": [url]}
        )
        
        return response.status_code == 200


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    type: str = Form("general"),
    current_user: dict = Depends(get_current_user)
):
    """Upload a file to Vercel Blob storage."""
    # Validate file type
    allowed_types = {
        "profile": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "project": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "cv": ["application/pdf"],
        "icon": ["image/svg+xml", "image/png"],
        "general": ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]
    }
    
    content_type = file.content_type or "application/octet-stream"
    
    if type in allowed_types and content_type not in allowed_types[type]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type for {type}. Allowed: {allowed_types.get(type, [])}"
        )
    
    # Upload to Vercel Blob
    blob_result = await upload_to_vercel_blob(file, folder=type)
    
    # Store upload record in database
    upload_record = execute_returning(
        """
        INSERT INTO uploads (filename, original_filename, file_type, blob_url, file_size, user_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, filename, blob_url
        """,
        (
            blob_result.get("pathname", file.filename),
            file.filename,
            type,
            blob_result.get("url"),
            blob_result.get("size"),
            current_user["id"]
        )
    )
    
    return {
        "url": blob_result.get("url"),
        "pathname": blob_result.get("pathname"),
        "filename": file.filename,
        "type": type
    }


@router.delete("/{upload_type}/{filename}")
async def delete_file(
    upload_type: str,
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an uploaded file."""
    # Find the upload record
    upload = execute_query(
        "SELECT id, blob_url FROM uploads WHERE file_type = %s AND (filename LIKE %s OR original_filename = %s)",
        (upload_type, f"%{filename}%", filename),
        fetch_one=True
    )
    
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Delete from Vercel Blob
    await delete_from_vercel_blob(upload["blob_url"])
    
    # Delete from database
    execute_query("DELETE FROM uploads WHERE id = %s", (upload["id"],))
    
    return {"message": "File deleted successfully"}
