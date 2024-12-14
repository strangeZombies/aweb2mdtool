declare module '*.css?inline' {
  const content: string; // content 将包含 CSS 文件的内容作为字符串
  export default content;
}
