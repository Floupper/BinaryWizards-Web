import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateQuiz from '../path/to/CreateQuiz';
import CreateQuizService from '../path/to/CreateQuizService';

// Mock the CreateQuizService methods
jest.mock('../path/to/CreateQuizService', () => ({
  fetchCategories: jest.fn(),
  fetchDifficulties: jest.fn(),
  createQuiz: jest.fn(),
}));

describe('CreateQuiz Component', () => {
  beforeEach(() => {
    // Mock categories and difficulties responses
    CreateQuizService.fetchCategories.mockResolvedValue([
      { id: 1, name: 'General Knowledge' },
      { id: 2, name: 'Science' },
    ]);
    CreateQuizService.fetchDifficulties.mockResolvedValue(['easy', 'medium', 'hard']);
  });

  test('create quiz without selecting a category', async () => {
    // Mock the createQuiz function response
    CreateQuizService.createQuiz.mockResolvedValue({ quiz_id: 123 });

    // Render the CreateQuiz component
    render(
      <MemoryRouter>
        <CreateQuiz />
      </MemoryRouter>
    );

    // Wait for the categories and difficulties to load
    await screen.findByText('General Knowledge');
    await screen.findByText('easy');

    // Set the amount of questions
    const amountInput = screen.getByPlaceholderText('Enter the number of questions');
    fireEvent.change(amountInput, { target: { value: '5' } });

    // Ensure no category is selected (should be the default empty value)
    const categorySelect = screen.getByLabelText('Category:');
    expect(categorySelect.value).toBe('');

    // Set difficulty level
    const difficultySelect = screen.getByLabelText('Difficulty:');
    fireEvent.change(difficultySelect, { target: { value: 'medium' } });

    // Click on the Start button
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    // Check that createQuiz was called with a random category, since none was selected
    expect(CreateQuizService.createQuiz).toHaveBeenCalledWith({
      category: expect.any(Number), // We expect a category ID
      amount: 5,
      difficulty: 'medium',
    });

    // Check that the user is navigated to the quiz page
    const quizId = await CreateQuizService.createQuiz.mock.results[0].value.then(res => res.quiz_id);
    expect(quizId).toBe(123);
  });
});