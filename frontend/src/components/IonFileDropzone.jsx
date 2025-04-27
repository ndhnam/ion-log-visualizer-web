import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function IonFileDropzone({ onFileSelected, file }) {
  // Handle file drop & drag or click to choose file
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  // Dropzone props
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.ion'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone${isDragActive ? " active" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <div>
          <strong>Drag & drop an Ion file here</strong>
        </div>
        <div className="dropzone-text">or click to select a file</div>
        {file && <div className="dropzone-file-name">File: {file.name}</div>}
      </div>
    </div>
  );
}