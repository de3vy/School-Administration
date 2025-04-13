# Database Schema for Progress & Activity Reporting Application

## Overview
This document outlines the database schema for the Progress & Activity Reporting application, including all tables, fields, relationships, and constraints.

## Tables

### 1. Students
- **student_id**: INT (Primary Key, Auto Increment)
- **first_name**: VARCHAR(50)
- **last_name**: VARCHAR(50)
- **email**: VARCHAR(100) (Unique)
- **phone**: VARCHAR(20)
- **address**: VARCHAR(255)
- **date_of_birth**: DATE
- **enrollment_date**: DATE
- **status**: ENUM('Active', 'Inactive', 'Graduated', 'On Leave')
- **notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 2. Groups
- **group_id**: INT (Primary Key, Auto Increment)
- **name**: VARCHAR(100)
- **description**: TEXT
- **start_date**: DATE
- **end_date**: DATE
- **capacity**: INT
- **location_id**: INT (Foreign Key to Locations)
- **status**: ENUM('Active', 'Inactive', 'Completed')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 3. Teachers
- **teacher_id**: INT (Primary Key, Auto Increment)
- **first_name**: VARCHAR(50)
- **last_name**: VARCHAR(50)
- **email**: VARCHAR(100) (Unique)
- **phone**: VARCHAR(20)
- **specialization**: VARCHAR(100)
- **hire_date**: DATE
- **status**: ENUM('Active', 'Inactive', 'On Leave')
- **notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 4. Volunteers
- **volunteer_id**: INT (Primary Key, Auto Increment)
- **first_name**: VARCHAR(50)
- **last_name**: VARCHAR(50)
- **email**: VARCHAR(100) (Unique)
- **phone**: VARCHAR(20)
- **skills**: TEXT
- **availability**: TEXT
- **start_date**: DATE
- **status**: ENUM('Active', 'Inactive')
- **notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 5. Locations
- **location_id**: INT (Primary Key, Auto Increment)
- **name**: VARCHAR(100)
- **address**: VARCHAR(255)
- **capacity**: INT
- **facilities**: TEXT
- **availability**: TEXT
- **status**: ENUM('Active', 'Inactive', 'Under Maintenance')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 6. Activities
- **activity_id**: INT (Primary Key, Auto Increment)
- **name**: VARCHAR(100)
- **description**: TEXT
- **category**: VARCHAR(50)
- **duration**: INT (in minutes)
- **materials_needed**: TEXT
- **preparation_notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 7. Learning Modules
- **module_id**: INT (Primary Key, Auto Increment)
- **title**: VARCHAR(100)
- **description**: TEXT
- **objectives**: TEXT
- **prerequisites**: TEXT
- **estimated_duration**: INT (in hours)
- **difficulty_level**: ENUM('Beginner', 'Intermediate', 'Advanced')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 8. Student Progress
- **progress_id**: INT (Primary Key, Auto Increment)
- **student_id**: INT (Foreign Key to Students)
- **module_id**: INT (Foreign Key to Learning Modules)
- **start_date**: DATE
- **completion_date**: DATE
- **status**: ENUM('Not Started', 'In Progress', 'Completed', 'Deferred')
- **assessment_score**: DECIMAL(5,2)
- **assessment_date**: DATE
- **feedback**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 9. Assignments
- **assignment_id**: INT (Primary Key, Auto Increment)
- **title**: VARCHAR(100)
- **description**: TEXT
- **module_id**: INT (Foreign Key to Learning Modules)
- **group_id**: INT (Foreign Key to Groups)
- **due_date**: DATE
- **points_possible**: INT
- **submission_type**: ENUM('Text', 'File', 'Link', 'Multiple')
- **created_by**: INT (Foreign Key to Teachers)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 10. Resources
- **resource_id**: INT (Primary Key, Auto Increment)
- **title**: VARCHAR(100)
- **description**: TEXT
- **type**: ENUM('Document', 'Video', 'Audio', 'Link', 'Other')
- **url**: VARCHAR(255)
- **file_path**: VARCHAR(255)
- **module_id**: INT (Foreign Key to Learning Modules)
- **created_by**: INT (Foreign Key to Teachers)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 11. Lessons
- **lesson_id**: INT (Primary Key, Auto Increment)
- **title**: VARCHAR(100)
- **description**: TEXT
- **group_id**: INT (Foreign Key to Groups)
- **teacher_id**: INT (Foreign Key to Teachers)
- **location_id**: INT (Foreign Key to Locations)
- **date**: DATE
- **start_time**: TIME
- **end_time**: TIME
- **module_id**: INT (Foreign Key to Learning Modules)
- **activities**: TEXT (JSON array of activity_ids)
- **resources**: TEXT (JSON array of resource_ids)
- **notes**: TEXT
- **status**: ENUM('Scheduled', 'Completed', 'Cancelled')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 12. Volunteer Logs
- **log_id**: INT (Primary Key, Auto Increment)
- **volunteer_id**: INT (Foreign Key to Volunteers)
- **date**: DATE
- **hours**: DECIMAL(5,2)
- **activity_description**: TEXT
- **group_id**: INT (Foreign Key to Groups)
- **location_id**: INT (Foreign Key to Locations)
- **notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 13. Communication Log
- **communication_id**: INT (Primary Key, Auto Increment)
- **date**: DATE
- **time**: TIME
- **sender_type**: ENUM('Student', 'Teacher', 'Volunteer', 'Admin')
- **sender_id**: INT
- **recipient_type**: ENUM('Student', 'Teacher', 'Volunteer', 'Admin', 'Group')
- **recipient_id**: INT
- **subject**: VARCHAR(100)
- **message**: TEXT
- **status**: ENUM('Sent', 'Delivered', 'Read')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 14. Attendance
- **attendance_id**: INT (Primary Key, Auto Increment)
- **lesson_id**: INT (Foreign Key to Lessons)
- **student_id**: INT (Foreign Key to Students)
- **status**: ENUM('Present', 'Absent', 'Late', 'Excused')
- **arrival_time**: TIME
- **departure_time**: TIME
- **notes**: TEXT
- **is_present**: BOOLEAN (Calculated field: status = 'Present')
- **is_absent**: BOOLEAN (Calculated field: status = 'Absent')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### 15. Feedback
- **feedback_id**: INT (Primary Key, Auto Increment)
- **source_type**: ENUM('Student', 'Teacher', 'Volunteer', 'Admin')
- **source_id**: INT
- **target_type**: ENUM('Lesson', 'Module', 'Assignment', 'Teacher', 'Group')
- **target_id**: INT
- **rating**: INT (1-5)
- **comments**: TEXT
- **date**: DATE
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

