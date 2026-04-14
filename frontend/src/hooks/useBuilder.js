import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import API_BASE_URL from '../config/api';

export const useBuilder = () => {
  const [resumeData, setResumeData] = useState(null);
  const [templateType, setTemplateType] = useState('jitin-nair');
  const [generatedLatex, setGeneratedLatex] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [codeEditMode, setCodeEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compileError, setCompileError] = useState(null);
  
  // Advanced Loading States for AI feedback
  const [loadingStates, setLoadingStates] = useState({
    enhancingBullet: null, 
    generatingAts: false,
    tailoring: false,
    jdMatch: false,
    generatingLetter: false,
    skillGap: false,
    interviewPrep: false,
    analyzingPortfolio: false
  });

  // Missing States for AI PowerLab & Parsing
  const [jdSidebarOpen, setJdSidebarOpen] = useState(false);
  const [jdText, setJdText] = useState('');
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [aiResult, setAiResult] = useState(null); // { type: string, data: any }
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [latexInput, setLatexInput] = useState('');

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

  const validateResumeData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    // Ensure critical structures exist
    const sanitized = {
      personal: { 
        name: data.personal?.name || '', 
        email: data.personal?.email || '', 
        phone: data.personal?.phone || '', 
        location: data.personal?.location || '',
        github: data.personal?.github || '',
        linkedin: data.personal?.linkedin || '',
        website: data.personal?.website || '',
        objective: data.personal?.objective || ''
      },
      summary: data.summary || '',
      experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
        title: exp.title || '',
        companyOrInst: exp.companyOrInst || '',
        location: exp.location || '',
        date: exp.date || '',
        bullets: Array.isArray(exp.bullets) ? exp.bullets : []
      })) : [],
      education: Array.isArray(data.education) ? data.education.map(edu => ({
        title: edu.title || '',
        companyOrInst: edu.companyOrInst || '',
        location: edu.location || '',
        date: edu.date || '',
        details: edu.details || ''
      })) : [],
      skills: Array.isArray(data.skills) ? data.skills.map(s => ({
        category: s.category || '',
        items: Array.isArray(s.items) ? s.items : []
      })) : [],
      projects: Array.isArray(data.projects) ? data.projects.map(p => ({
        title: p.title || '',
        techStack: p.techStack || '',
        bullets: Array.isArray(p.bullets) ? p.bullets : []
      })) : []
    };
    return sanitized;
  };

  const handleParse = async () => {
    if (!latexInput.trim()) return toast.error("Please paste LaTeX code first.");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/resume/parse`, { latexCode: latexInput });
      
      // DIAGNOSTIC LOGGING
      console.log("🔍 AI RAW RESPONSE:", res.data);

      if (res.data.success) {
        const validated = validateResumeData(res.data.data);
        if (validated) {
          setResumeData(validated);
          setActiveTab('edit');
          toast.success("Resume Parsed Successfully!");
        } else {
          console.warn("⚠️ AI VALIDATION FAILED. Structure:", res.data.data);
          throw new Error("Invalid structure returned");
        }
      }
    } catch (err) {
      console.error("❌ PARSE FAILED:", {
        message: err.message,
        response: err.response?.data,
        latex: latexInput.substring(0, 100) + "..."
      });
      toast.error("Parsing failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickJDMatch = async () => {
    if (!jdText.trim()) return toast.error("Paste a Job Description first.");
    setLoadingStates(prev => ({ ...prev, jdMatch: true }));
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/jd-match`, {
        jobDescription: jdText,
        resumeText: JSON.stringify(resumeData)
      });
      if (res.data.success) {
        setJdAnalysis(res.data);
        toast.success("ATS Analysis Ready!");
      }
    } catch (err) {
      toast.error("Analysis failed.");
    } finally {
      setLoadingStates(prev => ({ ...prev, jdMatch: false }));
    }
  };

  const handleAiAction = async (actionType) => {
    if (!jdText.trim()) return toast.error("Paste a Job Description first.");
    
    // Map loading states
    const statusMap = {
      'tailor': 'tailoring',
      'cover-letter': 'generatingLetter',
      'skill-gap': 'skillGap',
      'interview-prep': 'interviewPrep'
    };
    
    const loadingKey = statusMap[actionType];
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      const endpointMap = {
        'tailor': '/api/ai/tailor',
        'cover-letter': '/api/ai/cover-letter',
        'skill-gap': '/api/ai/skill-gap',
        'interview-prep': '/api/ai/interview-prep'
      };

      const res = await axios.post(`${API_BASE_URL}${endpointMap[actionType]}`, {
        resumeData,
        jobDescription: jdText
      });

      if (res.data.success) {
        setAiResult({ type: actionType, data: res.data });
        toast.success(`${actionType.replace('-',' ')} generated!`, { icon: '🤖' });
      }
    } catch (err) {
      toast.error(`${actionType} failed.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handlePortfolioAnalyze = async () => {
    if (!portfolioUrl.trim()) return toast.error("Enter a URL first.");
    setLoadingStates(prev => ({ ...prev, analyzingPortfolio: true }));
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/analyze-portfolio`, { url: portfolioUrl });
      if (res.data.success) {
        setAiResult({ type: 'portfolio-extraction', data: res.data.extractedData });
        toast.success("Portfolio Analyzed!");
      }
    } catch (err) {
      toast.error("Portfolio analysis failed.");
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzingPortfolio: false }));
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
      loadingStates,
      // Missing States
      jdSidebarOpen, setJdSidebarOpen,
      jdText, setJdText,
      jdAnalysis,
      aiResult, setAiResult,
      portfolioUrl, setPortfolioUrl,
      latexInput, setLatexInput
    },
    actions: {
      handleGenerate,
      handleParse,
      handleQuickJDMatch,
      handleAiAction,
      handlePortfolioAnalyze,
      updatePersonal,
      handleEnhanceBullet,
      handleResetTemplate
    }
  };
};
