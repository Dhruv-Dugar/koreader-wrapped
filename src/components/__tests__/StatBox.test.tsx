import { render, screen } from '@testing-library/react';
import { StatBox } from '../stats/StatBox';

describe('StatBox', () => {
    it('renders the label and value', () => {
        render(<StatBox value="100" label="Books Read" color="leather" />);

        expect(screen.getByText('Books Read')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('applies the correct color class', () => {
        const { container } = render(<StatBox value="100" label="Books Read" color="gold" />);
        // text-gold is the class for 'gold'
        const valueElement = screen.getByText('100');
        expect(valueElement).toHaveClass('text-gold');
    });
});
