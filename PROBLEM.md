# File Upload & Sharing Service - Problem Statement

## Overview

Build a web-based file upload and sharing service that allows users to upload files, receive shareable links, and download files via those links. The service should include file validation, and link expiration features.

## Background

File sharing services like WeTransfer, Dropbox, and Google Drive allow users to easily share files with others via links. Your task is to implement core features of such a service, focusing on:

1. Reliable file uploads with validation
2. Secure, unique shareable links
3. Link expiration management
4. Download tracking

## Requirements

### Functional Requirements

#### 1. File Upload
- Users can upload files via drag-and-drop or file picker
- Support multiple file types (images, PDFs, documents)
- Maximum file size: 10 MB
- Display success/error messages after upload
- Generate a unique shareable link for each file

#### 2. File Validation
- **Server-side validation** (security-critical):
  - Verify file size doesn't exceed 10 MB
  - Check MIME type matches allowed types
  - Return clear error messages for validation failures

- **Allowed file types:**
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF, DOC, DOCX, TXT
  - Spreadsheets: XLS, XLSX
  - Presentations: PPT, PPTX

#### 3. Shareable Links
- Each uploaded file receives a unique, secure share token
- Share links format: `http://localhost:3000/share/{token}`
- Anyone with the link can download the file
- Track number of downloads per file

#### 4. Link Expiration
- User selects expiration time during upload:
  - 24 hours
  - 7 days
  - 30 days
  - Never (permanent)
- Calculate and store expiry timestamp
- Enforce expiration on download attempts
- Return HTTP 410 (Gone) for expired links
- Display expiry status in file list ("Expires in X days" or "Expired")

#### 5. File Management
- List all uploaded files with metadata:
  - Original filename
  - File size (formatted: "2.5 MB")
  - Upload date
  - Download count
  - Expiry status
  - Shareable link
- Delete files from storage and database
- Download files directly from file list

### Non-Functional Requirements

#### Performance
- File list loads within 1 second
- Support concurrent uploads

#### Security
- Generate cryptographically secure tokens (not guessable)
- Store files with unique names to prevent overwrites
- Validate file types server-side (don't trust client)
- Prevent directory traversal attacks
- Sanitize filenames for storage

## Technical Constraints

### Backend
- **Language:** Node.js
- **Framework:** Express
- **File Upload:** Multer middleware
- **Database:** SQLite
- **Port:** 3000


### Storage
- Files stored in `backend/uploads/` directory
- Metadata stored in SQLite database
- Database schema provided (see below)

## Database Schema

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  expires_at DATETIME,
  upload_date DATETIME NOT NULL,
  download_count INTEGER DEFAULT 0
);
```

### Field Descriptions
- `id`: UUID v4, primary key
- `original_name`: Original filename from user's computer
- `stored_name`: Unique filename in uploads/ directory
- `size`: File size in bytes
- `mime_type`: MIME type (e.g., "image/png", "application/pdf")
- `share_token`: UUID v4 for shareable link
- `expires_at`: ISO 8601 datetime or NULL (for never expires)
- `upload_date`: ISO 8601 datetime of upload
- `download_count`: Number of times downloaded via share link

## API Specification

### POST /api/files/upload
Upload a file and receive metadata with share link.

**Request:**
```http
POST /api/files/upload?expiryOption=7d
Content-Type: multipart/form-data

Body: file (multipart form field)
```

**Query Parameters:**
- `expiryOption`: Optional. One of: `24h`, `7d`, `30d`, `never`. Default: `never`

**Response (201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "originalName": "document.pdf",
  "size": 2457600,
  "mimeType": "application/pdf",
  "shareToken": "x9y8z7w6-v5u4-3210-tuvw-xyz987654321",
  "shareLink": "http://localhost:3000/share/x9y8z7w6-v5u4-3210-tuvw-xyz987654321",
  "expiresAt": "2025-11-15T10:30:00.000Z",
  "uploadDate": "2025-11-08T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: No file provided
- `413 Payload Too Large`: File exceeds 10 MB
- `415 Unsupported Media Type`: Invalid file type
- `500 Internal Server Error`: Server error

### GET /api/files/share/:token
Download a file using its share token.

**Request:**
```http
GET /api/files/share/x9y8z7w6-v5u4-3210-tuvw-xyz987654321
```

**Response (200 OK):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"
Content-Length: 2457600

[Binary file data]
```

