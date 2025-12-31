export const usePrint = () => {
  const printLabel = (copyCode: string) => {
    if (!copyCode) return;

    const printWindow = window.open("", "_blank", "width=400,height=300");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Código</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .code { font-size: 24px; font-weight: bold; border: 2px solid #000; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="code">${copyCode}</div>
          <script>
            window.onload = function() { window.focus(); window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printLabels = (copies: any[]) => {
    if (!copies || copies.length === 0) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const codesHtml = copies.map(c => `
        <div class="label-container">
            <div class="code">${c.copyCode}</div>
            <div class="meta">${c.status === 'AVAILABLE' ? 'Disponível' : c.status}</div>
        </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Códigos</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .grid { display: flex; flex-wrap: wrap; gap: 20px; }
            .label-container { 
                border: 2px solid #000; 
                padding: 15px; 
                width: 150px; 
                text-align: center; 
                page-break-inside: avoid;
            }
            .code { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .meta { font-size: 12px; color: #666; }
            @media print {
                .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Imprimir</button>
          </div>
          <div class="grid">
            ${codesHtml}
          </div>
          <script>
            // window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return {
    printLabel,
    printLabels
  };
};
