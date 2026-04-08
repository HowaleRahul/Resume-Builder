import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useBuilder = () => {
  const [resumeData, setResumeData] = useState(null);
  const [templateType, setTemplateType] = useState('jitin-nair');
  const [generatedLatex, setGeneratedLatex] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [codeEditMode, setCodeEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compileError, setCompileError] = useState(null);
  
  // New: Advanced Loading States for AI feedback
  const [loadingStates, setLoadingStates] = useState({
    enhancingBullet: null, // index of bullet being enhanced
    generatingAts: false,
    tailoring: false,
    jdMatch: false
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.resumeData) setResumeData(parsed.resumeData);
        if (parsed.templateType) setTemplateType(parsed.templateType);
      } catch (e) { 
        console.error("Failed to load session", e);
        initializeEmptyData();
      }
    } else {
      initializeEmptyData();
    }
  }, []);

  const initializeEmptyData = () => {
    setResumeData({
      personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '', website: '', objective: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: []
    });
  };

  // Save to local storage on data change
  useEffect(() => {
    if (resumeData) {
      localStorage.setItem('resume_session', JSON.stringify({ resumeData, templateType }));
    }
  }, [resumeData, templateType]);

  const handleGenerate = async (data = resumeData, type = templateType) => {
    if (!data) return;
    setLoading(true);
    setCompileError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/resume/generate`, {
        resumeData: data,
        templateType: type
      });
      if (res.data.success) {
        setGeneratedLatex(res.data.latexCode);
        setPreviewCode(res.data.latexCode);
        toast.success("Resume Compiled Successfully!");
      }
    } catch (err) {
      setCompileError({
        message: err.response?.data?.message || "Compilation failed",
        log: err.response?.data?.error || "Check your LaTeX syntax"
      });
      toast.error("Compilation Error");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleEnhanceBullet = async (expIdx, bulletIdx, bulletText) => {
    if (!bulletText.trim()) return;
    
    setLoadingStates(prev => ({ ...prev, enhancingBullet: `${expIdx}-${bulletIdx}` }));
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/improve`, { text: bulletText });
      if (res.data.success) {
        const improvedText = res.data.improvedText;
        const newData = { ...resumeData };
        newData.experience[expIdx].bullets[bulletIdx] = improvedText;
        setResumeData(newData);
        toast.success("Bullet point enhanced!", { icon: '✨' });
      }
    } catch (err) {
      toast.error("AI Enhancement failed");
    } finally {
      setLoadingStates(prev => ({ ...prev, enhancingBullet: null }));
    }
  };

  const handleResetTemplate = () => {
    if (window.confirm("Reset all changes to template default?")) {
      window.location.reload();
    }
  };

  return {
    state: {
      resumeData, setResumeData,
      templateType, setTemplateType,
      generatedLatex, setGeneratedLatex,
      previewCode, setPreviewCode,
      activeTab, setActiveTab,
      codeEditMode, setCodeEditMode,
      loading, compileError,
      loadingStates
    },
    actions: {
      handleGenerate,
      updatePersonal,
      handleEnhanceBullet,
      handleResetTemplate
    }
  };
};
