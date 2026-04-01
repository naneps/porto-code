import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { PortfolioData } from '../App/types';

const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_SECTION = 12;
const FONT_SIZE_NAME = 22;
const LINE_HEIGHT = 1.5;
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

/** Draws text and returns how much vertical space was consumed. */
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = TEXT,
  maxWidth?: number
): number {
  const options: any = { x, y, font, size, color, lineHeight: size * LINE_HEIGHT };
  if (maxWidth) options.maxWidth = maxWidth;
  page.drawText(text, options);
  return maxWidth
    ? measureWrappedHeight(text, font, size, maxWidth)
    : size * LINE_HEIGHT;
}

/** Draws a thin horizontal rule. */
function drawRule(page: PDFPage, y: number, pageWidth: number) {
  page.drawLine({
    start: { x: MARGIN, y },
    end:   { x: pageWidth - MARGIN, y },
    thickness: 0.5,
    color: DIVIDER,
  });
}

/** Draws a blue accent section header + rule, returns height consumed. */
function drawSectionHeader(
  page: PDFPage,
  title: string,
  y: number,
  pageWidth: number,
  boldFont: PDFFont
): number {
  let consumed = 0;
  consumed += drawText(page, title.toUpperCase(), MARGIN, y - consumed, boldFont, FONT_SIZE_SECTION, ACCENT);
  consumed += 3;
  drawRule(page, y - consumed, pageWidth);
  consumed += 6;
  return consumed;
}

// ─── main export ──────────────────────────────────────────────────────────────

export async function createCV_PDF(data: PortfolioData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const contentWidth = width - CONTENT_WIDTH_OFFSET;
  let y = height - MARGIN;

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── HEADER ────────────────────────────────────────────────────────────────
  y -= drawText(page, data.name, MARGIN, y, bold, FONT_SIZE_NAME, ACCENT);
  if (data.role) {
    y -= drawText(page, data.role, MARGIN, y, regular, FONT_SIZE_NORMAL + 1, MUTED);
  }
  y -= 4;

  const contactParts: string[] = [data.email, data.phone];
  if (data.address?.full)  contactParts.push(data.address.full);
  if (data.linkedIn)       contactParts.push(data.linkedIn.replace(/^https?:\/\//, ''));
  y -= drawText(page, contactParts.join('  |  '), MARGIN, y, regular, FONT_SIZE_NORMAL - 1, MUTED, contentWidth);
  y -= 12;

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  if (data.summary) {
    y -= drawSectionHeader(page, 'Professional Summary', y, width, bold);
    y -= drawText(page, data.summary, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
    y -= 10;
  }

  // ── TECHNICAL SKILLS ──────────────────────────────────────────────────────
  if (data.skills?.length) {
    y -= drawSectionHeader(page, 'Technical Skills', y, width, bold);

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
      y -= drawText(page, line, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
      y -= 2;
    }

    // Remaining skills not in any category
    const categorised = categories.flatMap(c => c.keys);
    const rest = data.skills.filter(s => !categorised.includes(s));
    if (rest.length) {
      y -= drawText(page, `Other: ${rest.join(', ')}`, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
      y -= 2;
    }
    y -= 8;
  }

  // ── WORK EXPERIENCE ───────────────────────────────────────────────────────
  if (data.work_experience?.length) {
    y -= drawSectionHeader(page, 'Work Experience', y, width, bold);
    for (const exp of data.work_experience) {
      const header = `${exp.role}  —  ${exp.company}`;
      y -= drawText(page, header, MARGIN, y, bold, FONT_SIZE_NORMAL);
      y -= drawText(page, exp.period, MARGIN, y, regular, FONT_SIZE_NORMAL - 1, MUTED);
      y -= 2;
      if (exp.description) {
        y -= drawText(page, exp.description, MARGIN + 10, y, regular, FONT_SIZE_NORMAL - 1, MUTED, contentWidth - 10);
      }
      y -= 8;
    }
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  if (data.education?.length) {
    y -= drawSectionHeader(page, 'Education', y, width, bold);
    for (const edu of data.education) {
      const header = `${edu.school}  (${edu.period})`;
      y -= drawText(page, header, MARGIN, y, bold, FONT_SIZE_NORMAL);
      const detail = edu.gpa ? `${edu.major}  •  GPA: ${edu.gpa}` : edu.major;
      y -= drawText(page, detail, MARGIN + 10, y, regular, FONT_SIZE_NORMAL - 1, MUTED);
      y -= 8;
    }
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  if (data.certifications?.length) {
    y -= drawSectionHeader(page, 'Certifications', y, width, bold);
    for (const cert of data.certifications) {
      const line = cert.year
        ? `${cert.issuer}  —  ${cert.title}  (${cert.year})`
        : `${cert.issuer}  —  ${cert.title}`;
      y -= drawText(page, `• ${line}`, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
      y -= 3;
    }
    y -= 5;
  }

  // ── ADDITIONAL ────────────────────────────────────────────────────────────
  const hasAdditional = data.availability || data.languages?.length;
  if (hasAdditional) {
    y -= drawSectionHeader(page, 'Additional', y, width, bold);
    if (data.availability) {
      y -= drawText(page, `Availability: ${data.availability}`, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
      y -= 3;
    }
    if (data.languages?.length) {
      y -= drawText(page, `Languages: ${data.languages.join(', ')}`, MARGIN, y, regular, FONT_SIZE_NORMAL, TEXT, contentWidth);
    }
  }

  return await pdfDoc.save();
}