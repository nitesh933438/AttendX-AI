import { pgTable, uuid, text, timestamp, boolean, jsonb, numeric, integer, pgEnum, unique } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher', 'student']);
export const sessionStatusEnum = pgEnum('session_status', ['active', 'closed']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'excused']);
export const registrationStatusEnum = pgEnum('registration_status', ['pending', 'approved', 'rejected']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: uuid('auth_id').unique(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull().default('student'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const profiles = pgTable('profiles', {
  id: uuid('id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  avatarUrl: text('avatar_url'),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const semesters = pgTable('semesters', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  semesterNumber: integer('semester_number').default(1),
  academicYear: text('academic_year'),
  startDate: timestamp('start_date', { mode: 'string' }),
  endDate: timestamp('end_date', { mode: 'string' }),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const sections = pgTable('sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'cascade' }),
  semesterId: uuid('semester_id').references(() => semesters.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  credits: integer('credits').default(3),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'cascade' }),
  semesterId: uuid('semester_id').references(() => semesters.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const teachers = pgTable('teachers', {
  id: uuid('id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  employeeId: text('employee_id').notNull().unique(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  status: text('status').default('Active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const students = pgTable('students', {
  id: uuid('id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  rollNumber: text('roll_number').notNull().unique(),
  enrollmentNumber: text('enrollment_number'),
  sectionId: uuid('section_id').references(() => sections.id, { onDelete: 'set null' }),
  session: text('session'),
  gender: text('gender'),
  dob: text('dob'),
  address: text('address'),
  guardianName: text('guardian_name'),
  guardianPhone: text('guardian_phone'),
  registrationStatus: registrationStatusEnum('registration_status').default('approved'),
  attendancePercentage: numeric('attendance_percentage').default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const teacherSubjects = pgTable('teacher_subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (t) => [unique().on(t.teacherId, t.subjectId)]);

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherSubjectId: uuid('teacher_subject_id').references(() => teacherSubjects.id, { onDelete: 'cascade' }),
  sectionId: uuid('section_id').references(() => sections.id, { onDelete: 'cascade' }),
  schedule: text('schedule'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const attendanceSessions = pgTable('attendance_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'cascade' }),
  date: timestamp('date', { mode: 'string' }).notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  status: sessionStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => attendanceSessions.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
  status: attendanceStatusEnum('status').notNull(),
  markedAt: timestamp('marked_at', { withTimezone: true }),
  confidenceScore: numeric('confidence_score'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (t) => [unique().on(t.sessionId, t.studentId)]);

export const faceRegistrations = pgTable('face_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
  status: registrationStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const faceEmbeddings = pgTable('face_embeddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationId: uuid('registration_id').references(() => faceRegistrations.id, { onDelete: 'cascade' }),
  embeddingData: jsonb('embedding_data').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});
