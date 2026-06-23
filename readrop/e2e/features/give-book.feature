Feature: Give Book
  As a Readrop user
  I want to list a book for others to claim
  So that I can share a book

  Scenario: Give a book
    Given I open the give book page
    When I fill in the new book form
    And I submit the give book form
    Then I should be redirected to the books page
