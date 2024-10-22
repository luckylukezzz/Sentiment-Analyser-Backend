const { exec } = require('child_process');

function executePythonScript(asin) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'D:\\testingPrograms\\Sentiment-Analysier-flaskapp\\absa_pipeline.py';
    
    // Replace 'myenv' with the name of your Anaconda environment
    const condaEnv = 'MLenv';

    // Command to activate the conda environment and run the Python script
    const command = `start cmd.exe /K "conda activate ${condaEnv} && python ${scriptPath} ${asin}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error opening terminal or executing command: ${stderr}`));
      } else {
        // No need to resolve or reject here since the command runs in a new terminal
        resolve('Terminal opened and command executed.');
      }
    });
  });
}

async function runPythonScript(asin) {
  try {
    const result = await executePythonScript(asin);
    console.log(result);
  } catch (error) {
    console.error('Error executing Python script:', error);
  }
}

module.exports = { runPythonScript };
