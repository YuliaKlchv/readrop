Feature: Register
  As a new Readrop user
  I want to create an account
  So that I can use the app

  Scenario: Register validation prevents bad input
    Given I open the register page
    When I enter invalid registration details
    And I submit the registration form
    Then I should see validation feedback
