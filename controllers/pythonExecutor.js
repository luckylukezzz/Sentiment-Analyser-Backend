//It uses the child_process.spawn method to create a new Python process.
// It sets up event listeners for the process's stdout and stderr streams to capture output.
// It sends the ASIN to the Python script's stdin.
// It returns a Promise that resolves with the script's output or rejects with an error if the script fails.


const { spawn } = require('child_process');
const path = require('path');

function executePythonScript(asin) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'D:\\testingPrograms\\Sentiment-Analysier-flaskapp\\test.py';
    const pythonProcess = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}\nError: ${errorOutput}`));
      } else {
        resolve(output);
      }
    });

    pythonProcess.stdin.write(asin + '\n');
    pythonProcess.stdin.end();
  });
}

async function runPythonScript(asin) {
  try {
    const result = await executePythonScript(asin);
    return result;
  } catch (error) {
    console.error('Error executing Python script:', error);
    throw error;
  }
}

module.exports = { runPythonScript };