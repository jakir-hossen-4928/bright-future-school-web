
export interface StudentData {
  studentId: string;
  name: string;
  class: string;
  number: string;
  description: string;
  englishName: string;
  motherName: string;
  fatherName: string;
  photoUrl: string;
  academicYear?: string;
  section?: string;
  shift?: string;
  email?: string;
  bloodGroup?: string;
  nameBangla?: string;
  nameEnglish?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface StaffData {
  staffId?: string;
  nameBangla: string;
  nameEnglish: string;
  subject: string;
  designation: string;
  joiningDate: string | Date;
  nid: string;
  mobile: string;
  salary: number;
  email: string;
  address: string;
  bloodGroup: string;
  workingDays: number;
  photoUrl: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface User {
  id: string;
  email: string | null;
  role: 'admin' | 'staff' | 'student';
  verified: boolean;
  createdAt: any;
  studentData?: StudentData;
  staffData?: StaffData;
}

// Extended user type for components that need additional properties
export interface ExtendedUser extends User {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  staffId?: string;
  designation?: string;
  joiningDate?: string | Date;
  nid?: string;
}
