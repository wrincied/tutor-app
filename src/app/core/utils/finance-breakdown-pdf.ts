import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

export interface FinanceBreakdownPdfSummaryLine {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface FinanceBreakdownPdfLessonRow {
  date: string;
  student: string;
  status: string;
  duration: string;
  amount: string;
}

export interface FinanceBreakdownPdfExpenseRow {
  date: string;
  title: string;
  category: string;
  amount: string;
  original?: string;
}

export interface FinanceBreakdownPdfOptions {
  filename: string;
  title: string;
  periodLabel: string;
  currency: string;
  intro: string;
  generatedAtLabel: string;
  generatedAt: string;
  summaryTitle: string;
  summaryLines: FinanceBreakdownPdfSummaryLine[];
  lessonsSectionTitle?: string;
  lessonsEmpty?: string;
  lessonHeaders: [string, string, string, string, string];
  lessons: FinanceBreakdownPdfLessonRow[];
  expensesSectionTitle?: string;
  expensesEmpty?: string;
  expenseHeaders: [string, string, string, string];
  expenses: FinanceBreakdownPdfExpenseRow[];
  taxSectionTitle?: string;
  taxLines?: FinanceBreakdownPdfSummaryLine[];
}

async function loadPdfMake() {
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
  const pdfMake = pdfMakeModule.default;
  const pdfFonts = pdfFontsModule.default;

  if (typeof pdfMake.addVirtualFileSystem === 'function') {
    pdfMake.addVirtualFileSystem(pdfFonts);
  } else {
    const legacyFonts = pdfFonts as { pdfMake?: { vfs: unknown } };
    (pdfMake as { vfs?: unknown }).vfs = legacyFonts.pdfMake?.vfs ?? pdfFonts;
  }

  return pdfMake;
}

function summaryBlock(title: string, lines: FinanceBreakdownPdfSummaryLine[]): Content {
  return {
    stack: [
      { text: title, style: 'sectionTitle', margin: [0, 12, 0, 6] },
      {
        table: {
          widths: ['*', 'auto'],
          body: lines.map((line) => [
            { text: line.label, style: line.highlight ? 'summaryLabelBold' : 'summaryLabel' },
            {
              text: line.value,
              style: line.highlight ? 'summaryValueBold' : 'summaryValue',
              alignment: 'right',
            },
          ]),
        },
        layout: 'noBorders',
      },
    ],
  };
}

function tableSection(
  title: string,
  headers: string[],
  widths: (string | number)[],
  rows: Content[][],
  emptyText?: string,
): Content[] {
  const section: Content[] = [
    { text: title, style: 'sectionTitle', margin: [0, 16, 0, 6] },
  ];

  if (rows.length === 0) {
    if (emptyText) {
      section.push({ text: emptyText, style: 'hint' });
    }
    return section;
  }

  section.push({
    table: {
      headerRows: 1,
      widths,
      body: [headers.map((header) => ({ text: header, style: 'tableHeader' })), ...rows],
    },
    layout: 'lightHorizontalLines',
  });

  return section;
}

export async function downloadFinanceBreakdownPdf(options: FinanceBreakdownPdfOptions): Promise<void> {
  const pdfMake = await loadPdfMake();
  const content: Content[] = [
    { text: options.title, style: 'title' },
    {
      text: `${options.periodLabel} · ${options.currency}`,
      style: 'meta',
      margin: [0, 4, 0, 12],
    },
    { text: options.intro, style: 'intro' },
    summaryBlock(options.summaryTitle, options.summaryLines),
  ];

  if (options.lessonsSectionTitle) {
    content.push(
      ...tableSection(
        options.lessonsSectionTitle,
        [...options.lessonHeaders],
        ['auto', '*', 'auto', 'auto', 'auto'],
        options.lessons.map((lesson) => [
          lesson.date,
          lesson.student,
          lesson.status,
          lesson.duration,
          { text: lesson.amount, alignment: 'right' },
        ]),
        options.lessonsEmpty,
      ),
    );
  }

  if (options.expensesSectionTitle) {
    content.push(
      ...tableSection(
        options.expensesSectionTitle,
        [...options.expenseHeaders],
        ['auto', '*', 'auto', 'auto'],
        options.expenses.map((expense) => {
          const row: Content[] = [
            expense.date,
            expense.title,
            expense.category,
            { text: expense.amount, alignment: 'right' },
          ];
          return row;
        }),
        options.expensesEmpty,
      ),
    );

    const expensesWithOriginal = options.expenses.filter((expense) => expense.original);
    if (expensesWithOriginal.length > 0) {
      content.push({
        stack: expensesWithOriginal.map((expense) => ({
          text: `${expense.title}: ${expense.original}`,
          style: 'hint',
          margin: [0, 2, 0, 0],
        })),
        margin: [0, 4, 0, 0],
      });
    }
  }

  if (options.taxSectionTitle && options.taxLines?.length) {
    content.push(summaryBlock(options.taxSectionTitle, options.taxLines));
  }

  content.push({
    text: `${options.generatedAtLabel}: ${options.generatedAt}`,
    style: 'footer',
    margin: [0, 24, 0, 0],
  });

  const docDefinition: TDocumentDefinitions = {
    content,
    defaultStyle: { font: 'Roboto', fontSize: 9 },
    styles: {
      title: { fontSize: 16, bold: true },
      meta: { fontSize: 10, color: '#666666' },
      intro: { fontSize: 9, color: '#444444', lineHeight: 1.35 },
      sectionTitle: { fontSize: 11, bold: true },
      hint: { fontSize: 9, italics: true, color: '#666666' },
      tableHeader: { bold: true, fontSize: 8, fillColor: '#f0f0f0' },
      summaryLabel: { fontSize: 9 },
      summaryLabelBold: { fontSize: 9, bold: true },
      summaryValue: { fontSize: 9, alignment: 'right' },
      summaryValueBold: { fontSize: 9, bold: true, alignment: 'right' },
      footer: { fontSize: 8, color: '#999999' },
    },
    pageMargins: [40, 48, 40, 48],
  };

  pdfMake.createPdf(docDefinition).download(options.filename);
}
