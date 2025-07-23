# Express Code Runner for Student Validation

This project allows you to run submitted code files (C++, Java, JavaScript) against prepared input/output sets for student assignment validation. Code execution is containerized using Podman for security.

## Installation

1. Requirements:
   - Node.js >= 14.0.0
   - Podman (container runtime)
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

- Code execution is containerized using Podman for isolation
- Execution time is limited to 10 seconds per submission
- Read-only volume mounts for code and problem files
- No network access within containers
- No persistent storage in containers
- All containers are removed after execution

## Dev Container Setup

This project includes a VS Code dev container setup with Podman support.

- The `.devcontainer/Dockerfile` sets up Podman in rootless mode
- The `.devcontainer/devcontainer.json` configures the container with appropriate privileges

**Usage:**
1. Reopen the project in the dev container (VS Code will prompt you)
2. The container will initialize Podman in rootless mode
3. You can run Podman commands directly in the dev container terminal

## Container Images

The system uses the following container images for code execution:
- C++: `docker.io/library/gcc:latest`
- Java: `docker.io/library/openjdk:latest`
- JavaScript: `docker.io/library/node:latest`

Images are pulled automatically if not present locally. Note that while we use images from Docker Hub, they are run using Podman.