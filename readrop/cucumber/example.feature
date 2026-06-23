Feature: Homepage
  As a user
  I want to open the Readrop homepage
  So that I can see the app title

  Scenario: Visit the homepage
    Given I open the homepage
    Then I should see "Readrop"
