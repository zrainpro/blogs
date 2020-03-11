window.insertAfter = function (target, element, parents) {
  const parent = target.parentElement || parents || document.body;
  if (target.nextSibling) {
    parent.insertBefore(element, target.nextSibling);
  } else {
    parent.appendChild(element);
  }
}
