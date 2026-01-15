import React, { useState, useRef } from 'react';
import pdfService from '../services/pdf.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Navbar from '../components/layout/Navbar';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * PDF Summarizer page for uploading and summarizing PDF documents
 */
const PDFSummarizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        setSelectedFile(null);
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
      setSummary('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await pdfService.summarizePDF(selectedFile);
      setSummary(response.summary);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to summarize PDF. Please try again.');
      setSummary('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSummary('');
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 p-4 rounded-full">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">PDF Summarizer</h1>
            <p className="text-gray-600 mt-2">Upload a PDF and get an AI-generated summary</p>
          </div>

          {/* Upload Section */}
          <Card className="mb-6">
            <div className="space-y-6">
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button variant="secondary" onClick={handleButtonClick}>
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-600 mt-1">PDF files only (Max 10MB)</p>
                    </div>
                    <Button variant="primary" onClick={handleButtonClick}>
                      Select PDF File
                    </Button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>PDF summarized successfully!</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {isLoading ? 'Processing...' : 'Summarize PDF'}
                </Button>
                {(selectedFile || summary) && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <div className="py-12">
                <Loader size="lg" text="Analyzing and summarizing your PDF..." />
              </div>
            </Card>
          )}

          {/* Summary Display */}
          {summary && !isLoading && (
            <Card title="Summary" subtitle="AI-generated summary of your PDF">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>
              
              {/* Copy to Clipboard Button */}
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(summary);
                    alert('Summary copied to clipboard!');
                  }}
                >
                  Copy to Clipboard
                </Button>
              </div>
            </Card>
          )}

          {/* Instructions */}
          {!summary && !isLoading && (
            <Card title="How it works">
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload your PDF</h4>
                    <p className="text-sm text-gray-600">Select a PDF file from your device (max 10MB)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI Processing</h4>
                    <p className="text-sm text-gray-600">Our AI will analyze and extract key information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Get Summary</h4>
                    <p className="text-sm text-gray-600">Receive a concise summary of your document</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default PDFSummarizer;