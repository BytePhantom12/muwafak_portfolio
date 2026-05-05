from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends

from auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from database import execute_query, execute_returning
from schemas import UserLogin, UserRegister, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return JWT token."""
    user = authenticate_user(credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user["id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=str(user["id"]),
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"]
        )
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user."""
    # Check if username already exists
    existing = execute_query(
        "SELECT id FROM users WHERE username = %s OR email = %s",
        (user_data.username, user_data.email),
        fetch_one=True
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create user
    password_hash = get_password_hash(user_data.password)
    user = execute_returning(
        """
        INSERT INTO users (username, email, password_hash)
        VALUES (%s, %s, %s)
        RETURNING id, username, email, created_at
        """,
        (user_data.username, user_data.email, password_hash)
    )
    
    # Create empty profile for user
    execute_returning(
        "INSERT INTO profiles (user_id, email) VALUES (%s, %s) RETURNING id",
        (user["id"], user_data.email)
    )
    
    # Create empty about section
    execute_returning(
        "INSERT INTO about_sections (user_id) VALUES (%s) RETURNING id",
        (user["id"],)
    )
    
    # Create empty contact info
    execute_returning(
        "INSERT INTO contact_info (user_id) VALUES (%s) RETURNING id",
        (user["id"],)
    )
    
    # Generate token
    access_token = create_access_token(
        data={"sub": str(user["id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=str(user["id"]),
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"]
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse(
        id=str(current_user["id"]),
        username=current_user["username"],
        email=current_user["email"],
        created_at=current_user["created_at"]
    )
