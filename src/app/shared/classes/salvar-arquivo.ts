/** Entrega um Blob ao navegador como download, com o nome informado. */
export function salvarArquivo(blob: Blob, nome: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  window.URL.revokeObjectURL(url);
}
