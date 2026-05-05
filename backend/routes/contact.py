from typing import List
from fastapi import APIRouter, HTTPException, status, Depends

from auth import get_current_user
from database import execute_query, execute_returning
from schemas import (
    ContactMessageCreate, ContactMessageResponse, 
    ContactMessageReply, BulkDeleteRequest
)

router = APIRouter(prefix="/contact", tags=["Contact Messages"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_message(message: ContactMessageCreate):
    """Submit a contact form message (public)."""
    result = execute_returning(
        """
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (%s, %s, %s, %s)
        RETURNING id, name, email, subject, message, is_read, reply, created_at
        """,
        (message.name, message.email, message.subject, message.message)
    )
    
    return {
        "_id": str(result["id"]),
        "name": result["name"],
        "email": result["email"],
        "subject": result["subject"],
        "message": result["message"],
        "isRead": result["is_read"],
        "reply": result["reply"],
        "createdAt": result["created_at"]
    }


@router.get("", response_model=List[ContactMessageResponse])
async def get_messages(current_user: dict = Depends(get_current_user)):
    """Get all contact messages (admin only)."""
    messages = execute_query(
        "SELECT * FROM contact_messages ORDER BY created_at DESC",
        fetch_all=True
    ) or []
    
    return [
        ContactMessageResponse(
            _id=str(msg["id"]),
            name=msg["name"],
            email=msg["email"],
            subject=msg.get("subject"),
            message=msg["message"],
            isRead=msg["is_read"],
            reply=msg.get("reply"),
            createdAt=msg["created_at"]
        )
        for msg in messages
    ]


@router.get("/{message_id}", response_model=ContactMessageResponse)
async def get_message(message_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single contact message (admin only)."""
    message = execute_query(
        "SELECT * FROM contact_messages WHERE id = %s",
        (message_id,),
        fetch_one=True
    )
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return ContactMessageResponse(
        _id=str(message["id"]),
        name=message["name"],
        email=message["email"],
        subject=message.get("subject"),
        message=message["message"],
        isRead=message["is_read"],
        reply=message.get("reply"),
        createdAt=message["created_at"]
    )


@router.patch("/{message_id}/read")
async def toggle_read_status(message_id: str, current_user: dict = Depends(get_current_user)):
    """Toggle read status of a message (admin only)."""
    message = execute_query(
        "SELECT is_read FROM contact_messages WHERE id = %s",
        (message_id,),
        fetch_one=True
    )
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    new_status = not message["is_read"]
    execute_query(
        "UPDATE contact_messages SET is_read = %s, updated_at = NOW() WHERE id = %s",
        (new_status, message_id)
    )
    
    return {"isRead": new_status}


@router.patch("/{message_id}/reply")
async def add_reply(message_id: str, reply_data: ContactMessageReply, current_user: dict = Depends(get_current_user)):
    """Add or update reply to a message (admin only)."""
    message = execute_query(
        "SELECT id FROM contact_messages WHERE id = %s",
        (message_id,),
        fetch_one=True
    )
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    execute_query(
        "UPDATE contact_messages SET reply = %s, is_read = TRUE, updated_at = NOW() WHERE id = %s",
        (reply_data.reply, message_id)
    )
    
    return {"message": "Reply added successfully"}


@router.delete("/{message_id}")
async def delete_message(message_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a contact message (admin only)."""
    message = execute_query(
        "SELECT id FROM contact_messages WHERE id = %s",
        (message_id,),
        fetch_one=True
    )
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    execute_query("DELETE FROM contact_messages WHERE id = %s", (message_id,))
    
    return {"message": "Message deleted successfully"}


@router.delete("")
async def bulk_delete_messages(request: BulkDeleteRequest, current_user: dict = Depends(get_current_user)):
    """Bulk delete contact messages (admin only)."""
    if not request.ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No message IDs provided"
        )
    
    # Create placeholders for SQL IN clause
    placeholders = ", ".join(["%s"] * len(request.ids))
    execute_query(
        f"DELETE FROM contact_messages WHERE id IN ({placeholders})",
        tuple(request.ids)
    )
    
    return {"message": f"Deleted {len(request.ids)} messages"}
