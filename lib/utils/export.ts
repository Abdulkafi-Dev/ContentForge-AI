export async function exportToPDF(content: string, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('ContentForge AI — Generated Content', margin, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 30)

  doc.setTextColor(0)
  doc.setFontSize(11)

  const lines = doc.splitTextToSize(content, maxWidth)
  doc.text(lines, margin, 45)

  doc.save(`${filename}.pdf`)
}

export function exportToTXT(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
