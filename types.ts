
// Fix: Added React import to resolve the "Cannot find namespace 'React'" error on line 27.
import React from 'react';

export enum UserType {
  Patient = 'Patient',
  Pharmacy = 'Pharmacy',
}

export enum Status {
  Pending = 'pending',
  Verified = 'verified',
}

export interface UserRecord {
  id: string;
  fullName: string;
  userType: UserType;
  email: string;
  registrationDate: string;
  status: Status;
}

export interface StatData {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  color: string;
  icon: React.ReactNode;
  chartData: { value: number }[];
}