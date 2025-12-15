# File Upload & Sharing Service - Interview Exercise

Welcome to the File Upload & Sharing Service coding exercise! You will implement key features of a modern file-sharing platform.

## Overview

This exercise involves building a file upload and sharing service with:
- Secure file uploads with validation
- Shareable links with expiration
- Download analytics

## Time Allocation

Total time: 120 minutes

- **Task 0: Project Setup** (30 minutes)
- **Task 1: Upload with Validation** (30 minutes)
- **Task 2: Shareable Links** (40 minutes)
- **Task 3: Link Expiry** (20 minutes)

## Getting Started

1. **Read the documentation:**
   - `QUICKSTART.md` - Setup instructions
   - `PROBLEM.md` - Problem description
   - `TASKS.md` - Detailed task breakdown

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Backend API: http://localhost:3000

4. **Begin implementing:**
   - Each task builds on the previous one
   - Test frequently to ensure correctness

## Tech Stack

**Backend:**
- Node.js + Express
- Multer (file upload handling)
- SQLite/MySQL/PostreSQL (database)
- UUID (token generation)


## File Validation Requirements

**Size Limit:** 10 MB per file

**Allowed Types:**
- Images: .jpg, .jpeg, .png, .gif, .webp
- Documents: .pdf, .doc, .docx, .txt
- Spreadsheets: .xls, .xlsx
- Presentations: .ppt, .pptx

## Link Expiry Options

- **24 hours** - Short-term sharing
- **7 days** - Week-long access
- **30 days** - Month-long access
- **Never** - Permanent link

## Project Structure

```
candidate/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app
│   │   ├── config/
│   │   │   ├── database.js     # SQLite config
│   │   │   └── multer.js       # File upload config
│   │   ├── models/
│   │   │   └── File.js         # File model
│   │   ├── routes/
│   │   │   └── files.js        # File routes (TODO: implement)
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── uploads/                # File storage
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data

Body: file (form-data)
Query params: expiryOption (24h, 7d, 30d, never)
```

### Get File Metadata
```http
GET /api/files/:id
```

### Download via Share Token
```http
GET /api/files/share/:token
```

### List All Files
```http
GET /api/files
```

### Delete File
```http
DELETE /api/files/:id
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

```

### Upload Directory Permissions
```bash
chmod 755 backend/uploads
```

### Database Issues
```bash
# Remove and restart
rm backend/database.sqlite
docker-compose restart
```

## Tips for Success

1. **Read BREADME carefully** - They contain hints and implementation steps
2. **Test incrementally** - Don't wait until the end to test
3. **Check the console** - Look for errors in terminal
4. **Use curl for testing** - Quick way to test backend endpoints
5. **Ask questions** - If requirements are unclear, ask the interviewer

## Testing Your Implementation

### Manual Testing

```bash
# Test upload with curl
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@test.pdf" \
  -F "expiryOption=7d"

# Test download by token
curl -O -J http://localhost:3000/api/files/share/{token}

# Check database
sqlite3 backend/database.sqlite "SELECT * FROM files;"
```


## Good Luck!

Take your time to understand the problem before diving into code. Focus on writing clean, working code rather than over-engineering. The interviewer is available for questions.