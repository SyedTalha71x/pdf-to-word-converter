import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import pdfExtract from 'pdf-extract';

export const uploadPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const pdfPath = path.join('backend/pdf', req.file.filename);
        const docxFilename = req.file.filename.replace('.pdf', '.docx');
        const docxPath = path.join('backend/doc', docxFilename);

        const options = { type: 'text' };
        const processor = pdfExtract(pdfPath, options, (err) => {
            if (err) {
                console.error('Error initializing pdf-extract:', err);
                return res.status(500).json({ message: 'PDF extraction failed.' });
            }
        });

        processor.on('complete', async (data) => {
            console.log('Extracted text pages:', JSON.stringify(data.text_pages, null, 2)); // Log extracted data

            if (!data.text_pages || data.text_pages.length === 0) {
                return res.status(500).json({ message: 'No content extracted from the PDF.' });
            }
            
            const doc = new Document({
                creator: 'PDF to Word Converter',
                title: 'Converted Document',
                sections: [],
            });

            const paragraphs = [];

            // Loop through each extracted page
            data.text_pages.forEach((page) => {
                const lines = page.split('\n'); // Split the page into lines

                lines.forEach((line) => {
                    const trimmedLine = line.trim();
                    // Ignore lines that are empty after trimming
                    if (trimmedLine) {
                        paragraphs.push(new Paragraph({
                            text: trimmedLine,
                            spacing: {
                                after: 200, // Adjust spacing as needed
                            },
                        }));
                    }
                });
            });

            doc.addSection({
                children: paragraphs
            });

            const docxBuffer = await Packer.toBuffer(doc);
            fs.writeFileSync(docxPath, docxBuffer);

            res.json({ message: 'File uploaded and converted successfully.', docxPath: docxFilename });

        });

        processor.on('error', (error) => {
            console.error('Error during PDF extraction:', error);
            res.status(500).json({ message: 'PDF extraction failed.', error: error.message });
        });
    } catch (error) {
        console.error('Error converting file:', error);
        res.status(500).json({ message: 'File conversion failed.', error: error.message });
    }
};
