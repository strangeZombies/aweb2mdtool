import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import turndownPluginGfm from '@joplin/turndown-plugin-gfm';
import { Readability } from '@mozilla/readability';

class TurndownConverter {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService();
    this.turndownService.use(turndownPluginGfm.gfm);
    this.turndownService.remove('style');
  }

  /**
   * Generate YAML front matter from the document.
   * @returns {string} The YAML front matter.
   */
  private generateYamlHeader(): string {
    const title = document.title || 'Untitled Document';
    const author = this.getAuthor() || 'Unknown Author';
    const date = new Date().toISOString();

    return `---
title: "${title}"
author: "${author}"
date: "${date}"
---\n`;
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
    const doc = new JSDOM(document.documentElement.outerHTML).window.document;
    const article = new Readability(doc).parse();

    if (article) {
      const yamlHeader = this.generateYamlHeader();
      const markdownContent = this.turndownService.turndown(article.content);
      return `${yamlHeader}${markdownContent}`;
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
      const selectedText = selection.toString();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedText;
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
