import React, { useState } from 'react';
import './App.css';

const GRADE_MAP = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': null,
};

const INTERNAL_GRADE_OPTIONS = ['-', 'O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
const EXTERNAL_GRADE_OPTIONS = ['', 'O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];

const defaultSubjects = [
  { credits: '', subject: '', internal: '', external: '', key: Date.now() },
];

function calcOverall(internal, external) {
  if (!internal) return external;
  return (0.4 * internal + 0.6 * external).toFixed(2);
}

function calcWeighted(overall, credits) {
  return (overall * credits).toFixed(2);
}

function parseGrade(grade) {
  if (!grade) return '';
  const g = GRADE_MAP[grade.toUpperCase()];
  return g === null ? '' : g;
}

function App() {
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [theme, setTheme] = useState('dark');
  const [quickCalc, setQuickCalc] = useState(true);

  const handleChange = (idx, field, value) => {
    const updated = [...subjects];
    updated[idx][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { credits: '', subject: '', internal: '', external: '', key: Date.now() + Math.random() }]);
  };

  const handleDelete = (idx) => {
    if (subjects.length === 1) return;
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const isValidGrade = grade => grade === '' || GRADE_MAP.hasOwnProperty(grade.toUpperCase());

  let totalWeighted = 0;
  let totalCredits = 0;

  const rows = subjects.map((row, idx) => {
    const internal = parseGrade(row.internal);
    const external = parseGrade(row.external);
    let overall = '';
    let isCreditsValid = row.credits && !isNaN(row.credits) && Number(row.credits) > 0;
    let isInternalValid = isValidGrade(row.internal);
    let isExternalValid = isValidGrade(row.external);
    let rowInvalid = !isCreditsValid || !isExternalValid || row.external === '';
    if (external !== '' && isCreditsValid && external !== null && isExternalValid) {
      overall = calcOverall(internal, external);
      totalWeighted += parseFloat(overall) * parseFloat(row.credits);
      totalCredits += parseFloat(row.credits);
    }
    return (
      <tr key={row.key} className={rowInvalid ? 'invalid-row' : ''}>
        <td><input type="number" min="1" className={`glass-input${!isCreditsValid ? ' invalid-input' : ''}`} value={row.credits} onChange={e => handleChange(idx, 'credits', e.target.value.replace(/[^0-9]/g, ''))} /></td>
        <td><input type="text" className="glass-input" value={row.subject} onChange={e => handleChange(idx, 'subject', e.target.value)} /></td>
        <td>
          <select className={`glass-input${!isInternalValid ? ' invalid-input' : ''}`} value={row.internal} onChange={e => handleChange(idx, 'internal', e.target.value)}>
            {INTERNAL_GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </td>
        <td>
          <select className={`glass-input${!isExternalValid ? ' invalid-input' : ''}`} value={row.external} onChange={e => handleChange(idx, 'external', e.target.value)}>
            {EXTERNAL_GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </td>
        <td>{overall}</td>
        <td>
          {subjects.length > 1 && (
            <button className="delete-btn" onClick={() => handleDelete(idx)} title="Delete Row">✖</button>
          )}
        </td>
      </tr>
    );
  });

  const overallGPA = totalCredits ? (totalWeighted / totalCredits).toFixed(2) : '';

  return (
    <div className={`App ${theme}`}>
      <div className="theme-toggle">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <div className="glass-card">
        <div className="header-row">
          <h1>GPA Calculator</h1>
          <div className="quick-calc-toggle">
            <label className="switch">
              <input type="checkbox" checked={quickCalc} onChange={() => setQuickCalc(!quickCalc)} />
              <span className="slider"></span>
            </label>
            <span className="quick-calc-label">Quick Calc</span>
          </div>
        </div>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Credits</th>
              <th>Subject</th>
              <th>Internal</th>
              <th>External</th>
              <th>Overall</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows}
            <tr className="gpa-row">
              <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Overall GPA:</td>
              <td className="gpa-value">{overallGPA}</td>
            </tr>
          </tbody>
        </table>
        <button className="add-btn" onClick={addSubject}>+ Add Subject</button>
      </div>
    </div>
  );
}

export default App;