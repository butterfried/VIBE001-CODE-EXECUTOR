# Express Code Runner for Student Validation

This project allows you to run submitted code files (C++, Java, JavaScript) against prepared input/output sets for student assignment validation. Code execution is containerized using Docker/Podman for security.

## Installation

1. Requirements:
   - Node.js >= 14.0.0
   - Docker or Podman
   - VS Code (for development)

2. Setup:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API

### POST `/submit`

Submit code for validation.

**Request Body (JSON):**
- `language`: `"cpp"`, `"java"`, or `"javascript"`
- `filename`: name of the file in submissions directory
- `problemId`: the problem folder name (e.g., `"sample"`)

**Example:**
```json
{
  "language": "cpp",
  "filename": "solution.cpp",
  "problemId": "sample"
}
```

**Response:**
```json
{
  "message": "Code executed and validated",
  "language": "cpp",
  "problemId": "sample",
  "codeFile": "solution.cpp",
  "input": "2 3",
  "output": "5",
  "expected": "5",
  "correct": true,
  "timing": {
    "execution": "42.50ms",
    "total": "45.20ms"
  }
}
```

## Problem Structure

Each problem should have:
- `problems/{problemId}/input.txt` — input for the code
- `problems/{problemId}/output.txt` — expected output

## Security

- Code execution is containerized using Docker/Podman for isolation
- Execution time is limited to 10 seconds per submission
- Read-only volume mounts for code and problem files
- No network access within containers
- No persistent storage in containers
- All containers are removed after execution

## Dev Container with Docker-in-Docker

This project includes a VS Code dev container setup with Docker-in-Docker support.

- The `.devcontainer/Dockerfile` installs Docker inside the container
- The `.devcontainer/devcontainer.json` configures the container to run with Docker privileges

**Usage:**
1. Reopen the project in the dev container (VS Code will prompt you)
2. You can run Docker commands inside the dev container terminal
3. The Docker extension is pre-installed for convenience

## Container Images

The system uses the following Docker images for code execution:
- C++: `docker.io/library/gcc:latest`
- Java: `docker.io/library/openjdk:latest`
- JavaScript: `docker.io/library/node:latest`

Images are pulled automatically if not present locally.