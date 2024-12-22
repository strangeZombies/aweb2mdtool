import YAML from 'yaml';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { Readability } from '@mozilla/readability';
import urlMetadata from 'url-metadata';

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
    this.turndownService.use(gfm);
    this.turndownService.remove('style');
  }

  private formatDate(date: Date = new Date()): string {
    return date.toISOString(); // Simplified to use ISO string format
  }

  private async fetchMetadata(url: string): Promise<any> {
    try {
      return await urlMetadata(url);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return {};
    }
  }

  private async generateYamlHeader(): Promise<string> {
    const title = document.title || 'Untitled Document';
    const url = window.location.href;
    const metadata = await this.fetchMetadata(url);

    const { description = '', author = '匿名', keywords = '' } = metadata;

    // Extract article tags from meta tags
    const articleTagsArray = Array.from(
      document.querySelectorAll('meta[property="article:tag"]'),
    ).map((tag) => tag.content);

    // Extract publication date from meta tags
    const publicationDateMeta = document.querySelector('meta[property="article:published_time"]');
    const published = publicationDateMeta ? publicationDateMeta.getAttribute('content') : '';

    const yamlObj = {
      category: '[[Clippings]]',
      author,
      title,
      source: url,
      clipped: this.formatDate(),
      published, // Include the extracted publication date
      description,
      tags: [...new Set([...articleTagsArray, ...keywords.split(',').map((tag) => tag.trim())])], // Combine and deduplicate tags
    };

    return YAML.stringify(yamlObj, { indent: 2 });
  }

  public async convertPageToMarkdown(): Promise<string> {
    const docClone = document.cloneNode(true) as Document;
    const article = new Readability(docClone).parse();

    if (!article) {
      throw new Error('Could not parse the article.');
    }

    const yamlHeader = await this.generateYamlHeader();
    const markdownContent = this.turndownService.turndown(article.content);
    return `---\n${yamlHeader}---\n\n${markdownContent}`;
  }

  public convertSelectionToMarkdown(): string | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(range.cloneContents());
      return this.turndownService.turndown(tempDiv.innerHTML);
    }
    throw new Error('No text selected.');
  }
}

// Create an instance of the converter
const turndownConverter = new TurndownConverter();

// Export the methods for global access
export const convertPageToMarkdown = async () => await turndownConverter.convertPageToMarkdown();
export const convertSelectionToMarkdown = () => turndownConverter.convertSelectionToMarkdown();
