export function isEditable(el: Element | null) {
  return (
    !!el &&
    (el.matches('input, textarea, select, [contenteditable="true"]') ||
      (el as HTMLElement).isContentEditable)
  );
}

export function watchSoftKeyboard(
  onChange: (visible: boolean) => void
): () => void {
  const onFocusChange = () => onChange(isEditable(document.activeElement));

  document.addEventListener('focusin', onFocusChange);
  document.addEventListener('focusout', onFocusChange);

  let initialVVH =
    typeof window !== 'undefined' && window.visualViewport
      ? window.visualViewport.height
      : 0;
  const onVVResize = () => {
    const vv: VisualViewport | null | undefined =
      typeof window !== 'undefined' ? window.visualViewport : undefined;
    if (!vv) return;
    if (!initialVVH) initialVVH = vv.height;
    const shrunk = initialVVH - vv.height > 100;
    const focused = isEditable(document.activeElement);
    onChange(shrunk || focused);
  };
  window.visualViewport?.addEventListener('resize', onVVResize);

  return () => {
    document.removeEventListener('focusin', onFocusChange);
    document.removeEventListener('focusout', onFocusChange);
    window.visualViewport?.removeEventListener('resize', onVVResize);
  };
}
