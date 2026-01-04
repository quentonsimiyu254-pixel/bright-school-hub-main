// src/services/ReportCardGenerator.ts

export interface GradeEntry {
  subject: string;
  marks: number;
  grade: string;
  remarks: string;
}

export interface ReportData {
  studentName: string;
  admissionNo: string;
  term: string;
  year: string;
  grades: GradeEntry[];
  totalMarks: number;
  average: string;
  meanGrade: string;
}

/**
 * High-Class Grading Logic
 */
const getGradeInfo = (marks: number) => {
  if (marks >= 80) return { grade: "A", remarks: "Plain (Excellent Performance)" };
  if (marks >= 75) return { grade: "A-", remarks: "Excellent" };
  if (marks >= 70) return { grade: "B+", remarks: "Very Good" };
  if (marks >= 65) return { grade: "B", remarks: "Good" };
  if (marks >= 60) return { grade: "B-", remarks: "Fairly Good" };
  if (marks >= 55) return { grade: "C+", remarks: "Attained" };
  if (marks >= 50) return { grade: "C", remarks: "Average" };
  return { grade: "D", remarks: "Needs Improvement" };
};

/**
 * The Main Generator Function
 * This prepares the data and triggers a professional print view
 */
export const generateReportCard = (profile: any, examResults: any[]) => {
  // 1. Process Results
  const processedGrades: GradeEntry[] = examResults.map((res) => {
    const info = getGradeInfo(res.marks || 0);
    return {
      subject: res.subject || "General Study",
      marks: res.marks || 0,
      grade: info.grade,
      remarks: info.remarks,
    };
  });

  // 2. Calculate Totals
  const total = processedGrades.reduce((sum, item) => sum + item.marks, 0);
  const avg = examResults.length > 0 ? (total / examResults.length).toFixed(2) : "0.00";
  const finalGrade = getGradeInfo(parseFloat(avg)).grade;

  const report: ReportData = {
    studentName: profile?.full_name || "Unknown Student",
    admissionNo: profile?.id?.slice(0, 8).toUpperCase() || "N/A",
    term: "Term 1", // This can be dynamic based on your examRes
    year: new Date().getFullYear().toString(),
    grades: processedGrades,
    totalMarks: total,
    average: avg,
    meanGrade: finalGrade,
  };

  // 3. Trigger High-Class Print Layout
  renderPrintWindow(report);
  
  return report;
};

/**
 * Creates a professional, printable HTML document on the fly
 */
const renderPrintWindow = (data: ReportData) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Report Card - ${data.studentName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 3px solid #1a365d; padding-bottom: 10px; margin-bottom: 20px; }
          .school-name { font-size: 28px; font-weight: bold; color: #1a365d; margin: 0; }
          .report-title { font-size: 18px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; }
          .student-info { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #1a365d; color: white; padding: 12px; text-align: left; }
          td { border: 1px solid #e2e8f0; padding: 10px; }
          tr:nth-child(even) { background-color: #f1f5f9; }
          .summary { float: right; width: 300px; padding: 15px; border: 2px solid #1a365d; border-radius: 8px; }
          .footer { margin-top: 100px; display: flex; justify-content: space-between; border-top: 1px solid #ccc; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="school-name">BRIGHT HUB INTERNATIONAL ACADEMY</p>
          <p class="report-title">Academic Performance Report</p>
        </div>

        <div class="student-info">
          <div><strong>Student:</strong> ${data.studentName}</div>
          <div><strong>Admission No:</strong> ${data.admissionNo}</div>
          <div><strong>Year:</strong> ${data.year}</div>
          <div><strong>Term:</strong> ${data.term}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score (%)</th>
              <th>Grade</th>
              <th>Teacher's Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${data.grades.map(g => `
              <tr>
                <td>${g.subject}</td>
                <td>${g.marks}</td>
                <td><strong>${g.grade}</strong></td>
                <td>${g.remarks}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div><strong>Total Marks:</strong> ${data.totalMarks}</div>
          <div><strong>Mean Average:</strong> ${data.average}%</div>
          <div style="font-size: 20px; margin-top: 10px;"><strong>Mean Grade: ${data.meanGrade}</strong></div>
        </div>

        <div class="footer">
          <div>Class Teacher Signature: ___________________</div>
          <div>Principal Signature: ___________________</div>
        </div>
        
        <script>window.print();</script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};