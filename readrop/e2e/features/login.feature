Feature: Login
  As a Readrop user
  I want to authenticate with the app
  So that I can access protected pages

  Scenario: Successful login
    Given I open the login page
    When I enter valid credentials
    And I submit the login form
    Then I should be redirected to the dashboard

  Scenario: Failed login
    Given I open the login page
    When I enter invalid credentials
    And I submit the login form
    Then I should see an invalid login error
