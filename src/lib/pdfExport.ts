// Client-only — never imported from server components.
// Captures #letter-print-root via an off-screen clone (bypasses zoom:scale
// parent transform) then saves as an A4 PDF using jsPDF + html2canvas.

const ELEMENT_ID = 'letter-print-root';
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function exportLetterToPDF(letterNumber?: string): Promise<void> {
  const source = document.getElementById(ELEMENT_ID);
  if (!source) {
    throw new Error(`Element #${ELEMENT_ID} not found in DOM.`);
  }

  // Build an off-screen container at full 794px with no parent transforms
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:-99999px;left:0;width:794px;background:#fff;' +
    'overflow:visible;z-index:-9999;';

  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.cssText += ';transform:none!important;zoom:1!important;width:794px;';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Wait for fonts + two paint frames so everything is fully rendered
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    // Dynamic import to keep the bundle tree-shaken on the server
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);
    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jsPDFModule;

    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: clone.scrollHeight,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfW = pdf.internal.pageSize.getWidth();  // 210mm
    const pdfH = pdf.internal.pageSize.getHeight(); // 297mm

    // Scale canvas height into mm at the same ratio as width (210mm / 794px)
    const mmPerPx = A4_WIDTH_MM / 794;
    const imgHeightMM = canvas.height * mmPerPx * (1 / 3); // ÷3 because scale:3

    if (imgHeightMM <= pdfH + 0.5) {
      // Single page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgHeightMM);
    } else {
      // Multi-page slice
      const pxPerPage = (pdfH / mmPerPx) * 3; // in canvas pixels (scale:3)
      let offsetPx = 0;
      let firstPage = true;

      while (offsetPx < canvas.height) {
        if (!firstPage) pdf.addPage();
        firstPage = false;

        const sliceH = Math.min(pxPerPage, canvas.height - offsetPx);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, -offsetPx);

        const sliceData = sliceCanvas.toDataURL('image/png');
        const sliceHeightMM = (sliceH / 3) * mmPerPx;
        pdf.addImage(sliceData, 'PNG', 0, 0, pdfW, sliceHeightMM);
        offsetPx += sliceH;
      }
    }

    const filename = `نامه-${letterNumber || 'بدون-شماره'}.pdf`;
    pdf.save(filename);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
