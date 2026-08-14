export interface AcademicRecord {
  studentId: string;
  rollNumber: string;
  institutionalEmail: string;
  name: string;
  collegeName: string;
  department: string;
  program: string;
  year: number;
  semester: number;
  batch: string;
  section: string;
  academicStatus: string;
  cgpa: number;
}

export interface IAcademicProvider {
  findStudentByRollNumber(rollNumber: string): Promise<AcademicRecord | null>;
  verifyCollegeEmail(email: string): Promise<boolean>;
  getStudentAcademicRecord(studentId: string): Promise<AcademicRecord | null>;
  getEnrollmentStatus(studentId: string): Promise<{ active: boolean; statusText: string }>;
}

export class MockAcademicProvider implements IAcademicProvider {
  private mockDatabase: Map<string, AcademicRecord> = new Map([
    [
      'NM-2026-882341',
      {
        studentId: 'NM-2026-882341',
        rollNumber: '7376221CS101',
        institutionalEmail: 'aravind.student@college.edu',
        name: 'Aravind Kumar',
        collegeName: 'Government Engineering College, Salem',
        department: 'Computer Science & Engineering',
        program: 'B.E. Computer Science & Engineering',
        year: 4,
        semester: 7,
        batch: '2022-2026',
        section: 'A',
        academicStatus: 'ACTIVE',
        cgpa: 9.4,
      },
    ],
    [
      '7376221CS101',
      {
        studentId: 'NM-2026-882341',
        rollNumber: '7376221CS101',
        institutionalEmail: 'aravind.student@college.edu',
        name: 'Aravind Kumar',
        collegeName: 'Government Engineering College, Salem',
        department: 'Computer Science & Engineering',
        program: 'B.E. Computer Science & Engineering',
        year: 4,
        semester: 7,
        batch: '2022-2026',
        section: 'A',
        academicStatus: 'ACTIVE',
        cgpa: 9.4,
      },
    ],
    [
      '7376221CS102',
      {
        studentId: 'NM-2026-882342',
        rollNumber: '7376221CS102',
        institutionalEmail: 'kavitha.student@college.edu',
        name: 'Kavitha R',
        collegeName: 'Government Engineering College, Salem',
        department: 'Information Technology',
        program: 'B.Tech Information Technology',
        year: 4,
        semester: 7,
        batch: '2022-2026',
        section: 'B',
        academicStatus: 'ACTIVE',
        cgpa: 9.2,
      },
    ],
    [
      '7376221CS103',
      {
        studentId: 'NM-2026-882343',
        rollNumber: '7376221CS103',
        institutionalEmail: 'sanjay.student@college.edu',
        name: 'Sanjay Nathan',
        collegeName: 'Government Engineering College, Salem',
        department: 'Electronics & Comm Eng',
        program: 'B.E. Electronics & Communication',
        year: 3,
        semester: 6,
        batch: '2023-2027',
        section: 'A',
        academicStatus: 'ACTIVE',
        cgpa: 8.9,
      },
    ],
    [
      '7376221CS104',
      {
        studentId: 'NM-2026-882344',
        rollNumber: '7376221CS104',
        institutionalEmail: 'praveen.student@college.edu',
        name: 'Praveen S',
        collegeName: 'Government Engineering College, Salem',
        department: 'Computer Science & Engineering',
        program: 'B.E. Computer Science & Engineering',
        year: 3,
        semester: 6,
        batch: '2023-2027',
        section: 'B',
        academicStatus: 'ACTIVE',
        cgpa: 7.1,
      },
    ],
  ]);

  async findStudentByRollNumber(rollNumber: string): Promise<AcademicRecord | null> {
    const record = this.mockDatabase.get(rollNumber.trim().toUpperCase()) || this.mockDatabase.get(rollNumber.trim());
    if (record) return record;

    if (rollNumber.trim().length >= 5) {
      const cleanRoll = rollNumber.trim().toUpperCase();
      const num = cleanRoll.slice(-3);
      return {
        studentId: `NM-2026-${num}99`,
        rollNumber: cleanRoll,
        institutionalEmail: `student.${cleanRoll.toLowerCase()}@college.edu`,
        name: `Student ${cleanRoll}`,
        collegeName: 'Government Engineering College, Salem',
        department: 'Computer Science & Engineering',
        program: 'B.E. Computer Science & Engineering',
        year: 3,
        semester: 6,
        batch: '2023-2027',
        section: 'A',
        academicStatus: 'ACTIVE',
        cgpa: 8.2,
      };
    }

    return null;
  }

  async verifyCollegeEmail(email: string): Promise<boolean> {
    const domain = process.env.COLLEGE_EMAIL_DOMAIN || 'college.edu';
    return email.toLowerCase().endsWith(`@${domain}`) || email.toLowerCase().endsWith('.edu');
  }

  async getStudentAcademicRecord(studentId: string): Promise<AcademicRecord | null> {
    return this.findStudentByRollNumber(studentId);
  }

  async getEnrollmentStatus(studentId: string): Promise<{ active: boolean; statusText: string }> {
    const record = await this.getStudentAcademicRecord(studentId);
    if (!record) return { active: false, statusText: 'RECORD_NOT_FOUND' };
    return { active: record.academicStatus === 'ACTIVE', statusText: record.academicStatus };
  }
}

export function getAcademicProvider(): IAcademicProvider {
  return new MockAcademicProvider();
}
