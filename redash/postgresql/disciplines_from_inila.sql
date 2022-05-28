SELECT disciplines.id as "discipline id",
       disciplines.subjectid as "subject id",
       subjects.name as "subject name",
       study_plans.externalid as "study plan id",
       semesters.id as "semester id",
       inila as "teacher inila",
       accounts.externalid as "teacher extenalid",
       login "teacher login",
       email "teacher email",
       firstname,
       secondname,
       lastname,
       --userroleid as "user role",
       user_roles.rolename as "user role",
       teachers.facultyid "teacher facultyid"

FROM accounts
         JOIN user_roles on user_roles.id = accounts.userroleid
         JOIN teachers ON teachers.accountid = accounts.id
         JOIN disciplines_teachers on disciplines_teachers.teacherid = teachers.id
         JOIN disciplines on disciplines.id = disciplines_teachers.disciplineid
         JOIN disciplines_study_plans on disciplines_study_plans.disciplineid = disciplines.id
         JOIN study_plans on study_plans.id = disciplines_study_plans.studyplanid
         JOIN subjects on subjects.id = disciplines.subjectid
         JOIN semesters on disciplines.semesterid = semesters.id
WHERE accounts.inila = {{ inila }}
    AND semesters.id = (SELECT semesters.id from semesters ORDER BY semesters.id DESC LIMIT 1)
