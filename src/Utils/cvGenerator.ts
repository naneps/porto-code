import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { PortfolioData } from '../App/types';

const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_SECTION = 12;
const FONT_SIZE_NAME = 22;
const LINE_HEIGHT = 1.4;
const MARGIN = 50;
const CONTENT_WIDTH_OFFSET = 2 * MARGIN;

const ACCENT  = rgb(0 / 255, 122 / 255, 204 / 255); // #007ACC
const TEXT    = rgb(0.1,  0.1,  0.1);
const MUTED   = rgb(0.4,  0.4,  0.4);
const DIVIDER = rgb(0.82, 0.82, 0.82);

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Wraps text and returns the total rendered height (in PDF points). */
function measureWrappedHeight(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): number {
  let totalHeight = 0;
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        totalHeight += size * LINE_HEIGHT;
        line = word;
      } else {
        line = test;
      }
    }
    totalHeight += size * LINE_HEIGHT; // last line of paragraph
  }
  return totalHeight;
}

class PDFContext {
  pdfDoc: PDFDocument;
  currentPage: PDFPage;
  y: number;
  width: number;
  height: number;
  regularFont: PDFFont;
  boldFont: PDFFont;

  constructor(pdfDoc: PDFDocument, startPage: PDFPage, regularFont: PDFFont, boldFont: PDFFont) {
    this.pdfDoc = pdfDoc;
    this.currentPage = startPage;
    const { width, height } = startPage.getSize();
    this.width = width;
    this.height = height;
    this.y = height - MARGIN;
    this.regularFont = regularFont;
    this.boldFont = boldFont;
  }

  ensureSpace(neededHeight: number) {
    if (this.y - neededHeight < MARGIN) {
      this.currentPage = this.pdfDoc.addPage();
      this.y = this.height - MARGIN;
    }
  }

  drawText(text: string, size: number, isBold: boolean, color = TEXT, maxWidth?: number, xOffset = 0) {
    const font = isBold ? this.boldFont : this.regularFont;
    const actualMaxWidth = maxWidth || (this.width - CONTENT_WIDTH_OFFSET - xOffset);
    const heightConsumed = measureWrappedHeight(text, font, size, actualMaxWidth);
    
    this.ensureSpace(heightConsumed);
    
    this.currentPage.drawText(text, {
      x: MARGIN + xOffset,
      y: this.y - size,
      font,
      size,
      color,
      lineHeight: size * LINE_HEIGHT,
      maxWidth: actualMaxWidth
    });
    
    this.y -= heightConsumed;
  }

  drawSectionHeader(title: string) {
    const font = this.boldFont;
    const headerHeight = FONT_SIZE_SECTION * LINE_HEIGHT + 3 + 6 + 10;
    this.ensureSpace(headerHeight);
    
    this.currentPage.drawText(title.toUpperCase(), {
      x: MARGIN,
      y: this.y - FONT_SIZE_SECTION,
      font,
      size: FONT_SIZE_SECTION,
      color: ACCENT
    });
    this.y -= FONT_SIZE_SECTION * LINE_HEIGHT + 3;
    
    this.currentPage.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: this.width - MARGIN, y: this.y },
      thickness: 0.5,
      color: DIVIDER,
    });
    this.y -= 6 + 10;
  }
}

// ─── main export ──────────────────────────────────────────────────────────────

