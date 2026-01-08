import { render, screen, fireEvent } from '@testing-library/react';
import DropZone from '../upload/DropZone';

describe('DropZone', () => {
    it('renders correctly', () => {
        render(<DropZone onFileAccepted={() => {}} />);
        expect(screen.getByText('Open your reading story')).toBeInTheDocument();
        expect(screen.getByText(/Drag & drop your file/i)).toBeInTheDocument();
    });

    it('handles file selection via input', () => {
        const handleFileAccepted = jest.fn();
        const { container } = render(<DropZone onFileAccepted={handleFileAccepted} />);

        const input = container.querySelector('input[type="file"]');

        if (!input) throw new Error("Input not found");

        const file = new File(['dummy content'], 'test.sqlite3', { type: 'application/x-sqlite3' });

        fireEvent.change(input, { target: { files: [file] } });
        expect(handleFileAccepted).toHaveBeenCalledWith(file);
    });

    it('changes state on drag over', () => {
         render(<DropZone onFileAccepted={() => {}} />);

         // Use a more robust selector for the drop zone area.
         // Since the input covers the whole area, we can drag over the input or the div itself.
         // But the event handlers are on the outer div.

         const heading = screen.getByText('Open your reading story');
         const dropZone = heading.closest('div.relative.rounded-xl') || heading.parentElement?.parentElement;

         if(!dropZone) throw new Error("Drop zone container not found");

         fireEvent.dragOver(dropZone);

         expect(screen.getByText('Place your book here')).toBeInTheDocument();

         fireEvent.dragLeave(dropZone);
         expect(screen.getByText('Open your reading story')).toBeInTheDocument();
    });

    it('handles file drop', () => {
        const handleFileAccepted = jest.fn();
        render(<DropZone onFileAccepted={handleFileAccepted} />);

        const heading = screen.getByText('Open your reading story');
        const dropZone = heading.closest('div.relative.rounded-xl') || heading.parentElement?.parentElement;

        if(!dropZone) throw new Error("Drop zone container not found");

        const file = new File(['dummy content'], 'test.sqlite3', { type: 'application/x-sqlite3' });

        fireEvent.drop(dropZone, {
            dataTransfer: {
                files: [file]
            }
        });

        expect(handleFileAccepted).toHaveBeenCalledWith(file);
    });
});
