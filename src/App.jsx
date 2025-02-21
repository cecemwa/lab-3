import { useState } from "react";
import axios from "axios";
import "./App.css"; 

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [dogImage, setDogImage] = useState("");
  const [selectedDogFile, setSelectedDogFile] = useState(null);

  //multiple files upload 
  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      setMessage("You can only upload up to 3 images.");
      return;
    }

    setSelectedFiles(files);
    setMessage("");
  };

  
  const handleSubmitMultipleFiles = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setMessage("Please select files before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      const response = await axios.post("http://localhost:8000/save/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Files uploaded successfully!");
      setUploadedFiles(response.data.filePaths);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error:", error);
      setMessage("File upload failed.");
    }
  };

  //fetches random dog image
  const fetchDogImage = async () => {
    try {
      const response = await axios.get("https://dog.ceo/api/breeds/image/random");
      setDogImage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch dog image.");
    }
  };

  
  const handleDogFileChange = (e) => {
    setSelectedDogFile(e.target.files[0]);
  };

  //submits dog image tothe server
  const handleDogImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedDogFile) {
      setMessage("Please select a dog image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("dogImage", selectedDogFile);

    try {
      const response = await axios.post("http://localhost:8000/upload/dog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Dog image upload failed.");
    }
  };

  return (
    <div className="container">
      <h1>File Upload System</h1>

      
      <form onSubmit={handleSubmitMultipleFiles} className="form">
        <h2>Upload Multiple Images</h2>
        <input type="file" multiple onChange={handleMultipleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <div className="dog-section">
        <h2>Fetch Random Dog Image</h2>
        <button onClick={fetchDogImage}>Get Dog Image</button>
        {dogImage && <img src={dogImage} alt="Dog" className="dog-image" />}
      </div>

      <form onSubmit={handleDogImageUpload} className="form">
        <h2>Submit a Dog Image</h2>
        <input type="file" onChange={handleDogFileChange} />
        <button type="submit">Upload Dog Image</button>
      </form>

      <p className="message">{message}</p>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h2>Uploaded Files:</h2>
          {uploadedFiles.map((file, index) => (
            <img key={index} src={`http://localhost:8000/uploads/${file}`} alt="Uploaded" className="uploaded-image" />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
