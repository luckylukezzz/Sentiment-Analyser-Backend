const { exec } = require('child_process');
const path = require('path');

function executePythonScript(asin) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'D:\\testingPrograms\\Sentiment-Analysier-flaskapp\\absa_pipeline.py';

    // Command to run in the terminal
    const command = `python ${scriptPath} ${asin}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error executing Python script: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
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
