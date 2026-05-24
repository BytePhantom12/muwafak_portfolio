import uuid
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from vercel.blob import AsyncBlobClient

from auth import get_current_user
from database import execute_query, execute_returning

router = APIRouter(prefix="/upload", tags=["File Upload"])


async def upload_to_vercel_blob(file: UploadFile, folder: str = "") -> dict:
    """Upload a file to Vercel Blob storage."""

    content = await file.read()

    filename = file.filename or "unnamed"
    unique_filename = f"{uuid.uuid4()}-{filename}"
    pathname = f"{folder}/{unique_filename}" if folder else unique_filename

    try:
        client = AsyncBlobClient()

        blob = await client.put(
            pathname,
            content,
            access="public",
            add_random_suffix=False,
            content_type=file.content_type or "application/octet-stream",
        )

        return {
            "url": blob.url,
            "pathname": blob.pathname,
            "filename": unique_filename,
            "size": len(content),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )


async def delete_from_vercel_blob(url: str) -> bool:
    """Delete a file from Vercel Blob storage."""

    try:
        client = AsyncBlobClient()
        await client.delete(url)
        return True
    except Exception:
        return False


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    type: str = Form("general"),
    current_user: dict = Depends(get_current_user)
):
    allowed_types = {
        "profile": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "project": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "cv": ["application/pdf"],
        "icon": ["image/svg+xml", "image/png"],
        "general": [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf"
        ],
    }

    if type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid upload type"
        )

    content_type = file.content_type or "application/octet-stream"

    if content_type not in allowed_types[type]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type for {type}. Allowed: {allowed_types[type]}"
        )

    blob_result = await upload_to_vercel_blob(file, folder=type)

    execute_returning(
        """
        INSERT INTO uploads 
        (filename, original_filename, file_type, blob_url, file_size, user_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, filename, blob_url
        """,
        (
            blob_result["pathname"],
            file.filename,
            type,
            blob_result["url"],
            blob_result["size"],
            current_user["id"],
        ),
    )

    return {
        "url": blob_result["url"],
        "pathname": blob_result["pathname"],
        "filename": file.filename,
        "type": type,
    }


@router.delete("/{upload_type}/{filename}")
async def delete_file(
    upload_type: str,
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    upload = execute_query(
        """
        SELECT id, blob_url 
        FROM uploads 
        WHERE file_type = %s 
        AND (filename LIKE %s OR original_filename = %s)
        """,
        (upload_type, f"%{filename}%", filename),
        fetch_one=True,
    )

    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    deleted = await delete_from_vercel_blob(upload["blob_url"])

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete file from Vercel Blob"
        )

    execute_query(
        "DELETE FROM uploads WHERE id = %s",
        (upload["id"],)
    )

    return {"message": "File deleted successfully"}