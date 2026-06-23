Feature: Dashboard Access
  As a Readrop user
  I want to view my dashboard after logging in
  So that I can access account information

  Scenario: Access dashboard after login
    Given I open the login page
    And I enter valid credentials
    And I submit the login form
    When I open the dashboard page
    Then I should see dashboard content
