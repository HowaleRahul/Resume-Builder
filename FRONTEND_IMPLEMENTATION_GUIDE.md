# 🚀 Frontend Implementation Guide - LaTeX Fidelity System

## Quick Setup for React Frontend

### 1. Update PDF Download Function

**File**: `frontend/src/hooks/useBuilder.js` or your resume export component

```javascript
// BEFORE: Direct PDF download with data loss
const downloadPdfOld = async (latexCode) => {
  try {
    const response = await axios.post('/api/resume/compile', {
      latexCode
    }, {
      responseType: 'arraybuffer'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    toast.error('Failed to download PDF');
  }
};

// AFTER: Smart PDF download with fidelity preservation
const downloadPdfNew = async (latexCode, resumeId) => {
  try {
    const response = await axios.post('/api/resume/compile', {
      latexCode,
      resumeId            // ← Add this parameter!
    }, {
      responseType: 'arraybuffer'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('PDF downloaded with original formatting preserved!');
  } catch (error) {
    toast.error('Failed to download PDF: ' + error.response?.data?.error);
  }
};
```

### 2. Update Visual Editor Save Function

**File**: `frontend/src/components/VisualEditor.jsx` or similar

```javascript
// BEFORE: Direct regeneration without reconciliation
const saveEditsOld = async (editedData) => {
  const newLatex = await axios.post('/api/resume/generate', {
    resumeData: editedData,
    template: templateType
  });
  
  setLatexCode(newLatex.data.latexCode);
};

// AFTER: Smart update with LaTeX reconciliation
const saveEditsNew = async (editedData) => {
  try {
    const response = await axios.post('/api/resume/update', {
      resumeId: currentResumeId,        // Pass the resume ID
      editedData,                        // The edited JSON data
      template: templateType
    });
    
    // Get the intelligently reconciled LaTeX
    const { latexCode, message } = response.data;
    setLatexCode(latexCode);
    
    toast.success(message); // "Resume updated successfully. Original formatting preserved..."
  } catch (error) {
    toast.error('Failed to save edits: ' + error.response?.data?.error);
  }
};
```

### 3. Update Resume Initialization

**File**: `frontend/src/hooks/useResume.js` or your resume hook

```javascript
// When loading a resume from database
const loadResume = async (resumeId) => {
  const resume = await axios.get(`/api/resume/${resumeId}`);
  
  // Store BOTH the original and current state
  setResumeData({
    id: resume._id,
    originalLatexCode: resume.originalLatexCode,  // ← Store this!
    currentLatexCode: resume.generatedLatexCode || resume.originalLatexCode,
    parsedData: {
      personal: resume.personal,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      skills: resume.skills
    }
  });
};
```

### 4. Update Export Button Handler

**File**: Your export/download component

```javascript
const handleExportPdf = async () => {
  // Use the new smart endpoint
  await downloadPdfNew(
    resumeData.currentLatexCode,    // Current LaTeX (may be edited)
    resumeData.id                   // Resume ID for reconciliation
  );
};
```

---

## Complete Example Component

```jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function ResumeEditor({ resumeId }) {
  const [latexCode, setLatexCode] = useState('');
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load resume with original LaTeX preserved
  const loadResume = async () => {
    try {
      const response = await axios.get(`/api/resume/${resumeId}`);
      setLatexCode(response.data.resume.originalLatexCode || response.data.resume.generatedLatexCode);
      setEditData(response.data.resume);
    } catch (error) {
      toast.error('Failed to load resume');
    }
  };

  // Save edits with smart reconciliation
  const handleSaveEdits = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/resume/update', {
        resumeId,
        editedData: editData,
        template: editData.templateType || 'moderncv'
      });

      const { latexCode: reconciledLatex, message } = response.data;
      setLatexCode(reconciledLatex);
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF with beautiful formatting preserved
  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/resume/compile', {
        latexCode,
        resumeId    // ← Critical: Enables reconciliation
      }, {
        responseType: 'arraybuffer'
      });

      // Trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('✅ PDF downloaded with original formatting!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to download PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Visual Editor */}
      <form onSubmit={(e) => { e.preventDefault(); handleSaveEdits(); }}>
        {/* Your form fields here */}
        <button type="submit" disabled={isLoading}>
          💾 Save Edits
        </button>
      </form>

      {/* LaTeX Preview */}
      <pre>{latexCode}</pre>

      {/* Export Button */}
      <button 
        onClick={handleDownloadPdf} 
        disabled={isLoading}
      >
        ⬇️ Download PDF
      </button>
    </div>
  );
}
```

---

## API Reference

### Compile PDF (Smart)
```http
POST /api/resume/compile
Content-Type: application/json

{
  "resumeId": "507f1f77bcf86cd799439011",
  "latexCode": "\\documentclass{article}..." (optional)
}

Response:
- 200: PDF file (application/pdf)
- 500: { success: false, error: "message" }
```

### Update Resume (with Reconciliation)
```http
POST /api/resume/update
Content-Type: application/json

{
  "resumeId": "507f1f77bcf86cd799439011",
  "editedData": {
    "personal": { "name": "John Doe", ... },
    "experience": [...],
    "education": [...],
    "projects": [...],
    "skills": [...]
  },
  "template": "moderncv"
}

Response:
{
  "success": true,
  "resumeId": "507f1f77bcf86cd799439011",
  "message": "Resume updated successfully. Original formatting preserved where possible.",
  "latexCode": "\\documentclass{...}..."
}
```

---

## Testing Workflow

1. **Upload LaTeX** with custom styling
2. **Edit one field** (e.g., email) in visual editor
3. **Save edits** - Should say "Original formatting preserved"
4. **Download PDF** - Should look identical to original PDF
5. **Edit many fields** - Make substantial changes
6. **Save edits** - Should regenerate with new formatting
7. **Download PDF** - Should include all your edits

---

## Troubleshooting

### Problem: PDF still looks different after editing
**Solution**: Make sure you're passing `resumeId` to the compile endpoint

```javascript
// ❌ Wrong
await axios.post('/api/resume/compile', { latexCode });

// ✅ Correct  
await axios.post('/api/resume/compile', { 
  latexCode, 
  resumeId  // ← This enables reconciliation
});
```

### Problem: Edits not appearing in PDF
**Solution**: Make sure you're using the `/update` endpoint, not just `/generate`

```javascript
// ❌ Wrong - doesn't preserve fidelity
const latex = await axios.post('/api/resume/generate', { resumeData });

// ✅  Correct - uses reconciliation
const result = await axios.post('/api/resume/update', { 
  resumeId, 
  editedData: resumeData 
});
```

### Problem: "Resume updated but formatting changed"
**Solution**: This means major edits were detected and LaTeX was regenerated. This is expected behavior for significant changes.

---

## Migration Checklist

- [ ] Update PDF download handler to use `resumeId`
- [ ] Update save edits handler to use `/update` endpoint
- [ ] Update resume loader to store `originalLatexCode`
- [ ] Test workflow: Upload → Edit → Save → Download
- [ ] Test workflow: Upload → Download (no edits) → Should preserve formatting
- [ ] Test workflow: Upload → Major edits → Download → Should show new formatting
- [ ] Update error handling for new error messages
- [ ] Test on different resume templates
- [ ] Deploy to Vercel and test production

---

## Result

✅ Users can now:
- Upload custom LaTeX with unique formatting
- Edit fields without losing original styling
- Download PDFs that look exactly like the originals (if no major edits)
- Make major edits and see their changes reflected in the PDF

**The parse-edit-regenerate cycle is now lossless!** 🎉
