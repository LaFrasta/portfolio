export type TokenKind = 'k' | 's' | 'c' | 'a' | 't' | 'n' | '';
export type Token = [TokenKind, string];

const KEYWORDS = new Set(
  'import from export default const let var return function class record public private static final async await new if else try catch for of in type interface extends implements void true false null SELECT FROM WHERE JOIN ON GROUP BY ORDER DESC AS COUNT BEGIN END LOOP COMMIT FETCH FIRST ROWS ONLY'.split(
    ' ',
  ),
);

const TOKEN_RE =
  /(\/\/.*|--.*)|('[^']*'|"[^"]*"|`[^`]*`)|(@\w+)|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([\s\S])/g;

// Tiny multi-language highlighter: enough for short display snippets, not a parser
export function highlight(code: string): Token[] {
  const out: Token[] = [];
  for (const m of code.matchAll(TOKEN_RE)) {
    if (m[1]) out.push(['c', m[1]]);
    else if (m[2]) out.push(['s', m[2]]);
    else if (m[3]) out.push(['a', m[3]]);
    else if (m[4]) out.push(['t', m[4]]);
    else if (m[5]) out.push(['n', m[5]]);
    else if (m[6]) out.push([KEYWORDS.has(m[6]) ? 'k' : '', m[6]]);
    else out.push(['', m[7]]);
  }
  return out;
}
