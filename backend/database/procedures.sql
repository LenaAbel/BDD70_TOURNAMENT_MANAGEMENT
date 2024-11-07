CREATE PROCEDURE InsertActivity (
    IN activity_name VARCHAR(255),
    IN activity_number_of_players INT,
    IN activity_type VARCHAR(50),
    IN activity_description TEXT,
    IN category VARCHAR(50)
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle the exception
        -- You can log the error or print a message if needed
        SELECT 'Activity insertion failed or already exists';
    END;

    INSERT INTO activity (activity_name, activity_number_of_players, activity_type, activity_description, activity_category)
    VALUES (activity_name, activity_number_of_players, activity_type, activity_description, category);
END //

CREATE PROCEDURE InsertRule (
    IN rule_set TEXT,
    IN activity_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle the exception
        -- You can log the error or print a message if needed
        SELECT 'Rule insertion failed or already exists';
    END;

    INSERT INTO rules (rules_ruleSet, activity_id)
    VALUES (rule_set, activity_id);
END //
