import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
 
  const [randomImages, setRandomImages] = useState([]);
   const [dogImage, setDogImage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dogFile, setDogFile] = useState(null);
  const [message, setMessage] = useState("");



  //fetch multiple images
  const fetchRandomImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch/random-images");
      setRandomImages(response.data.images);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch random images :(");
    }
  };

  //fetch a random dog image
  const fetchDogImage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch/random-dog");
      setDogImage(response.data.image);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch dog image :(");
    }
  };

  //handle file selection with selected files
  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  // handle file selection for dog image upload
  const handleDogFileChange = (e) => {
    setDogFile(e.target.files[0]);
  };

  //upload multiple images 
  const uploadMultipleImages = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setMessage("Please select up to 3 images!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post("http://localhost:8000/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload images :(");
    }
  };

  // Upload fetched dog image
  const uploadDogImage = async (e) => {
    e.preventDefault();
    if (!dogFile) {
      setMessage("Please select a dog image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("dogImage", dogFile);

    try {
      const response = await axios.post("http://localhost:8000/upload/dog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload dog image :(");
    }
  };

  return (
    <div className="container">
      <h1>Lab 3 - Image Upload & Fetch</h1>

    <button onClick={fetchRandomImages}>Fetch Random Images</button>
      <div>
        {randomImages.map((image, index) => (
          <img key={index} src={image} alt="Random" width="200px" />
        ))}
      </div>

      <button onClick={fetchDogImage}>Fetch Dog Image</button>
      {dogImage && <img src={dogImage} alt="Dog" width="200px" />}

      <form onSubmit={uploadMultipleImages}>
        <h2>Upload Multiple Images (Max 3)</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <form onSubmit={uploadDogImage}>
        <h2>Upload Dog Image</h2>
        <input type="file" onChange={handleDogFileChange} />
        <button type="submit">Upload Dog</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default App;
