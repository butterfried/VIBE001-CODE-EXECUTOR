const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/submit', (req, res) => {
  const startTime = process.hrtime();
  const { language, problemId, filename } = req.body;
  if (!language || !problemId || !filename) {
    return res.status(400).json({ error: 'Missing required fields: language, problemId, filename' });
  }
  // Remove any old code validation error message

  // Path to submissions directory
  const submissionsDir = path.join(__dirname, '../submissions');
  const filepath = path.join(submissionsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(400).json({ error: 'Submitted code file not found' });
  }

  // Load problem input
  const inputPath = path.join(__dirname, `../problems/${problemId}/input.txt`);
  let inputData = '';
  try {
    inputData = fs.readFileSync(inputPath, 'utf8');
  } catch (err) {
    return res.status(400).json({ error: 'Problem input not found' });
  }

  const { exec, spawn } = require('child_process');

  function runCode(callback) {
    const { execSync, exec } = require('child_process');
    // Check if Docker is available
    try {
      execSync('podman --version', { stdio: 'ignore' });
    } catch (e) {
      callback('Error: Docker is not installed or not available in PATH. All code execution is disabled.');
      return;
    }

    // Determine required image
    let requiredImage = '';
    if (language === 'cpp') {
      requiredImage = 'docker.io/library/gcc:latest';
    } else if (language === 'java') {
      requiredImage = 'docker.io/library/openjdk:latest';
    } else if (language === 'javascript') {
      requiredImage = 'docker.io/library/node:latest';
    }

    // Check if image exists
    let imageExists = false;
    try {
      execSync(`podman image inspect ${requiredImage}`, { stdio: 'ignore' });
      imageExists = true;
    } catch (e) {
      imageExists = false;
    }

    // Pull image if not exists (no timeout)
    if (!imageExists) {
      try {
        execSync(`podman pull ${requiredImage}`, { stdio: 'inherit' });
      } catch (e) {
        callback('Error: Failed to pull required Docker image.');
        return;
      }
    }

    let dockerCmd = '';
    let execCmd = '';
    let containerTimeout = 10; // seconds

    if (language === 'cpp') {
      execCmd = `g++ /submissions/${filename} -o /tmp/a.out && /tmp/a.out`;
      dockerCmd = `podman run --rm -i -v "${__dirname}/../submissions:/submissions:ro" -v "${__dirname}/../problems:/problems:ro" docker.io/library/gcc:latest bash -c '${execCmd}'`;
    } else if (language === 'java') {
      const className = path.basename(filename, '.java');
      execCmd = `mkdir -p /tmp/java && cp /submissions/${filename} /tmp/java/ && cd /tmp/java && javac ${filename} && java ${className}`;
      dockerCmd = `podman run --rm -i -v "${__dirname}/../submissions:/submissions:ro" -v "${__dirname}/../problems:/problems:ro" docker.io/library/openjdk:latest bash -c '${execCmd}'`;
    } else if (language === 'javascript') {
      execCmd = `node /submissions/${filename}`;
      dockerCmd = `podman run --rm -i -v "${__dirname}/../submissions:/submissions:ro" -v "${__dirname}/../problems:/problems:ro" docker.io/library/node:latest bash -c '${execCmd}'`;
    } else {
      callback('Unsupported language');
      return;
    }

    const proc = exec(dockerCmd, { timeout: containerTimeout * 1000 }, (err, stdout, stderr) => {
      if (err && err.killed) return callback('Error: Execution timed out');
      if (stderr && !stdout) return callback(stderr);
      callback(stderr ? stderr + stdout : stdout);
    });

    proc.stdin.write(inputData);
    proc.stdin.end();
  }

  // Start measuring code execution time
  const execStartTime = process.hrtime();
  runCode((result) => {
    // Calculate execution time
    const execDiff = process.hrtime(execStartTime);
    const execTime = (execDiff[0] * 1e9 + execDiff[1]) / 1e6; // Convert to milliseconds
    
    // Calculate total time
    const totalDiff = process.hrtime(startTime);
    const totalTime = (totalDiff[0] * 1e9 + totalDiff[1]) / 1e6; // Convert to milliseconds
    // Load expected output
    const outputPath = path.join(__dirname, `../problems/${problemId}/output.txt`);
    let expectedOutput = '';
    try {
      expectedOutput = fs.readFileSync(outputPath, 'utf8').trim();
    } catch (err) {
      return res.status(400).json({ error: 'Problem output not found' });
    }

    const actualOutput = result.trim();
    const isCorrect = actualOutput === expectedOutput;

    res.json({
      message: 'Code executed and validated',
      language,
      problemId,
      codeFile: filename,
      input: inputData.trim(),
      output: actualOutput,
      expected: expectedOutput,
      correct: isCorrect,
      timing: {
        execution: execTime.toFixed(2) + 'ms',
        total: totalTime.toFixed(2) + 'ms'
      }
    });
  });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});