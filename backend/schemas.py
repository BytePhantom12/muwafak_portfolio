from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr


# Auth Schemas
class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Profile Schemas
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    location: Optional[str] = None
    languages: Optional[str] = None
    email: Optional[str] = None


class ProfileResponse(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    resume: Optional[str] = None
    profileImage: Optional[str] = None
    location: Optional[str] = None
    languages: Optional[str] = None
    email: Optional[str] = None


# About Schemas
class AboutUpdate(BaseModel):
    description: Optional[str] = None
    highlights: Optional[List[str]] = None


class AboutResponse(BaseModel):
    description: Optional[str] = None
    highlights: List[str] = []


# Contact Info Schemas
class ContactInfoUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    social: Optional[dict] = None


class ContactInfoResponse(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    social: dict = {}


# Skill Schemas
class SkillCreate(BaseModel):
    category: str
    items: List[str] = []


class SkillUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[str]] = None


class SkillResponse(BaseModel):
    _id: str
    category: str
    items: List[str] = []


# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: List[str] = []
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    featured: bool = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: Optional[List[str]] = None
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    featured: Optional[bool] = None


class ProjectResponse(BaseModel):
    _id: str
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: List[str] = []
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    featured: bool = False


# Education Schemas
class EducationCreate(BaseModel):
    institution: str
    degree: Optional[str] = None
    field: Optional[str] = None
    description: Optional[str] = None


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    description: Optional[str] = None


class EducationResponse(BaseModel):
    _id: str
    institution: str
    degree: Optional[str] = None
    field: Optional[str] = None
    description: Optional[str] = None


# Experience Schemas
class ExperienceCreate(BaseModel):
    company: str
    position: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    current: bool = False
    description: Optional[str] = None
    technologies: List[str] = []


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None


class ExperienceResponse(BaseModel):
    _id: str
    company: str
    position: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    current: bool = False
    description: Optional[str] = None
    technologies: List[str] = []


# Tech Stack Schemas
class TechStackCreate(BaseModel):
    name: str
    icon: Optional[str] = None
    category: Optional[str] = None


class TechStackUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None


class TechStackResponse(BaseModel):
    _id: str
    name: str
    icon: Optional[str] = None
    category: Optional[str] = None


# Contact Message Schemas
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


class ContactMessageResponse(BaseModel):
    _id: str
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    isRead: bool = False
    reply: Optional[str] = None
    createdAt: datetime


class ContactMessageReply(BaseModel):
    reply: str


class BulkDeleteRequest(BaseModel):
    ids: List[str]


# Portfolio Response
class PortfolioResponse(BaseModel):
    profile: ProfileResponse
    about: AboutResponse
    contact: ContactInfoResponse
    skills: List[SkillResponse]
    projects: List[ProjectResponse]
    education: List[EducationResponse]
    experience: List[ExperienceResponse]
    techStack: List[TechStackResponse]


# Section Update (for PUT /portfolio/section/:section)
class SectionUpdate(BaseModel):
    data: Any
