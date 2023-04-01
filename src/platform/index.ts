type Props = {
  id?: string;
  children?: (string | Node | undefined | false)[];
  class?: string | Record<string, boolean>;
};

export function div(props: Props) {
  return assignProps(document.createElement("div"), props);
}

type ImageProps = Props & {
  src: string;
};
export function img(props: ImageProps) {
  const img = assignProps(document.createElement("img"), props);
  img.src = props.src;
  return img;
}

export function span(props: Props) {
  return assignProps(document.createElement("span"), props);
}

export function ul(props: Props) {
  return assignProps(document.createElement("ul"), props);
}

export function li(props: Props) {
  return assignProps(document.createElement("li"), props);
}

function assignProps<T extends HTMLElement>(el: T, props: Props): T {
  if (typeof props.class === "string") el.className = props.class;

  if (typeof props.class === "object") {
    for (const className in props.class) {
      if (props.class[className]) el.classList.add(className);
    }
  }

  if (props.children) {
    for (const child of props.children) {
      if (child) el.append(child);
    }
  }

  if (props.id) el.id = props.id;

  return el;
}