export async function createCV_PDF(data: PortfolioData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage();
  
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const ctx = new PDFContext(pdfDoc, page, regular, bold);

  // ── HEADER ────────────────────────────────────────────────────────────────
  ctx.drawText(data.name, FONT_SIZE_NAME, true, ACCENT);
  if (data.role) {
    ctx.drawText(data.role, FONT_SIZE_NORMAL + 1, false, MUTED);
  }
  ctx.y -= 4;

  const contactParts: string[] = [data.email, data.phone];
  if (data.address?.full)  contactParts.push(data.address.full);
  if (data.linkedIn)       contactParts.push(data.linkedIn.replace(/^https?:\/\//, ''));
  ctx.drawText(contactParts.join('  |  '), FONT_SIZE_NORMAL - 1, false, MUTED);
  ctx.y -= 12;

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  if (data.summary) {
    ctx.drawSectionHeader('Professional Summary');
    ctx.drawText(data.summary, FONT_SIZE_NORMAL, false, TEXT);
    ctx.y -= 10;
  }

  // ── TECHNICAL SKILLS ──────────────────────────────────────────────────────
  if (data.skills?.length) {
    ctx.drawSectionHeader('Technical Skills');

    // Group skills into categories matching the data order
    const categories: { label: string; keys: string[] }[] = [
      { label: 'Mobile',   keys: ['Flutter', 'Dart', 'Firebase', 'REST API', 'State Management (Provider, GetX)', 'Freezed', 'Google ML Kit'] },
      { label: 'Frontend', keys: ['Vue.js', 'Nuxt.js', 'React', 'HTML', 'CSS'] },
      { label: 'Backend',  keys: ['PHP', 'Laravel'] },
      { label: 'Tools',    keys: ['Git', 'GitHub', 'CI/CD', 'Figma', 'Prompt Engineering AI'] },
    ];

    for (const cat of categories) {
      const matched = data.skills.filter(s => cat.keys.includes(s));
      if (!matched.length) continue;
      const line = `${cat.label}: ${matched.join(', ')}`;
      ctx.drawText(line, FONT_SIZE_NORMAL, false, TEXT);
      ctx.y -= 2;
    }

    // Remaining skills not in any category
    const categorised = categories.flatMap(c => c.keys);
    const rest = data.skills.filter(s => !categorised.includes(s));
    if (rest.length) {
      ctx.drawText(`Other: ${rest.join(', ')}`, FONT_SIZE_NORMAL, false, TEXT);
      ctx.y -= 2;
    }
    ctx.y -= 8;
  }

  // ── WORK EXPERIENCE ───────────────────────────────────────────────────────
  if (data.work_experience?.length) {
    ctx.drawSectionHeader('Work Experience');
    for (const exp of data.work_experience) {
      const header = `${exp.role}  —  ${exp.company}`;
      ctx.drawText(header, FONT_SIZE_NORMAL, true, TEXT);
      ctx.drawText(exp.period, FONT_SIZE_NORMAL - 1, false, MUTED);
      ctx.y -= 2;
      if (exp.description) {
        ctx.drawText(exp.description, FONT_SIZE_NORMAL - 1, false, MUTED, undefined, 10);
      }
      ctx.y -= 8;
    }
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  if (data.education?.length) {
    ctx.drawSectionHeader('Education');
    for (const edu of data.education) {
      const header = `${edu.school}  (${edu.period})`;
      ctx.drawText(header, FONT_SIZE_NORMAL, true, TEXT);
      const detail = edu.gpa ? `${edu.major}  •  GPA: ${edu.gpa}` : edu.major;
      ctx.drawText(detail, FONT_SIZE_NORMAL - 1, false, MUTED, undefined, 10);
      ctx.y -= 8;
    }
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  if (data.certifications?.length) {
    ctx.drawSectionHeader('Certifications');
    for (const cert of data.certifications) {
      const line = cert.year
        ? `${cert.issuer}  —  ${cert.title}  (${cert.year})`
        : `${cert.issuer}  —  ${cert.title}`;
      ctx.drawText(`• ${line}`, FONT_SIZE_NORMAL, false, TEXT);
      ctx.y -= 3;
    }
    ctx.y -= 5;
  }

  // ── ADDITIONAL ────────────────────────────────────────────────────────────
  const hasAdditional = data.availability || data.languages?.length;
  if (hasAdditional) {
    ctx.drawSectionHeader('Additional');
    if (data.availability) {
      ctx.drawText(`Availability: ${data.availability}`, FONT_SIZE_NORMAL, false, TEXT);
      ctx.y -= 3;
    }
    if (data.languages?.length) {
      ctx.drawText(`Languages: ${data.languages.join(', ')}`, FONT_SIZE_NORMAL, false, TEXT);
    }
  }

  return await pdfDoc.save();
}