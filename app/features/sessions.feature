Feature: Sessions

  Scenario: User logs in successfully
    Given a user with email "user@example.com" and password "password" and phone number "1234567890"
    When the user logs in with email "user@example.com" and password "password"
    Then the user should be logged in
