import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const groupId = '7fbd53d4-ec6c-4021-99a0-fc2e86f2a1b6';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file) {
            setMessage('❌ Please select a file first.');
            return;
        }

        setIsUploading(true);
        setMessage('⏳ Uploading...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('groupId', groupId);

        try {
            const response = await fetch('http://localhost:5000/api/refuelings/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();
            setMessage('✅ Upload successful!');
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            setMessage('❌ Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} disabled={isUploading} />
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
