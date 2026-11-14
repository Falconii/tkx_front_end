import { Directive, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * Troca de página pelo arrasto no celular (listas paginadas):
 *   - arrastar PARA CIMA estando no FIM da lista    -> (proxima)
 *   - arrastar PARA BAIXO estando no TOPO da lista  -> (anterior)
 * Só vale quando o dedo COMEÇA o arrasto na borda correspondente; no meio da lista o arrasto
 * continua sendo só rolagem. Quem usa decide o que fazer (limites de página, recarregar etc.).
 * O "puxar para atualizar" do navegador é bloqueado em styles.scss (overscroll-behavior).
 */
@Directive({
  selector: '[appSwipePagina]',
})
export class SwipePaginaDirective implements OnInit, OnDestroy {
  @Output() proxima = new EventEmitter<void>();
  @Output() anterior = new EventEmitter<void>();

  private readonly DISTANCIA_MIN = 90; // px
  private x = 0;
  private y = 0;
  private naBorda: { topo: boolean; fim: boolean } | null = null;
  private rolavel: HTMLElement | null = null;

  constructor(private zone: NgZone) {}

  private onStart = (e: TouchEvent) => {
    this.naBorda = null;
    if (e.touches.length !== 1) return;
    const alvo = e.target as HTMLElement | null;
    // não interfere em campos, diálogos e menus
    if (alvo?.closest('input, textarea, mat-select, .cdk-overlay-container, mat-toolbar')) return;

    const el = this.elementoRolavel();
    const topo = el.scrollTop <= 1;
    const fim = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    this.rolavel = el;
    this.x = e.touches[0].clientX;
    this.y = e.touches[0].clientY;
    this.naBorda = { topo, fim };
  };

  private onEnd = (e: TouchEvent) => {
    const borda = this.naBorda;
    this.naBorda = null;
    if (!borda || e.changedTouches.length === 0) return;

    const dx = e.changedTouches[0].clientX - this.x;
    const dy = e.changedTouches[0].clientY - this.y;
    if (Math.abs(dy) < this.DISTANCIA_MIN || Math.abs(dy) < Math.abs(dx) * 1.5) return;

    const acao = dy < 0 && borda.fim ? this.proxima : dy > 0 && borda.topo ? this.anterior : null;
    if (!acao) return;
    this.zone.run(() => acao.emit());
    this.rolavel?.scrollTo({ top: 0 }); // a nova página começa do topo
  };

  ngOnInit(): void {
    // fora do Angular: só volta para a zona quando há troca de página
    this.zone.runOutsideAngular(() => {
      document.addEventListener('touchstart', this.onStart, { passive: true });
      document.addEventListener('touchend', this.onEnd, { passive: true });
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('touchstart', this.onStart);
    document.removeEventListener('touchend', this.onEnd);
  }

  /** quem rola a tela: o conteúdo do sidenav (layout principal) ou a própria página */
  private elementoRolavel(): HTMLElement {
    return (
      (document.querySelector('mat-sidenav-content') as HTMLElement | null) ??
      (document.scrollingElement as HTMLElement)
    );
  }
}