**Error Responses:**
- `404 Not Found`: Invalid token or file not found
- `410 Gone`: Link has expired

### GET /api/files
List all uploaded files.

**Response (200 OK):**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "originalName": "document.pdf",
    "size": 2457600,
    "mimeType": "application/pdf",
    "shareToken": "x9y8z7w6-v5u4-3210-tuvw-xyz987654321",
    "expiresAt": "2025-11-15T10:30:00.000Z",
    "uploadDate": "2025-11-08T10:30:00.000Z",
    "downloadCount": 5
  }
]
```

### GET /api/files/:id
Get metadata for a specific file.

**Response (200 OK):** Same as single item from list above.

### DELETE /api/files/:id
Delete a file and its metadata.

**Response (204 No Content):** Empty body on success.

## Implementation Tasks

You are provided with a 65% complete implementation. Your tasks are:

### Task 1: Upload with Validation (30 minutes)
**Difficulty:** Medium

Implement:
1. **Backend validation** in `/api/files/upload`:
   - Validate file size (max 10 MB)
   - Validate MIME type against allowed list
   - Return appropriate HTTP status codes and error messages

### Task 2: Shareable Links (40 minutes)
**Difficulty:** Medium-Hard

Implement:
1. **Token generation** on upload:
   - Generate UUID v4 for `share_token`
   - Store in database
   - Return share link in response

2. **Download endpoint** `GET /api/files/share/:token`:
   - Find file by share token
   - Stream file with correct headers
   - Increment download counter

3. **Share UI** in `MyFilesPage.jsx` and `SharePage.jsx`:
   - Display shareable link for each file
   - Implement copy-to-clipboard
   - Create download page for share links

### Task 3: Link Expiry (20 minutes)
**Difficulty:** Easy-Medium

Implement:
1. **Expiry selection** in `UploadPage.jsx`:
   - Add dropdown for expiry options
   - Send `expiryOption` query parameter

2. **Expiry calculation** in backend:
   - Calculate `expires_at` based on option
   - Store in database

3. **Expiry enforcement** in share endpoint:
   - Check if current time > expires_at
   - Return HTTP 410 if expired

4. **Expiry display** in `MyFilesPage.jsx`:
   - Show "Expires in X days/hours"
   - Show "Expired" badge if past expiry

## Evaluation Criteria

### Functionality (50%)
- File validation prevents invalid uploads
- Shareable links work correctly
- Expiry is enforced properly
- Download counter increments

### Code Quality (30%)
- Clean, readable code
- Proper error handling
- Following existing code style
- Appropriate HTTP status codes

### Security (20%)
- Server-side validation (not just client-side)
- Secure token generation
- Proper filename sanitization
- No directory traversal vulnerabilities


## Bonus Challenges (Optional)

If you complete all tasks early:

1. **Batch Upload:** Support uploading multiple files at once
2. **Search:** Add search/filter functionality to file list
3. **Password Protection:** Allow setting password for share links

## Common Pitfalls to Avoid

1. **Client-side only validation:** Always validate on server
2. **Using sequential IDs:** Use UUIDs for security
3. **Trusting client MIME type:** Check actual file content
4. **Not handling upload errors:** Network can fail mid-upload
5. **Race conditions:** Handle concurrent uploads properly
6. **Memory leaks:** Stream large files, don't load into memory
7. **Filename collisions:** Use unique storage names
8. **XSS vulnerabilities:** Sanitize filenames for display

## Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Axios Upload Progress](https://axios-http.com/docs/req_config)
- [Node.js Streams](https://nodejs.org/api/stream.html)
- [UUID Generation](https://www.npmjs.com/package/uuid)
- [File Type Validation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

## Time Management

- **30 min:** Understand requirement, read TODOs, plan approach, setup project
- **30 min:** Task 1 (Upload & validation)
- **40 min:** Task 2 (Shareable links)
- **20 min:** Task 3 (Link expiry)
- **10 min:** Testing and bug fixes

Good luck!
