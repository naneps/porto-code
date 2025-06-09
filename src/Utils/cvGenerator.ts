import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import { PortfolioData } from '../App/types';

const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_LARGE = 16;
const FONT_SIZE_XLARGE = 24;
const LINE_HEIGHT = 1.4;
const MARGIN = 50;
const ACCENT_COLOR_RGB = rgb(0 / 255, 122 / 255, 204 / 255); // VSCode blue: #007ACC
const TEXT_COLOR_RGB = rgb(0.1, 0.1, 0.1); // Dark gray for text
const MUTED_TEXT_COLOR_RGB = rgb(0.4, 0.4, 0.4);

async function addText(
  page: any, // pdf-lib Page object
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = TEXT_COLOR_RGB,
  maxWidth?: number
): Promise<number> { // Returns height of text added
  const options: any = { x, y, font, size, color, lineHeight: size * LINE_HEIGHT };
  if (maxWidth) {
    options.maxWidth = maxWidth;
  }
  page.drawText(text, options);
  
  // Calculate text height (approximation)
  const lines = text.split('\n');
  let totalHeight = 0;
  for (const line of lines) {
    if (maxWidth) {
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (font.widthOfTextAtSize(testLine, size) > maxWidth && currentLine) {
                totalHeight += size * LINE_HEIGHT;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        totalHeight += size * LINE_HEIGHT; // Add height for the last or only line part
    } else {
        totalHeight += size * LINE_HEIGHT;
    }
  }
  return totalHeight;
}


export async function createCV_PDF(data: PortfolioData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - MARGIN;

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  y -= await addText(page, data.name, MARGIN, y, helveticaBold, FONT_SIZE_XLARGE, ACCENT_COLOR_RGB);
  if (data.nickname) {
    y -= await addText(page, `(${data.nickname})`, MARGIN, y, helvetica, FONT_SIZE_NORMAL, MUTED_TEXT_COLOR_RGB);
  }
  y -= FONT_SIZE_NORMAL * 0.5; // Small gap

  const contactInfo = [
    data.email,
    data.phone,
    data.linkedIn ? `LinkedIn: ${data.linkedIn.replace(/^https?:\/\//, '')}` : null,
    data.address ? data.address.full : null
  ].filter(Boolean).join('  |  ');
  y -= await addText(page, contactInfo, MARGIN, y, helvetica, FONT_SIZE_NORMAL -1, MUTED_TEXT_COLOR_RGB, width - 2 * MARGIN);
  y -= FONT_SIZE_NORMAL; // Gap after header

  // Summary
  if (data.summary) {
    y -= await addText(page, 'SUMMARY', MARGIN, y, helveticaBold, FONT_SIZE_LARGE, ACCENT_COLOR_RGB);
    y -= FONT_SIZE_NORMAL * 0.2;
    y -= await addText(page, data.summary, MARGIN, y, helvetica, FONT_SIZE_NORMAL, TEXT_COLOR_RGB, width - 2 * MARGIN);
    y -= FONT_SIZE_NORMAL;
  }

  // Current Position
  if (data.current_position) {
    y -= await addText(page, 'CURRENT POSITION', MARGIN, y, helveticaBold, FONT_SIZE_LARGE, ACCENT_COLOR_RGB);
    y -= FONT_SIZE_NORMAL * 0.2;
    const cp = data.current_position;
    let entryText = `${cp.role} at ${cp.company} (${cp.period})`;
    y -= await addText(page, entryText, MARGIN, y, helveticaBold, FONT_SIZE_NORMAL);
    if (cp.description) {
      y -= await addText(page, cp.description, MARGIN + 15, y, helvetica, FONT_SIZE_NORMAL -1, MUTED_TEXT_COLOR_RGB, width - 2 * MARGIN - 15);
    }
    y -= FONT_SIZE_NORMAL;
  }

  // Work Experience
  const otherExperience = data.work_experience.filter(exp => !(exp.company === data.current_position?.company && exp.role === data.current_position?.role && exp.period === data.current_position?.period));
  if (otherExperience.length > 0) {
    y -= await addText(page, 'WORK EXPERIENCE', MARGIN, y, helveticaBold, FONT_SIZE_LARGE, ACCENT_COLOR_RGB);
    y -= FONT_SIZE_NORMAL * 0.2;
    for (const exp of otherExperience) {
      let entryText = `${exp.role} at ${exp.company} (${exp.period})`;
      y -= await addText(page, entryText, MARGIN, y, helveticaBold, FONT_SIZE_NORMAL);
      if (exp.description) {
        y -= await addText(page, exp.description, MARGIN + 15, y, helvetica, FONT_SIZE_NORMAL - 1, MUTED_TEXT_COLOR_RGB, width - 2 * MARGIN - 15);
      }
      y -= FONT_SIZE_NORMAL * 0.5;
    }
    y -= FONT_SIZE_NORMAL * 0.5; // Extra gap after last experience
  }

  // Education
  if (data.education && data.education.length > 0) {
    y -= await addText(page, 'EDUCATION', MARGIN, y, helveticaBold, FONT_SIZE_LARGE, ACCENT_COLOR_RGB);
    y -= FONT_SIZE_NORMAL * 0.2;
    for (const edu of data.education) {
      y -= await addText(page, `${edu.school} (${edu.period})`, MARGIN, y, helveticaBold, FONT_SIZE_NORMAL);
      y -= await addText(page, edu.major, MARGIN + 15, y, helvetica, FONT_SIZE_NORMAL - 1, MUTED_TEXT_COLOR_RGB);
      y -= FONT_SIZE_NORMAL * 0.5;
    }
    y -= FONT_SIZE_NORMAL * 0.5;
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    y -= await addText(page, 'SKILLS', MARGIN, y, helveticaBold, FONT_SIZE_LARGE, ACCENT_COLOR_RGB);
    y -= FONT_SIZE_NORMAL * 0.2;
    // Simple comma-separated list for skills for now
    y -= await addText(page, data.skills.join(', '), MARGIN, y, helvetica, FONT_SIZE_NORMAL, TEXT_COLOR_RGB, width - 2 * MARGIN);
    y -= FONT_SIZE_NORMAL;
  }

  return await pdfDoc.save();
}