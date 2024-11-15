import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateQuiz from '../../pages/CreateQuiz';
import CreateQuizService from '../../services/CreateQuizService';
import { ToastContainer } from 'react-toastify';

jest.mock('../services/CreateQuizService', () => ({
  fetchCategories: jest.fn(),
  fetchDifficulties: jest.fn(),
  createQuiz: jest.fn(),
}));

describe('CreateQuiz Component', () => {
  beforeEach(() => {
    CreateQuizService.fetchCategories.mockResolvedValue([{ id: 1, name: 'General Knowledge' }]);
    CreateQuizService.fetchDifficulties.mockResolvedValue(['easy', 'medium', 'hard']);
  });

  test('renders CreateQuiz component', async () => {
    render(
      <BrowserRouter>
        <ToastContainer />
        <CreateQuiz />
      </BrowserRouter>
    );

    expect(screen.getByText(/Create a Quiz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of questions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/Start/i)).toBeInTheDocument();
    
    // Wait for categories and difficulties to load
    await waitFor(() => {
      expect(CreateQuizService.fetchCategories).toHaveBeenCalled();
      expect(CreateQuizService.fetchDifficulties).toHaveBeenCalled();
    });
  });

  test('displays a toast message on invalid input for number of questions', async () => {
    render(
      <BrowserRouter>
        <ToastContainer />
        <CreateQuiz />
      </BrowserRouter>
    );

    // Enter invalid amount (e.g., negative number or empty value)
    const amountInput = screen.getByLabelText(/Number of questions/i);
    fireEvent.change(amountInput, { target: { value: '-5' } });
    fireEvent.click(screen.getByText(/Start/i));

    // Wait for the toast message to appear
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid number of questions/i)).toBeInTheDocument();
    });
  });
});