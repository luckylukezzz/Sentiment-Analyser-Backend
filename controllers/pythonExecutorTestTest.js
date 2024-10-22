const { runPythonScript } = require('./pythonExecutor'); // Adjust the path to your module

// Example ASIN to pass to the Python script
const asin = 'B08N5WRWNW';

async function main() {
  try {
    // Run the Python script with the given ASIN
    const result = await runPythonScript(asin);

    // Log the output of the Python script
    console.log('Python Script Output:', result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main(); // Call the main function to run the async function
