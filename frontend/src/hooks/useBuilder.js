import { useState, useEffect } from 'react';
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
  const [syntaxStatus, setSyntaxStatus] = useState(null); // null | 'valid' | 'invalid'
  
  // Parse Confirmation Modal States
  const [showParseModal, setShowParseModal] = useState(false);
  const [pendingParsedData, setPendingParsedData] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load from local storage on mount

  useEffect(() => {
    const saved = localStorage.getItem('resume_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.resumeData) setResumeData(parsed.resumeData);
        if (parsed.templateType) setTemplateType(parsed.templateType);
        if (parsed.resumeId) setResumeId(parsed.resumeId);
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
      localStorage.setItem('resume_session', JSON.stringify({ resumeData, templateType, resumeId }));
    }
  }, [resumeData, templateType, resumeId]);

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
        
        const msg = res.data.hasStructure 
          ? "Resume regenerated with original formatting preserved! 🌟" 
          : "Resume generated from template 📄";
        toast.success(msg);
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

  const handleDownloadPdf = async () => {
    const latexCode = previewCode || generatedLatex;
    if (!latexCode) {
      toast.error("No LaTeX source available for PDF download.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/resume/compile`, { latexCode }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF download failed:', err);
      toast.error('Failed to download PDF. Try again or use the preview fallback.');
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
      skills: Array.isArray(data.skills) ? (
        // If it's an array of objects that ALREADY have categories, keep them
        data.skills.every(s => s && typeof s === 'object' && s.category && Array.isArray(s.items))
          ? data.skills 
          : [{ 
              category: 'Core Competencies', 
              items: data.skills.map(s => typeof s === 'string' ? s : (s.text || s.category || JSON.stringify(s))) 
            }]
      ) : [],
      projects: Array.isArray(data.projects) ? data.projects.map(p => ({
        title: p.title || '',
        techStack: p.techStack || '',
        bullets: Array.isArray(p.bullets) ? p.bullets : []
      })) : []
    };

    if (data.latexStructure && typeof data.latexStructure === 'string') {
      sanitized.latexStructure = data.latexStructure;
    }
    if (data.originalLatexCode && typeof data.originalLatexCode === 'string') {
      sanitized.originalLatexCode = data.originalLatexCode;
    }

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
          if (res.data.data.latexStructure) validated.latexStructure = res.data.data.latexStructure;
          if (res.data.data.originalLatexCode) validated.originalLatexCode = res.data.data.originalLatexCode;

          // Store parsed data and show modal for confirmation
          setPendingParsedData(validated);
          setShowParseModal(true);
          
          const msg = res.data.hasStructure 
            ? "LaTeX parsed! Choose how to proceed. ✅" 
            : "LaTeX parsed successfully! Choose how to proceed.";
          toast.success(msg);
        } else {
          console.warn("⚠️ AI VALIDATION FAILED. Structure:", res.data.data);
          throw new Error("Invalid structure returned");
        }
      }
    } catch (error) {
      console.error("❌ PARSE FAILED:", error);
      const details = error.response?.data?.details || error.message;
      toast.error(`Parsing failed: ${details}`);
    } finally {
      setLoading(false);
    }
  };

  const handleParseText = async (text) => {
    if (!text || !text.trim()) return toast.error("No text to parse.");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/parse-text`, { text });
      if (res.data.success) {
        const validated = validateResumeData(res.data.data);
        if (validated) {
          setPendingParsedData(validated);
          setShowParseModal(true);
          toast.success("AI parsed your resume content! Preview and confirm. 🚀");
        }
      }
    } catch (error) {
      toast.error(`Parsing failed: ${error.response?.data?.details || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleParseConfirm_KeepCurrent = () => {
    // Keep current data, just load LaTeX structure
    setResumeData(prev => ({
      ...prev,
      latexStructure: pendingParsedData?.latexStructure,
      originalLatexCode: pendingParsedData?.originalLatexCode
    }));
    setGeneratedLatex(pendingParsedData?.latexStructure || '');
    setPreviewCode(pendingParsedData?.latexStructure || '');
    setActiveTab('edit');
    setShowParseModal(false);
    setPendingParsedData(null);
    toast.success('LaTeX structure preserved. Your current data remains unchanged.');
  };

  const handleParseConfirm_UseParsed = () => {
    // Replace with parsed data
    setResumeData(pendingParsedData);
    setGeneratedLatex(pendingParsedData?.latexStructure || '');
    setPreviewCode(pendingParsedData?.latexStructure || '');
    setActiveTab('edit');
    setShowParseModal(false);
    setPendingParsedData(null);
    toast.success('Resume data updated with parsed LaTeX! 🚀');
  };

  const handleParseConfirm_Cancel = () => {
    setShowParseModal(false);
    setPendingParsedData(null);
    toast.error('Parse cancelled. Your data remains unchanged.');
  };

  const handleQuickJDMatch = async (manualResumeText = null) => {
    if (!jdText.trim()) return toast.error("Paste a Job Description first.");
    setLoadingStates(prev => ({ ...prev, jdMatch: true }));
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/jd-match`, {
        jobDescription: jdText,
        resumeText: manualResumeText || JSON.stringify(resumeData)
      });

      if (res.data.success) {
        setJdAnalysis(res.data);
        toast.success("ATS Analysis Ready!");
      }
    } catch {
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
        // Extract the actual content based on action type
        let displayData = res.data;
        if (actionType === 'cover-letter') displayData = res.data.coverLetterLatex;
        if (actionType === 'tailor') displayData = res.data.tailoredData;
        
        setAiResult({ type: actionType, data: displayData });
        toast.success(`${actionType.replace('-',' ')} generated!`, { icon: '🤖' });
      }
    } catch {
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
    } catch {
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
        // Handle both possible key names
        const improvedText = res.data.improvedText || (Array.isArray(res.data.suggestions) ? res.data.suggestions[0] : null);
        
        if (!improvedText) throw new Error("No suggestions returned");

        const newData = { ...resumeData };
        newData.experience[expIdx].bullets[bulletIdx] = improvedText;
        setResumeData(newData);
        toast.success("Bullet point enhanced!", { icon: '✨' });
      }
    } catch {
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
      latexInput, setLatexInput,
      syntaxStatus, setSyntaxStatus,
      // Parse Modal States
      showParseModal, 
      pendingParsedData,
      resumeId,
      isSyncing
    },
    actions: {
      handleGenerate,
      handleParse,
      handleParseText,
      handleParseConfirm_KeepCurrent,

      handleParseConfirm_UseParsed,
      handleParseConfirm_Cancel,
      handleCheckSyntax: async () => {
        if (!latexInput.trim()) {
           setSyntaxStatus(null);
           return;
        }
        try {
          const res = await axios.post(`${API_BASE_URL}/api/ai/check-syntax`, { latexCode: latexInput });
          if (res.data.success) {
            setSyntaxStatus(res.data.valid ? 'valid' : 'invalid');
          }
        } catch {
          setSyntaxStatus('invalid');
        }
      },
      handleQuickJDMatch,
      handleAiAction,
      handlePortfolioAnalyze,
      handleDownloadPdf,
      updatePersonal,
      handleEnhanceBullet,
      handleResetTemplate,
      handleCloudSync: async (userId) => {
        if (!userId) return toast.error("User ID required for cloud sync.");
        setIsSyncing(true);
        try {
          const res = await axios.post(`${API_BASE_URL}/api/resume/save`, {
            userId,
            resumeId,
            title: resumeData.personal?.name ? `${resumeData.personal.name}'s Resume` : 'Untitled Resume',
            resumeData,
            latexCode: generatedLatex,
            generatedLatex,
            templateType
          });
          if (res.data.success) {
            setResumeId(res.data.resumeId);
            toast.success("Synchronized with cloud! ☁️", { icon: '✅' });
          }
        } catch (err) {
          toast.error("Cloud sync failed. Working locally.");
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };
};
