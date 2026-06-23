Feature: Claim Book
  As a Readrop user
  I want to claim a book
  So that I can pick it up from another reader

  Scenario: Claim a book as a guest user
    Given I open the discover page
    When I attempt to claim a book
    Then I should be redirected to the login page

  Scenario: Claim a book after login
    Given I open the login page
    And I enter valid credentials
    And I submit the login form
    When I open the discover page
    And I attempt to claim a book
    Then I should see a claim confirmation