## Junction Tables (for Many-to-Many Relationships)

### Student_Group
- **student_group_id**: INT (Primary Key, Auto Increment)
- **student_id**: INT (Foreign Key to Students)
- **group_id**: INT (Foreign Key to Groups)
- **join_date**: DATE
- **exit_date**: DATE
- **status**: ENUM('Active', 'Inactive', 'Completed')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Teacher_Group
- **teacher_group_id**: INT (Primary Key, Auto Increment)
- **teacher_id**: INT (Foreign Key to Teachers)
- **group_id**: INT (Foreign Key to Groups)
- **role**: ENUM('Primary', 'Assistant', 'Substitute')
- **start_date**: DATE
- **end_date**: DATE
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Assignment_Submission
- **submission_id**: INT (Primary Key, Auto Increment)
- **assignment_id**: INT (Foreign Key to Assignments)
- **student_id**: INT (Foreign Key to Students)
- **submission_date**: DATETIME
- **content**: TEXT
- **file_path**: VARCHAR(255)
- **url**: VARCHAR(255)
- **grade**: DECIMAL(5,2)
- **feedback**: TEXT
- **graded_by**: INT (Foreign Key to Teachers)
- **graded_date**: DATETIME
- **status**: ENUM('Submitted', 'Late', 'Graded', 'Returned')
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Module_Resource
- **module_resource_id**: INT (Primary Key, Auto Increment)
- **module_id**: INT (Foreign Key to Learning Modules)
- **resource_id**: INT (Foreign Key to Resources)
- **order**: INT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Student_Interest
- **interest_id**: INT (Primary Key, Auto Increment)
- **student_id**: INT (Foreign Key to Students)
- **lesson_id**: INT (Foreign Key to Lessons)
- **interest_level**: ENUM('Very Interested', 'Interested', 'Somewhat Interested')
- **notes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

## Relationships

1. **Students to Groups**: Many-to-Many (via Student_Group junction table)
2. **Teachers to Groups**: Many-to-Many (via Teacher_Group junction table)
3. **Groups to Locations**: Many-to-One
4. **Learning Modules to Resources**: Many-to-Many (via Module_Resource junction table)
5. **Students to Learning Modules**: Many-to-Many (via Student Progress table)
6. **Assignments to Groups**: Many-to-One
7. **Assignments to Learning Modules**: Many-to-One
8. **Assignments to Students**: Many-to-Many (via Assignment_Submission junction table)
9. **Lessons to Groups**: Many-to-One
10. **Lessons to Teachers**: Many-to-One
11. **Lessons to Locations**: Many-to-One
12. **Lessons to Learning Modules**: Many-to-One
13. **Volunteer Logs to Volunteers**: Many-to-One
14. **Volunteer Logs to Groups**: Many-to-One
15. **Volunteer Logs to Locations**: Many-to-One
16. **Attendance to Lessons**: Many-to-One
17. **Attendance to Students**: Many-to-One
18. **Students to Lessons**: Many-to-Many (via Student_Interest junction table)

## Indexes

- Primary keys on all tables
- Foreign key indexes on all relationship fields
- Unique indexes on email fields in Students, Teachers, and Volunteers tables
- Composite indexes on frequently queried combinations (e.g., student_id + module_id in Student Progress)
- Date-based indexes for reporting queries (e.g., lesson date, attendance date)

## Constraints

- Foreign key constraints with appropriate ON DELETE and ON UPDATE actions
- NOT NULL constraints on essential fields
- CHECK constraints for data validation (e.g., rating between 1-5)
- Unique constraints on email fields
