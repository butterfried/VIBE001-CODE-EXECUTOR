# Express Code Runner for Student Validation

This project allows you to run submitted code files (C++, Java, JavaScript) against prepared input/output sets for student assignment validation.

## API

### POST `/submit`

Submit code for validation.

**Request Body (JSON):**
- `language`: `"cpp"`, `"java"`, or `"javascript"`
- `code`: source code as a string
- `problemId`: the problem folder name (e.g., `"sample"`)

**Example:**
```json
{
  "language": "cpp",
  "code": "#include <iostream>\nint main() { int a, b; std::cin >> a >> b; std::cout << (a+b); return 0; }",
  "problemId": "sample"
}
```

**Response:**
```json
{
  "message": "Code executed and validated",
  "language": "cpp",
  "problemId": "sample",
  "codeFile": "submission_1721715390000.cpp",
  "input": "2 3",
  "output": "5",
  "expected": "5",
  "correct": true
}
```

## Problem Structure

Each problem should have:
- `problems/{problemId}/input.txt` — input for the code
- `problems/{problemId}/output.txt` — expected output

## Security

- Code execution is limited to 3 seconds.
- No advanced sandboxing is implemented; use with caution and never expose to untrusted users in production.

## Requirements

- Node.js
- g++ (for C++)
- javac/java (for Java)
- node (for JavaScript)
## Dev Container with Docker-in-Docker

This project includes a VS Code dev container setup with Docker-in-Docker support.

- The `.devcontainer/Dockerfile` installs Docker inside the container.
- The `.devcontainer/devcontainer.json` configures the container to run with Docker privileges.

**Usage:**
1. Reopen the project in the dev container (VS Code will prompt you).
2. You can run Docker commands inside the dev container terminal.
3. The Docker extension is pre-installed for convenience.