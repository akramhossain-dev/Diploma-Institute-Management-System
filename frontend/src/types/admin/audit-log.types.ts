export interface AuditLog {
  _id: string;
  action: string;
  actorType: 'admin' | 'teacher' | 'student' | 'accountant' | 'system';
  actorName: string;
  actorIdentifier: string;
  targetModule: string;
  targetEntity: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
