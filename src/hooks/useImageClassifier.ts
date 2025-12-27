import { useState } from 'react';
import * as tmImage from '@teachablemachine/image';

// ⚠️ IMPORTANT: REPLACE THIS with your specific URL from Teachable Machine
// It must end with a trailing slash (e.g., .../model/)
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/DyNlyyYdq/";

export const useImageClassifier = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifyImage = async (imageFile: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 1. Load the model and metadata
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";
      
      // Load the model (this downloads it from Google's servers)
      const model = await tmImage.load(modelURL, metadataURL);

      // 2. Convert the uploaded File to an HTML Image Element
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(imageFile);

      // Wait for the image to actually load into memory
      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
      });

      // 3. Run the Prediction
      const predictions = await model.predict(imageElement);
      
      // 4. Sort results to find the highest match
      predictions.sort((a, b) => b.probability - a.probability);
      const topResult = predictions[0];

      // 5. Save the results
      setPrediction(topResult.className); // e.g., "Vehicle Damage"
      setConfidence(topResult.probability); // e.g., 0.98

      console.log("AI Results:", predictions);

    } catch (err) {
      console.error("AI Error:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { classifyImage, prediction, confidence, isAnalyzing, error };
};