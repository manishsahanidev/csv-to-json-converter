// file upload form
const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    showMessage(
      "message",
      '<span class="text-danger">Please select a file</span>'
    );
    return;
  }

  try {
    const formData = new FormData();
    formData.append("csvFile", file);

    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showMessage(
      "message",
      '<span class="text-success">File uploaded successfully</span>'
    );
    showJsonOutput(response.data);
  } catch (error) {
    showMessage(
      "message",
      `<span class="text-danger">${error.response.data}</span>`
    );
  }
});

// Clear button event listener
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get("/clear");
    showMessage(
      "message",
      `<span class="text-success">${response.data}</span>`
    );
    clearJsonOutput();
  } catch (error) {
    showMessage(
      "message",
      `<span class="text-danger">${error.response.data}</span>`
    );
  }
});

// Utility functions
function showMessage(elementId, message) {
  document.getElementById(elementId).innerHTML = message;
}

function showJsonOutput(data) {
  document.getElementById("jsonOutput").innerHTML = `<pre>${JSON.stringify(
    data,
    null,
    2
  )}</pre>`;
}

function clearJsonOutput() {
  document.getElementById("jsonOutput").innerHTML = "";
}
