import React, { useState } from 'react';
import Clarifai from 'clarifai';
import ParticleBackground from './components/particleBackground/ParticleBackground';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: '12e8030dbe1049549f8f7c68248b5a24'
 });

  function App() {
    const [input, setInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [box, setBox] = useState({});
   
    const calculateFaceLocation = (data) => {
      const clarifaiFace =
        data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    };
   
    const displayFaceBox = (box) => {
      console.log(box);
      setBox(box);
    };
   
    const onInputChange = (e) => {
      setInput(e.target.value);
    };
   
    const onButtonSubmit = () => {
      setImageUrl(input);
      app.models
        .initModel({
          id: Clarifai.FACE_DETECT_MODEL,
        })
        .then((faceDetectModel) => {
          return faceDetectModel.predict(input);
        })
        .then((response) => displayFaceBox(calculateFaceLocation(response)))
        .catch((err) => console.log(err));
    };
   
    return (
      <div className="App">
        <ParticleBackground />
        <Logo />
        <ImageLinkForm
          onInputChange={onInputChange}
          onButtonSubmit={onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
    );
  }
   
  export default App;
