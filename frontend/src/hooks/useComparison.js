import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useComparison = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('jd'); // 'jd' | 'compare'
  
  // JD Match state
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jdResult, setJdResult] = useState(null);

  // Compare state
  const [compareInputMode, setCompareInputMode] = useState('latex');
  const [resumeAText, setResumeAText] = useState('');
  const [resumeBText, setResumeBText] = useState('');
  const [resumeALabel, setResumeALabel] = useState('Resume A');
  const [resumeBLabel, setResumeBLabel] = useState('Resume B');
  const [compareResult, setCompareResult] = useState(null);

  const handleJDMatch = async () => {
    if (!jdText.trim() || !resumeText.trim()) {
      toast.error('Please provide both JD and Resume');
      return;
    }
    setLoading(true);
    setJdResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/jd-match`, {
        jobDescription: jdText,
        resumeText: resumeText
      });
      if (res.data.success) {
        setJdResult(res.data);
        toast.success(`Match Score: ${res.data.score}%`, { icon: '🎯' });
      }
    } catch (err) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!resumeAText.trim() || !resumeBText.trim()) {
      toast.error('Please provide both resumes');
      return;
    }
    setLoading(true);
    setCompareResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/compare-text`, {
        resumeAText,
        resumeBText,
        resumeALabel,
        resumeBLabel,
        inputMode: compareInputMode
      });
      if (res.data.success) {
        setCompareResult(res.data.data);
      }
    } catch (err) {
      toast.error('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/parse-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success("PDF Content Extracted!", { icon: '📄' });
        return res.data.text;
      }
    } catch (err) {
      toast.error("Failed to parse PDF");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      mode, setMode,
      loading,
      jdText, setJdText,
      resumeText, setResumeText,
      jdResult,
      compareInputMode, setCompareInputMode,
      resumeAText, setResumeAText,
      resumeBText, setResumeBText,
      resumeALabel, setResumeALabel,
      resumeBLabel, setResumeBLabel,
      compareResult
    },
    actions: {
      handleJDMatch,
      handleCompare,
      handlePdfUpload
    }
  };
};
