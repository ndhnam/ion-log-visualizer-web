export function pythonBytesStringToUint8Array(str) {
  // Loại bỏ tiền tố "b'" và hậu tố "'"
  if (str.startsWith("b'") && str.endsWith("'")) {
    str = str.slice(2, -1);
  }
  // Giải mã mọi escape \\xHH thành byte, còn lại đẩy char code
  const bytes = [];
  for (let i = 0; i < str.length; ) {
    if (str[i] === "\\" && str[i + 1] === "x") {
      const hex = str.slice(i + 2, i + 4);
      bytes.push(parseInt(hex, 16));
      i += 4;
    } else if (str[i] === "\\" && str[i + 1] === "'") {
      // Escape ký tự nháy đơn \'
      bytes.push("'".charCodeAt(0));
      i += 2;
    } else if (str[i] === "\\" && str[i + 1] === "\\") {
      // Escape ký tự \
      bytes.push("\\".charCodeAt(0));
      i += 2;
    } else {
      bytes.push(str.charCodeAt(i));
      i += 1;
    }
  }
  return new Uint8Array(bytes);
}
