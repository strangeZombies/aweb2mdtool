import YAML from 'yaml';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { Readability } from '@mozilla/readability';

class TurndownConverter {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    });
    this.turndownService.use(gfm); // Use the gfm plugin directly
    this.turndownService.remove('style');
  }

  private formatDate(date = new Date()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  /**
   * Generate YAML front matter from the document.
   * @returns {string} The YAML front matter.
   */
  private generateYamlHeader(): string {
    return YAML.stringify(
      {
        category: '[[Clippings]]',
        author: this.getAuthor() || '匿名',
        title: document.title || 'Untitled Document',
        source: window.location.href,
        clipped: this.formatDate(), // Only the date part
        published: '', // Empty published field
        topics: '', // Empty topics field
        tags: ['clippings', 'obsidian快捷键'],
      },
      { indent: 2 },
    ); // YAML indentation
  }

  /**
   * Get the author from the page's meta tags or other elements.
   * @returns {string|null} The author name or null if not found.
   */
  private getAuthor(): string | null {
    const authorMeta = document.querySelector('meta[name="author"]');
    return authorMeta ? authorMeta.getAttribute('content') : null;
  }

  /**
   * Convert the entire page to Markdown using Readability.
   * @returns {string} The converted Markdown with YAML front matter.
   */
  public convertPageToMarkdown(): string {
    const docClone = document.cloneNode(true) as Document;
    const article = new Readability(docClone).parse();

    if (article) {
      const yamlHeader = this.generateYamlHeader();
      const markdownContent = this.turndownService.turndown(article.content);
      return `---\n${yamlHeader}---\n\n${markdownContent}`;
    }
    console.error('Could not parse the article.');
    return '';
  }

  /**
   * Convert the selected text to Markdown.
   * @returns {string|null} The converted Markdown or null if no text is selected.
   */
  public convertSelectionToMarkdown(): string | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(range.cloneContents());
      return this.turndownService.turndown(tempDiv.innerHTML);
    }
    console.error('No text selected.');
    return null;
  }
}

// Create an instance of the converter
const turndownConverter = new TurndownConverter();

// Export the methods for global access
export const convertPageToMarkdown = () => turndownConverter.convertPageToMarkdown();
export const convertSelectionToMarkdown = () => turndownConverter.convertSelectionToMarkdown();
