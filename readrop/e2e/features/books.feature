Feature: Browse Books
  As a Readrop user
  I want to view available books
  So that I can choose what to claim

  Scenario: Browse book listings
    Given I open the books page
    Then I should see a book card
