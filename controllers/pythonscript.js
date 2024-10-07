//It uses the child_process.spawn method to create a new Python process.
// It sets up event listeners for the process's stdout and stderr streams to capture output.
// It sends the ASIN to the Python script's stdin.
// It returns a Promise that resolves with the script's output or rejects with an error if the script fails.


const { spawn } = require('child_process');
const path = require('path');

function executePythonScript(asin) {
  return new Promise((resolve, reject) => {
    // Assuming the Python script is in the same directory as this Node.js file
    const scriptPath = path.join(__dirname, 'main.py');

    // Spawn a new Python process
    const pythonProcess = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    // Capture stdout data
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Capture stderr data
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}\nError: ${errorOutput}`));
      } else {
        resolve(output);
      }
    });

    // Send the ASIN to the Python script's stdin
    pythonProcess.stdin.write(asin + '\n');
    pythonProcess.stdin.end();
  });
}

// Example usage
async function runPythonScript(asin) {
  try {
    const result = await executePythonScript(asin);
    console.log('Python script output:', result);
  } catch (error) {
    console.error('Error executing Python script:', error);
  }
}

// Export the function so it can be used in other parts of your Node.js application
module.exports = { runPythonScript };