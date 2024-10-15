/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccessMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setConvertedFileUrl(response.data.docxPath);
      setSuccessMessage("File has been successfully converted to DOCX!");
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-[10%] bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        PDF to Word Converter
      </h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Converting..." : "Convert to DOCX"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-red-600">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-center text-green-600">
          {successMessage}
        </p>
      )}

      {convertedFileUrl && (
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-800 mb-2">
            Your file has been converted into DOCX!
          </p>
          <a
            href={`http://localhost:4000/backend/doc/${convertedFileUrl}`}
            download
            className="inline-block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Download Converted DOCX
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
