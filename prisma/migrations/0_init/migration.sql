CREATE UNIQUE INDEX tests_success_constraint ON posts (subject, target)
 WHERE success;